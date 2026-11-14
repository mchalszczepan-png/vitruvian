"""Hold a dev slice out of ml/data/train.jsonl for choosing hyperparameters.

    python3 ml/split_dev.py      # writes ml/data/sweep/train.jsonl and ml/data/sweep/dev.jsonl

Sweep runs train on sweep/train.jsonl and are compared on sweep/dev.jsonl, so the 50-note
eval set is only used once, for the final LoRA-vs-prompted comparison.
A record and its language twin (-fitr / -entr) always land on the same side, so no patient
leaks from dev into training. Per cancer: 8 cancer + 2 control pairs, i.e. 60 dev notes.
"""
import json
import random
from collections import defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent / "data"
PAIRS_PER_CANCER = {"cancer": 8, "control": 2}
SEED = 42


def base_id(rec_id: str) -> str:
    for suffix in ("-fitr", "-entr"):
        if rec_id.endswith(suffix):
            return rec_id[: -len(suffix)]
    return rec_id


def main() -> None:
    recs = [json.loads(l) for l in (DATA / "train.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
    groups = defaultdict(list)
    for r in recs:
        groups[base_id(r["id"])].append(r)
    pairs = {k: v for k, v in groups.items() if len(v) == 2}  # source + twin

    rng = random.Random(SEED)
    dev_ids = set()
    for cancer in ("lung", "colorectal", "ovarian"):
        for kind, n in PAIRS_PER_CANCER.items():
            pool = sorted(k for k, v in pairs.items() if v[0]["cancer"] == cancer and v[0]["kind"] == kind)
            dev_ids |= set(rng.sample(pool, n))

    out = DATA / "sweep"
    out.mkdir(exist_ok=True)
    train = [r for r in recs if base_id(r["id"]) not in dev_ids]
    dev = [dict(r, split="dev") for r in recs if base_id(r["id"]) in dev_ids]
    (out / "train.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in train), encoding="utf-8")
    (out / "dev.jsonl").write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in dev), encoding="utf-8")
    langs = lambda rs: {lg: sum(r["language"] == lg for r in rs) for lg in ("en", "fi")}  # noqa: E731
    print(f"sweep/train.jsonl {len(train)} {langs(train)}, sweep/dev.jsonl {len(dev)} {langs(dev)}")


if __name__ == "__main__":
    main()
