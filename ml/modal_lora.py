"""LoRA fine-tune of the Vitruvian referral-fields model on Modal.

Research prototype. All notes and patients are synthetic.

Run from the repo root:
    uv run --with modal modal run ml/modal_lora.py --run-name demo1

Reads ml/data/train.jsonl only (never eval.jsonl). Each record is turned into
a prompt-completion pair with ml/prompt.py::build_messages, so the training
prompt is byte-identical to the prompt used for prompted Gemma and at serving.
Loss is computed on the assistant JSON only (completion-only loss).
The adapter is written to the Modal Volume and copied to .../latest, which
ml/modal_serve.py loads.
"""

from __future__ import annotations

import json
import os
import shutil
import sys
import time
from pathlib import Path

import modal

HERE = Path(__file__).resolve().parent

# Must match BASE_MODEL in ml/modal_serve.py. Official Google repo, ungated (HF API gated=false),
# Apache 2.0. Fallback if the Featherless/Hackerpack model differs: google/gemma-4-E2B-it.
BASE_MODEL = "google/gemma-4-E4B-it"

CANCERS = {"lung", "colorectal", "ovarian"}
VOLUME_NAME = "vitruvian-lora-vol"
VOL_MOUNT = "/vol"
ADAPTER_NAME = "vitruvian-lora"
# E4B: 8.0B params, 16 GB bf16 weights, 262k-token vocab (large logits). 80 GB leaves headroom; 40 GB untested.
GPU = "A100-80GB"

app = modal.App("vitruvian-lora-train")
VOL = modal.Volume.from_name(VOLUME_NAME, create_if_missing=True)

# Pins checked against PyPI release dates (all at least two weeks old on 2026-11-14).
# Gemma 4 needs transformers >=5.5.0 (first release with gemma4); trl >=1.14.0 (first to mention Gemma 4),
# and 1.15.0+ has the chat-template drift fix (trl #7495). vllm 0.32.0 pins torch 2.13.0 and
# transformers <5.20.0, so serving lives in its own image.
TRAIN_IMAGE = (
    modal.Image.debian_slim(python_version="3.12")
    .uv_pip_install(
        "torch==2.14.1",
        "transformers==5.22.1",
        "trl==1.17.1",
        "peft==0.21.2",
        "accelerate==1.15.0",
        "datasets==5.1.0",
    )
    .env({"HF_HOME": f"{VOL_MOUNT}/hf-cache", "TOKENIZERS_PARALLELISM": "false"})
)


# ---------------------------------------------------------------- local side


