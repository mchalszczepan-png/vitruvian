"""Build ml/data/train.jsonl from the audited Gemini records and the Opus-written records.

    python3 ml/build_train.py            # then: uv run ml/add_twins.py ml/data/train.jsonl --avoid ml/data/eval.jsonl

Sources: data/audit/out-*.jsonl (Opus-audited originals) + data/opus/*.jsonl (Opus gold).
Language twins are not copied from here; add_twins.py regenerates them from the audited targets.
Applies the cross-batch conventions the audit batches disagreed on, so train matches the eval labels.
"""
import glob
import json
from pathlib import Path

DATA = Path(__file__).resolve().parent / "data"

# Today's note has no spaces between words (generator glitch the audit could not repair).
UNUSABLE_IDS = {"ovarian-fi-075"}

# eval convention: menopause derived from age when no note states it (eval-ovarian-fi-005, age 76);
# below 60 it stays null because the age alone is ambiguous.
POSTMENOPAUSAL_FROM_AGE = 60


def apply_conventions(rec: dict) -> None:
    fields = rec["target"]["fields"]
    if rec["cancer"] == "ovarian" and fields.get("menopausalStatus") is None:
        if rec["input"]["recordFacts"].get("age", 0) >= POSTMENOPAUSAL_FROM_AGE:
            fields["menopausalStatus"] = "postmenopausal"
            rec["target"]["evidence"].pop("menopausalStatus", None)


def main() -> None:
    sources = sorted(glob.glob(str(DATA / "audit" / "out-*.jsonl"))) + sorted(glob.glob(str(DATA / "opus" / "*.jsonl")))
    out, seen = [], set()
    for src in sources:
        for line in Path(src).read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            rec = json.loads(line)
            if rec["id"] in UNUSABLE_IDS or rec["id"].endswith(("-entr", "-fitr")):
                continue
            assert rec["id"] not in seen, f"duplicate id {rec['id']}"
            assert rec["split"] == "train", rec["id"]
            seen.add(rec["id"])
            apply_conventions(rec)
            out.append(rec)
    (DATA / "train.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in out), encoding="utf-8")
    print(f"wrote {len(out)} records from {len(sources)} files")


if __name__ == "__main__":
    main()
