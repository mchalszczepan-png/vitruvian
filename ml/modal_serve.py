"""Serve the base Gemma and the Vitruvian LoRA with vLLM on Modal.

Research prototype. All notes and patients are synthetic.

Deploy from the repo root:
    uv run --with modal modal deploy ml/modal_serve.py

Endpoint: OpenAI-compatible /v1/chat/completions on one URL.
  model "vitruvian-lora"     -> base + LoRA adapter (from ml/modal_lora.py)
  model BASE_MODEL id        -> plain base model (prompted-Gemma fallback)
Every /v1 request needs `Authorization: Bearer <key>`; the key lives in the Modal
Secret `vitruvian-lora-api-key` (see ml/MODAL.md).

Layout inside the container:
  vLLM listens on 127.0.0.1:8001 with no key of its own (vLLM's --api-key does
  not cover /invocations, so it is not used). A small gateway on 0.0.0.0:8000
  is the only public port. It allows GET /health, and /v1/* with the bearer key
  (except the runtime LoRA load/unload routes). Everything else is 404.

Scales to zero: min_containers=0, scaledown_window=10 min, max_containers=1.
"""

from __future__ import annotations

import hmac
import http.client
import json
import os
import subprocess
import threading
import time
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import modal

# Must match BASE_MODEL in ml/modal_lora.py.
BASE_MODEL = "google/gemma-4-E4B-it"
ADAPTER_NAME = "vitruvian-lora"
ADAPTER_DIR = "/vol/adapters/vitruvian-lora/latest"  # written by ml/modal_lora.py
VOLUME_NAME = "vitruvian-lora-vol"
SECRET_NAME = "vitruvian-lora-api-key"
GPU = "A100-80GB"
PUBLIC_PORT = 8000  # gateway, what Modal exposes
UPSTREAM_PORT = 8001  # vLLM, loopback only
READY_TIMEOUT_S = 20 * 60
MAX_BODY_BYTES = 4 * 1024 * 1024

app = modal.App("vitruvian-serve")
VOL = modal.Volume.from_name(VOLUME_NAME, create_if_missing=True)
API_SECRET = modal.Secret.from_name(SECRET_NAME, required_keys=["VITRUVIAN_API_KEY"])

# vllm 0.32.0 pins torch 2.13.0 and transformers >=5.16.1,<5.20.0 itself; do not pin them here.
# Gemma 4 LoRA needs vLLM >= 0.20.0 (SupportsLoRA on the multimodal class); 0.32.0 is the newest release at least 14 days old.
SERVE_IMAGE = (
    modal.Image.debian_slim(python_version="3.12")
    .uv_pip_install("vllm==0.32.0")
    # FlashInfer's top-k sampler JIT-compiles with nvcc, which debian_slim lacks; the engine then dies at
    # warmup ("Could not find nvcc"). vLLM's PyTorch sampler needs no compiler.
    .env({"HF_HOME": "/vol/hf-cache", "VLLM_USE_FLASHINFER_SAMPLER": "0"})
)


def _vllm_command() -> list[str]:
    cmd = [
        "vllm",
        "serve",
        BASE_MODEL,
        # The plain base model answers under its own id.
        "--served-model-name",
        BASE_MODEL,
        "--host",
        "127.0.0.1",
        "--port",
        str(UPSTREAM_PORT),
        "--dtype",
        "bfloat16",
        "--max-model-len",
        "8192",
        "--gpu-memory-utilization",
        "0.90",
    ]
    cfg = Path(ADAPTER_DIR, "adapter_config.json")
    if cfg.is_file():
        rank = int(json.loads(cfg.read_text())["r"])
        cmd += [
            "--enable-lora",
            "--max-loras",
            "1",
            "--max-lora-rank",
            str(rank),
            "--lora-modules",
            f"{ADAPTER_NAME}={ADAPTER_DIR}",
        ]
    else:
        # Keep the base model up so the fallback works; the LoRA model id returns 404.
        print(f"WARNING: no adapter at {ADAPTER_DIR}; serving base model only. Run ml/modal_lora.py first.")
    return cmd