def build_train_rows(train_file: Path) -> list[dict]:
    """Read train.jsonl locally and return prompt-completion rows. Refuses eval data."""
    sys.path.insert(0, str(HERE))
    from prompt import build_messages  # ml/prompt.py, the shared prompt builder

    assert train_file.name == "train.jsonl", f"training file must be train.jsonl, got {train_file.name}"
    assert "eval" not in train_file.name, "eval data must never be used for training"

    rows: list[dict] = []
    for line_no, line in enumerate(train_file.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        rec = json.loads(line)
        rec_id = rec.get("id", f"line {line_no}")
        assert rec.get("split") == "train", f"{rec_id}: split must be 'train'"
        assert rec.get("synthetic") is True, f"{rec_id}: only synthetic records allowed"
        cancer = rec.get("cancer")
        assert cancer in CANCERS, f"{rec_id}: unknown cancer {cancer!r}"
        inp, tgt = rec["input"], rec["target"]
        fields, evidence = tgt["fields"], tgt["evidence"]
        assert isinstance(fields, dict) and isinstance(evidence, dict), f"{rec_id}: fields/evidence must be objects"
        assert set(evidence) <= set(fields), f"{rec_id}: evidence keys must be a subset of fields keys"

        messages = build_messages(cancer, inp["todayNote"], inp["earlierNotes"], inp["recordFacts"])
        completion = json.dumps({"fields": fields, "evidence": evidence}, ensure_ascii=False)
        rows.append(
            {
                "prompt": messages,  # system + user, exactly as prompted Gemma sees them
                "completion": [{"role": "assistant", "content": completion}],
            }
        )
    assert rows, f"no training rows in {train_file}"
    return rows


@app.local_entrypoint()
def main(
    run_name: str = "",
    epochs: int = 3,
    lr: float = 2e-4,
    lora_r: int = 16,
    lora_alpha: int = 32,
    batch_size: int = 2,
    grad_accum: int = 8,
    max_length: int = 4096,
    train_file: str = str(HERE / "data" / "train.jsonl"),
    deployed: bool = False,
):
    """--deployed spawns train() on the deployed app (run `modal deploy ml/modal_lora.py` first) and returns
    at once. The run then does not depend on this client: an ephemeral `modal run`, even with --detach,
    was cancelled when the client lost its connection (2026-11-14, v2 died at step 62/198)."""
    run_name = run_name or time.strftime("%Y%m%d-%H%M%S")
    rows = build_train_rows(Path(train_file))
    print(f"built {len(rows)} training rows from {Path(train_file).name}")

    remote_dataset = f"/datasets/{run_name}/train.jsonl"
    local_tmp = HERE / ".train-prompt-completion.jsonl"  # gitignored scratch, removed below
    try:
        local_tmp.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
        with VOL.batch_upload(force=True) as batch:
            batch.put_file(str(local_tmp), remote_dataset)
    finally:
        local_tmp.unlink(missing_ok=True)

    kwargs = dict(
        dataset_path=remote_dataset,
        run_name=run_name,
        epochs=epochs,
        lr=lr,
        lora_r=lora_r,
        lora_alpha=lora_alpha,
        batch_size=batch_size,
        grad_accum=grad_accum,
        max_length=max_length,
    )
    if deployed:
        call = modal.Function.from_name(app.name, "train").spawn(**kwargs)
        print(f"spawned {run_name} on the deployed app, call id {call.object_id}")
        return
    print(json.dumps(train.remote(**kwargs), indent=2))


# --------------------------------------------------------------- remote side


@app.function(
    image=TRAIN_IMAGE,
    gpu=GPU,
    volumes={VOL_MOUNT: VOL},
    timeout=4 * 3600,
    retries=0,
)
def train(
    dataset_path: str,
    run_name: str,
    epochs: int,
    lr: float,
    lora_r: int,
    lora_alpha: int,
    batch_size: int,
    grad_accum: int,
    max_length: int,
) -> dict:
    import torch
    from datasets import Dataset
    from peft import LoraConfig
    from transformers import AutoModelForCausalLM, AutoTokenizer, TrainerCallback
    from trl import SFTConfig, SFTTrainer

    assert "eval" not in dataset_path, "eval data must never be used for training"
    assert dataset_path.endswith("/train.jsonl"), dataset_path

    t0 = time.time()
    rows = [json.loads(line) for line in Path(VOL_MOUNT, dataset_path.lstrip("/")).read_text().splitlines() if line.strip()]
    ds = Dataset.from_list(rows)

    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    # Gemma4AudioModel has no SDPA path, so the whole multimodal checkpoint must load with eager.
    model = AutoModelForCausalLM.from_pretrained(BASE_MODEL, dtype=torch.bfloat16, attn_implementation="eager")

    # Language model only (PEFT fullmatches this against module names). The E4B checkpoint's audio tower
    # has 36 q/k/v/o modules named like the language model's (ClippableLinear wrappers), which the old
    # vision-only exclusion let through. Checked against the safetensors header, not a model load.
    lora = LoraConfig(
        r=lora_r,
        lora_alpha=lora_alpha,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=r".*language_model.*\.(q_proj|k_proj|v_proj|o_proj|gate_proj|up_proj|down_proj)",
    )

    run_dir = Path(VOL_MOUNT, "adapters", ADAPTER_NAME, run_name)
    args = SFTConfig(
        output_dir=str(run_dir / "trainer-state"),
        num_train_epochs=epochs,
        learning_rate=lr,
        per_device_train_batch_size=batch_size,
        gradient_accumulation_steps=grad_accum,
        lr_scheduler_type="cosine",
        warmup_steps=3,  # trl 1.17 / transformers 5 dropped warmup_ratio; ~4% of ~75 steps
        logging_steps=5,
        # Checkpoints let a killed run resume (see below) instead of starting over.
        save_strategy="steps",
        save_steps=40,
        save_total_limit=1,
        bf16=True,
        gradient_checkpointing=True,
        max_length=max_length,
        completion_only_loss=True,  # loss on the assistant JSON only; assistant_only_loss breaks on Gemma 4 (trl #8095)
        report_to="none",
        seed=42,
    )
    class CommitOnSave(TrainerCallback):
        def on_save(self, args, state, control, **kwargs):
            VOL.commit()  # make the checkpoint durable now, not only at container exit

    trainer = SFTTrainer(
        model=model,
        args=args,
        train_dataset=ds,
        processing_class=tokenizer,
        peft_config=lora,
        callbacks=[CommitOnSave()],
    )
    has_checkpoint = any(Path(args.output_dir).glob("checkpoint-*"))
    out = trainer.train(resume_from_checkpoint=True if has_checkpoint else None)

    run_dir.mkdir(parents=True, exist_ok=True)
    trainer.model.save_pretrained(str(run_dir))  # adapter_config.json + adapter_model.safetensors

    latest = Path(VOL_MOUNT, "adapters", ADAPTER_NAME, "latest")
    shutil.rmtree(latest, ignore_errors=True)
    shutil.copytree(run_dir, latest)
    VOL.commit()

    losses = [e["loss"] for e in trainer.state.log_history if "loss" in e]
    result = {
        "run_name": run_name,
        "base_model": BASE_MODEL,
        "examples": len(rows),
        "epochs": epochs,
        "train_loss": out.training_loss,
        "first_logged_loss": losses[0] if losses else None,
        "last_logged_loss": losses[-1] if losses else None,
        "steps": out.global_step,
        "wall_seconds": round(time.time() - t0, 1),
        "adapter_dir": str(run_dir),
        "latest_dir": str(latest),
        "gpu": GPU,
        "cuda": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
    }
    return result
