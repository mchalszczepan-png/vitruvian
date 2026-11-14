# Modal: LoRA training and serving (Vitruvian)

Research prototype. All notes and patients are synthetic.

Files: `ml/modal_lora.py` (train), `ml/modal_serve.py` (serve). Both must use the same
`BASE_MODEL` constant. Run all commands from the repo root.

## Base model

- `BASE_MODEL = "google/gemma-4-E4B-it"`. Official Google repo, ungated (HF API `gated: false`,
  checked 2026-11-14), Apache 2.0, so no HF token is needed.
- Size: 8.0B parameters in total (16 GB bf16 `model.safetensors`), 42 text layers, 262k vocab.
  Multimodal (text, image, audio). Training and serving use the text path only.
- `AutoModelForCausalLM` maps `gemma4` to `Gemma4ForConditionalGeneration` (checked in transformers 5.22.1).
- **Open: the base the prompted baseline uses.** The Featherless list (live call) shows
  `google/gemma-4-E4B`, which is the base model, not `-it`. The LoRA must train on the same base the
  baseline serves. Confirm which one Hackerpack serves before the training run. If it is the base
  id, change `BASE_MODEL` in both files.
- Fallback: `google/gemma-4-E2B-it` (5.1B params, 10 GB bf16 weights). Also ungated. Change
  `BASE_MODEL` in both files and retrain. vLLM LoRA support is the same as for E4B (see below).
- GPU: `A100-80GB` (default). The 262k vocab makes the logits large at `max_length 4096`, so 80 GB
  leaves headroom. A100-40GB may fit the E4B run, but it is untested.

## Pinned versions

Pins checked against PyPI release dates. Every pin is at least two weeks old as of 2026-11-14.

| Image | Pins | Release dates |
| --- | --- | --- |
| train | torch 2.14.1, transformers 5.22.1, trl 1.17.1, peft 0.21.2, accelerate 1.15.0, datasets 5.1.0 | 2026-09-30, 2026-10-30, 2026-10-30, 2026-10-01, 2026-09-09, 2026-10-05 |
| serve | vllm 0.32.0 (pulls torch 2.13.0, transformers >=5.16.1,<5.20.0) | 2026-10-18 |

Gemma 4 minimums (from release notes and `setup.py` / `requires_dist`, checked 2026-11-14):