def _gateway_server(api_key: str) -> ThreadingHTTPServer:
    """Bearer-checking reverse proxy in front of loopback vLLM. Streams responses."""
    hop_by_hop = {
        "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
        "te", "trailers", "transfer-encoding", "upgrade", "host", "content-length",
        "authorization",
    }
    denied_prefixes = ("/v1/load_lora_adapter", "/v1/unload_lora_adapter")
    key_bytes = api_key.encode()

    class Gateway(BaseHTTPRequestHandler):
        server_version = "vitruvian-gateway"

        def _send_json(self, code: int, payload: dict) -> None:
            body = json.dumps(payload).encode()
            self.send_response(code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(body)

        def _authorized(self) -> bool:
            auth = self.headers.get("Authorization", "")
            token = auth[len("Bearer "):].encode() if auth.startswith("Bearer ") else b""
            return hmac.compare_digest(token, key_bytes)

        def _forward(self) -> None:
            path = self.path.split("?", 1)[0]
            if self.command == "GET" and path == "/health":
                pass  # liveness only, no key
            elif not path.startswith("/v1/") or path.startswith(denied_prefixes):
                return self._send_json(404, {"error": "not found"})
            elif not self._authorized():
                return self._send_json(401, {"error": "invalid or missing API key"})

            if "chunked" in self.headers.get("Transfer-Encoding", "").lower():
                return self._send_json(411, {"error": "send Content-Length"})
            length = int(self.headers.get("Content-Length") or 0)
            if length > MAX_BODY_BYTES:
                return self._send_json(413, {"error": "request too large"})
            body = self.rfile.read(length) if length else None

            headers = {k: v for k, v in self.headers.items() if k.lower() not in hop_by_hop}
            conn = http.client.HTTPConnection("127.0.0.1", UPSTREAM_PORT, timeout=900)
            try:
                conn.request(self.command, self.path, body=body, headers=headers)
                resp = conn.getresponse()
                self.send_response(resp.status)
                for k, v in resp.getheaders():
                    if k.lower() not in hop_by_hop:
                        self.send_header(k, v)
                self.send_header("Connection", "close")  # body ends at socket close
                self.end_headers()
                while True:
                    chunk = resp.read1(65536)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
                    self.wfile.flush()
            except OSError as exc:
                self._send_json(502, {"error": f"upstream unavailable: {exc}"})
            finally:
                conn.close()

        def do_GET(self):
            self._forward()

        def do_POST(self):
            self._forward()

        def log_message(self, fmt, *args):
            # Log method, path and status only; never headers or bodies.
            print(f"gateway {self.command} {self.path.split('?', 1)[0]} {args[1] if len(args) > 1 else ''}")

    server = ThreadingHTTPServer(("0.0.0.0", PUBLIC_PORT), Gateway)
    server.daemon_threads = True
    return server


def _open_gateway_when_ready(api_key: str) -> None:
    """Open the public port only after vLLM answers /health, so Modal's startup wait covers model load."""
    deadline = time.time() + READY_TIMEOUT_S
    url = f"http://127.0.0.1:{UPSTREAM_PORT}/health"
    while True:
        try:
            with urllib.request.urlopen(url, timeout=5) as r:
                if r.status == 200:
                    break
        except OSError:
            pass
        if time.time() > deadline:
            print("ERROR: vLLM did not become healthy in time; gateway not started")
            return
        time.sleep(5)
    print("vLLM healthy; starting gateway on", PUBLIC_PORT)
    _gateway_server(api_key).serve_forever()


@app.function(
    image=SERVE_IMAGE,
    gpu=GPU,
    volumes={"/vol": VOL},
    secrets=[API_SECRET],
    min_containers=0,
    max_containers=1,
    scaledown_window=10 * 60,
    timeout=24 * 3600,
)
@modal.concurrent(max_inputs=32)
@modal.web_server(port=PUBLIC_PORT, startup_timeout=READY_TIMEOUT_S + 60)
def serve():
    VOL.reload()  # pick up the latest committed adapter
    api_key = os.environ["VITRUVIAN_API_KEY"]
    subprocess.Popen(_vllm_command())
    threading.Thread(target=_open_gateway_when_ready, args=(api_key,), daemon=True).start()
