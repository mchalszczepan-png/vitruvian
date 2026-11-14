"""Score several LoRA adapters (and optionally the plain base model) on Modal, for the hyperparameter sweep.

Research prototype. All notes and patients are synthetic.

One container starts vLLM with every adapter loaded, then runs ml/eval.py against it on loopback,
one eval per adapter, in parallel. Results go to the Volume under /vol/sweep-results/<tag>/, so they
survive a lost client connection.

    uv run --with modal modal deploy ml/modal_sweep.py
    uv run --with modal modal run ml/modal_sweep.py --tag dev-e4b --data dev \
        --adapters e4b-s-base,e4b-s-r32 --deployed
    uv run --with modal modal volume get vitruvian-lora-vol sweep-results/dev-e4b ml/results/sweep/

--data dev scores ml/data/sweep/dev.jsonl (for choosing hyperparameters); --data eval scores the
50-note eval set (final comparison only). Adapters are run names under /vol/adapters/vitruvian-lora/.
--task triage scores the cancer pointer (ml/triage_eval.py on ml/data/triage/eval.jsonl, --data eval);
its adapters are run names under /vol/adapters/vitruvian-triage/.
"""

from __future__ import annotations

import json
import os
import subprocess
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import modal

HERE = Path(__file__).resolve().parent
VOL = modal.Volume.from_name("vitruvian-lora-vol")
ADAPTER_ROOT = "/vol/adapters"
# task -> (adapter folder under ADAPTER_ROOT, eval script, data sets)
TASKS = {
    "form": ("vitruvian-lora", "/root/ml/eval.py",
             {"dev": "/root/ml/data/sweep/dev.jsonl", "eval": "/root/ml/data/eval.jsonl"}),
    "triage": ("vitruvian-triage", "/root/ml/triage_eval.py", {"eval": "/root/ml/data/triage/eval.jsonl"}),
}
PORT = 8001
REGION = "eu"  # same as ml/modal_serve.py and ml/modal_lora.py; see the note there

app = modal.App("vitruvian-sweep-eval")

# Same vLLM pin and env as ml/modal_serve.py, plus eval.py's two dependencies and the ml/ folder.
IMAGE = (
    modal.Image.debian_slim(python_version="3.12")
    .uv_pip_install("vllm==0.32.0", "requests", "jsonschema")
    .env({"HF_HOME": "/vol/hf-cache", "VLLM_USE_FLASHINFER_SAMPLER": "0"})
    .add_local_dir(
        HERE,
        "/root/ml",
        ignore=["__pycache__", ".cache", "results", "tests", "*.pdf", ".train-prompt-completion*"],
    )
)


@app.function(image=IMAGE, gpu="H100", region=REGION, volumes={"/vol": VOL}, timeout=3 * 3600, retries=0)
def evaluate(tag: str, base_model: str, adapters: list[str], data: str, include_base: bool = False,
             task: str = "form") -> dict:
    VOL.reload()
    folder, script, sets = TASKS[task]
    ADAPTERS = f"{ADAPTER_ROOT}/{folder}"
    # Fail before the 2+ min vLLM start if this deploy's ml/ snapshot lacks the data (it happened once).
    assert Path(sets[data]).is_file(), f"{sets[data]} missing from the deployed ml/ snapshot; redeploy"
    where = {k: os.environ.get(k) for k in ("MODAL_REGION", "MODAL_CLOUD_PROVIDER")}
    print(f"sweep eval {tag} ({task}): base {base_model}, adapters {adapters}, data {data}, container {where}")

    ranks = []
    for name in adapters:
        cfg = json.loads(Path(ADAPTERS, name, "adapter_config.json").read_text())
        assert cfg["base_model_name_or_path"] == base_model, f"{name} was trained on {cfg['base_model_name_or_path']}"
        ranks.append(int(cfg["r"]))
    cmd = ["vllm", "serve", base_model, "--served-model-name", base_model, "--host", "127.0.0.1", "--port", str(PORT),
           "--dtype", "bfloat16", "--max-model-len", "8192", "--gpu-memory-utilization", "0.90"]
    if adapters:
        cmd += ["--enable-lora", "--max-loras", str(len(adapters)), "--max-lora-rank", str(max(ranks)),
                "--lora-modules", *[f"{n}={ADAPTERS}/{n}" for n in adapters]]
    server = subprocess.Popen(cmd)

    t0 = time.time()
    while True:
        assert server.poll() is None, "vLLM exited during startup"
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/health", timeout=5) as r:
                if r.status == 200:
                    break
        except OSError:
            pass
        assert time.time() - t0 < 40 * 60, "vLLM not healthy after 40 min"
        time.sleep(5)
    print(f"vLLM healthy after {time.time() - t0:.0f}s")

    out_dir = Path("/vol/sweep-results", tag)
    out_dir.mkdir(parents=True, exist_ok=True)
    key_file = Path("/tmp/dummy-key")
    key_file.write_text("unused")  # vLLM on loopback runs without a key; eval.py wants a file

    models = list(adapters) + ([base_model] if include_base else [])

    def run_one(model: str) -> tuple[str, dict]:
        label = model.replace("/", "_")
        out = out_dir / f"{label}.json"
        proc = subprocess.run(
            ["python", script, "--data", sets[data], "--label", label, "--base-url",
             f"http://127.0.0.1:{PORT}/v1", "--model", model, "--key-file", str(key_file),
             "--out", str(out), "--concurrency", "8", "--timeout", "900"],
            capture_output=True, text=True,
        )
        print(f"--- {model} (exit {proc.returncode})\n{proc.stdout[-3000:]}\n{proc.stderr[-2000:]}")
        summary = json.loads(out.read_text())["summary"]["overall"] if out.is_file() else {"error": proc.returncode}
        return model, summary

    with ThreadPoolExecutor(max_workers=len(models)) as pool:
        summaries = dict(pool.map(run_one, models))
    server.terminate()

    result = {"tag": tag, "task": task, "base_model": base_model, "data": data, "container": where, "summaries": summaries}
    (out_dir / "summary.json").write_text(json.dumps(result, indent=2))
    VOL.commit()
    return result


@app.local_entrypoint()
def main(tag: str, adapters: str = "", data: str = "dev", base_model: str = "google/gemma-4-E4B-it",
         gpu: str = "H100", include_base: bool = False, deployed: bool = False, task: str = "form"):
    assert task in TASKS and data in TASKS[task][2], f"--task {task} has data sets {list(TASKS.get(task, ('', '', {}))[2])}"
    names = [a for a in adapters.split(",") if a]
    kwargs = dict(tag=tag, base_model=base_model, adapters=names, data=data, include_base=include_base, task=task)
    if deployed:
        call = modal.Function.from_name(app.name, "evaluate").with_options(gpu=gpu).spawn(**kwargs)
        print(f"spawned {tag}, call id {call.object_id}")
        return
    print(json.dumps(evaluate.with_options(gpu=gpu).remote(**kwargs), indent=2))