- transformers 5.5.0 is the first release with Gemma 4. Pin 5.22.1 is above it.
- trl 1.14.0 is the first to mention Gemma 4. trl 1.15.0 has the chat-template drift fix (trl #7495).
  Pin 1.17.1 is above both.
- peft >= 0.18.0 and torch >= 2.4 (transformers 5.5.0 requirements). Pins are above both.
- vLLM LoRA on E2B/E4B: needs vLLM >= 0.20.0. v0.19.x has no `SupportsLoRA` on the multimodal class.
  v0.32.0 is the newest release at least 14 days old and has it. v0.33.0 (2026-11-02) is too new.

Not pinned: bitsandbytes (only needed for a 4-bit path, which is not used).

Training notes:

- Loss is completion-only (`completion_only_loss=True`). Do not use `assistant_only_loss`: trl #8095
  (open) reports it fails for Gemma 4 chat templates, which have no generation markers.
- The training prompt and the serving prompt are the same: `apply_chat_template(..., add_generation_prompt=True)`
  renders the same string with and without `enable_thinking=False`. The completion ends with `<turn|>`
  (token 106, an EOS id in `generation_config.json`), so the model learns to stop.

## Create the API key (never printed)

```sh
mkdir -p ~/.config/vitruvian && chmod 700 ~/.config/vitruvian
( umask 077; openssl rand -hex 32 > ~/.config/vitruvian/lora-api-key )
( umask 077; printf 'VITRUVIAN_API_KEY=%s\n' "$(cat ~/.config/vitruvian/lora-api-key)" > ~/.config/vitruvian/lora.env )
modal secret create vitruvian-lora-api-key --from-dotenv ~/.config/vitruvian/lora.env
rm -f ~/.config/vitruvian/lora.env
```

To rotate, rerun with `--force` on `modal secret create`. Keep `lora-api-key` out of the repo.

Gated models: not needed for E4B-it or E2B-it. If a future base is gated, create a Modal Secret
`hf-token` with a Hugging Face token whose account has accepted the license, and add it to the train
function.

## Commands

```sh
# 1. Train (reads ml/data/train.jsonl; never reads eval.jsonl). Deploy once, then spawn: the run lives
#    on Modal and survives this machine losing its connection (an ephemeral `modal run`, even --detach,
#    was cancelled that way). Checkpoints every 40 steps; a rerun with the same --run-name resumes.
uv run --with modal modal deploy ml/modal_lora.py
uv run --with modal modal run ml/modal_lora.py --run-name demo1 --deployed
#    options: --epochs 3 --lr 2e-4 --lora-r 16 --lora-alpha 32 --batch-size 2 --grad-accum 8
#    without --deployed it trains in the foreground and prints the result

# 2. Deploy the server (base + LoRA, scales to zero)
uv run --with modal modal deploy ml/modal_serve.py

# 3. Get the URL
uv run --with modal modal app list        # then open the vitruvian-serve app
#    expected form: https://<workspace>--vitruvian-serve-serve.modal.run
```

`modal deploy` prints the URL. Use the `/v1` path for OpenAI clients. A redeploy restarts the
container, which is how a new `latest` adapter gets loaded.

Demo: `ml/demo_warm.sh ping` 15 min before (cold start ~13 min), `ml/demo_warm.sh on` for the judging
window (1 container always up, ~$2.50/h), `ml/demo_warm.sh off` after.

## Test with eval.py

Flags checked against `ml/eval.py` (`--base-url` must end in `/v1`). Use `--timeout 600` on the
first call after idle, because the default is 120 s and a cold start can take minutes.

```sh
uv run python ml/eval.py \
  --base-url https://<workspace>--vitruvian-serve-serve.modal.run/v1 \
  --model vitruvian-lora \
  --key-file ~/.config/vitruvian/lora-api-key \
  --timeout 600 --label lora-run1
```

Plain base model (prompted-Gemma comparison on the same server): `--model google/gemma-4-E4B-it`.

Quick check without eval.py:

```sh
curl -s https://<workspace>--vitruvian-serve-serve.modal.run/health
curl -s https://<workspace>--vitruvian-serve-serve.modal.run/v1/models \
  -H "Authorization: Bearer $(cat ~/.config/vitruvian/lora-api-key)"
```

## Security notes

- Only `GET /health` is open. Every `/v1/*` route needs the bearer key. Other paths return 404.
  `/invocations` and `/metrics` are not exposed. The runtime LoRA load and unload routes are blocked.
- vLLM listens on 127.0.0.1 only. The gateway in `modal_serve.py` is the only public port.
  vLLM's own `--api-key` is not used, because it leaves `/invocations` open.

## Cost (rough)

- GPU rates, per second, from modal.com/pricing (fetched 2026-11-14; not measured):
  A100-80GB about $0.000694/s (about $2.50/h). A100-40GB about $0.000583/s (about $2.10/h).
  H100 about $0.001097/s (about $3.95/h).
- One training run: about 20 to 40 min including the first-time 16 GB model download. Roughly
  $1 to $2. Estimate, not measured.
- Serving: billed while a container is up. It stays up 10 min after the last request, then scales
  to zero. Each cold burst costs about $0.40 minimum plus the cold start, which is billed too.
  An eval pass of about 15 min is about $0.60. Estimate, not measured.
- `max_containers=1` caps spend at one GPU.

## Cold start (expected, not measured)

- First request after idle: container start plus vLLM load and CUDA graph capture, about 3 to 8 min.
  Clients should use a long timeout (eval.py `--timeout 600`) for the first call.
- Model weights come from the Volume cache (`/vol/hf-cache`), written by the training run. Without it, the first serve downloads 16 GB.

## Verification status

Checked locally, no Modal run and no spend:

- Both files compile (`compile()` on the source, no bytecode written).
- The base id is ungated (HF API), and its architecture is `Gemma4ForConditionalGeneration` with
  model_type `gemma4`. transformers 5.22.1 maps it for `AutoModelForCausalLM`.
- LoRA target regex, checked against the 16 GB E4B safetensors header (names only, no weights):
  294 language-model projection modules (42 layers x 7) match. No vision or audio module matches.
  The old regex (vision-only exclusion) also matched 36 audio-tower modules, so it was replaced.
- `build_train_rows` (extracted from `modal_lora.py` without importing `modal`) on a synthetic
  train file gives the system + user prompt and the assistant JSON. With the Gemma 4 tokenizer
  (transformers 5.22.1), the prompt is a token prefix of prompt+completion, and the trained tokens
  are the JSON plus `<turn|>`. This follows trl 1.17.1 `sft_trainer.py` (completion mask after the
  common prefix). The trl path itself was read in source, not run.
- The serving gateway, tested earlier against a fake upstream: 401 without or with a wrong key,
  200 with the right key, 404 for `/invocations`, `/metrics` and runtime LoRA routes, `GET /health` open.
- TRL 1.17.1 `SFTConfig` has `max_length` and `completion_only_loss`. vLLM 0.32.0 has `--enable-lora`,
  `--max-loras`, `--max-lora-rank`, `--lora-modules name=path`, `--served-model-name`, and declares
  `SupportsLoRA` on the Gemma 4 multimodal class (vLLM source at v0.32.0, from a read, not a run).

Not verified (needs a real Modal run):

- Image builds, GPU availability, Volume and Secret wiring.
- `SFTTrainer` on the Gemma 4 multimodal checkpoint loaded as text (the `processing_class` is a
  tokenizer, not a processor), and the `sdpa` attention choice.
- Adapter key names saved by PEFT on `Gemma4ForConditionalGeneration` and their loading into vLLM
  (`language_model` prefix mapping). No vLLM run. vLLM's tower LoRA is off by default, so the adapter
  must target the language model only, as the regex now does.
- Whether vLLM 0.32.0 runs with transformers 5.16 to 5.19 on Gemma 4 processors (its pin range).
- Streaming through the gateway (`stream: true`). Only non-streamed responses were tested.
- Whether `modal.web_server` accepts a function that returns after starting a background thread.
- Cold-start and cost numbers above.
