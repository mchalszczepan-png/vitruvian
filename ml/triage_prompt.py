"""Shared prompt for the cancer pointer (triage). Prompted Gemma, training data and the LoRA all use this exact prompt.

Research prototype. All notes and patients are synthetic.
"""
import json

CANCERS = ("lung", "colorectal", "ovarian")
CHOICES = (*CANCERS, "none")

SYSTEM = """You read one patient's GP visit notes (English or Finnish) and point out whether the symptoms suggest lung, colorectal or ovarian cancer. This is a pointer for the GP to look closer, not a diagnosis. Research prototype with made-up patients.
Return ONE JSON object, no prose, no code fence:
{"suspectedCancer": "lung" | "colorectal" | "ovarian" | "none", "riskGradient": 0-10, "scores": {"lung": 0-10, "colorectal": 0-10, "ovarian": 0-10}, "riskReason": "...", "evidence": ["...", "..."]}
- scores: integers, how strongly the notes plus age and sex point to each cancer. 0-1 nothing; 2-3 vague, common, or a clear benign explanation; 4-5 one red flag or a persistent unexplained symptom in the right age group; 6-7 several red flags, or one that persists or recurs across visits; 8-10 strong signs (e.g. haemoptysis with an abnormal chest X-ray, a rectal mass or high FIT, ascites or a pelvic mass with raised CA-125). Ovarian is 0 for a male patient.
- suspectedCancer: the cancer the notes point to most, or "none" when nothing points beyond a vague or benign picture.
- riskGradient: the score of suspectedCancer, or the highest score when it is "none".
- riskReason: one English line, at most 30 words, naming the findings behind the score.
- evidence: 1 to 4 short phrases copied character for character from the notes, in the notes' own language.
Use only what the notes, age and sex say. Never invent findings."""

# The published-risk variant (adapter vitruvian-triage-ppv, data ml/triage_ppv_label.py). Same JSON reply; only the
# meaning of the scores changes: they come from published UK primary-care positive predictive values (PPV).
SYSTEM_PPV = """You read one patient's GP visit notes (English or Finnish) and point out whether the symptoms suggest lung, colorectal or ovarian cancer. This is a pointer for the GP to look closer, not a diagnosis. Research prototype with made-up patients.
Return ONE JSON object, no prose, no code fence:
{"suspectedCancer": "lung" | "colorectal" | "ovarian" | "none", "riskGradient": 0-10, "scores": {"lung": 0-10, "colorectal": 0-10, "ovarian": 0-10}, "riskReason": "...", "evidence": ["...", "..."]}
- scores: integers from the published UK primary-care positive predictive value (PPV) of the strongest symptom recorded on ANY visit, for this age and sex (Jones 2007, Hamilton 2005 and 2009, NICE NG12 evidence). 0 when no recorded symptom has a published figure; otherwise 5 + 2.5 x log2(PPV% / 3), rounded, between 1 and 10. So 5 is the NICE NG12 3% referral threshold, about 1% is 1, 1.5% is 3, 6% is 8, 12% or more is 10. Earlier visits count: a cough recorded at 2 or 3 separate visits has its own figure. Ovarian is 0 for a male patient.
- suspectedCancer: the cancer the notes point to most, or "none" when nothing points beyond a vague or benign picture.
- riskGradient: the score of suspectedCancer, or the highest score when it is "none".
- riskReason: one English line naming the symptom, age and sex, the published risk and its source, and whether it is at or above the NICE 3% threshold.
- evidence: up to 4 short phrases copied character for character from the notes, in the notes' own language, showing that symptom.
Use only what the notes, age and sex say. Never invent findings."""


SYSTEMS = {"rubric": SYSTEM, "ppv": SYSTEM_PPV}


def build_triage_messages(today_note: str, earlier_notes: list[dict], patient: dict, system: str = SYSTEM) -> list[dict]:
    user = {"patient": patient, "earlierNotes": earlier_notes, "todayNote": today_note}
    return [
        {"role": "system", "content": system},
        {"role": "user", "content": json.dumps(user, ensure_ascii=False)},
    ]


def target_json(target: dict) -> str:
    """The assistant reply the LoRA is trained on (key order matches the prompt)."""
    keys = ("suspectedCancer", "riskGradient", "scores", "riskReason", "evidence")
    return json.dumps({k: target[k] for k in keys}, ensure_ascii=False)
