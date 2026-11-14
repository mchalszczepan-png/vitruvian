// TypeScript port of ml/triage_prompt.py (build_triage_messages). The LoRA "vitruvian-triage" was trained on this exact prompt,
// so the text must stay identical. Parity is enforced by triagePrompt.test.ts against testdata/triage-golden.json (python3 -I, one-off).
// Research prototype. Not a medical device. Not for clinical use.
import { pyDumps, type ChatMessage } from './prompt';

/** Same text as SYSTEM in ml/triage_prompt.py, verbatim. */
export const TRIAGE_SYSTEM = `You read one patient's GP visit notes (English or Finnish) and point out whether the symptoms suggest lung, colorectal or ovarian cancer. This is a pointer for the GP to look closer, not a diagnosis. Research prototype with made-up patients.
Return ONE JSON object, no prose, no code fence:
{"suspectedCancer": "lung" | "colorectal" | "ovarian" | "none", "riskGradient": 0-10, "scores": {"lung": 0-10, "colorectal": 0-10, "ovarian": 0-10}, "riskReason": "...", "evidence": ["...", "..."]}
- scores: integers, how strongly the notes plus age and sex point to each cancer. 0-1 nothing; 2-3 vague, common, or a clear benign explanation; 4-5 one red flag or a persistent unexplained symptom in the right age group; 6-7 several red flags, or one that persists or recurs across visits; 8-10 strong signs (e.g. haemoptysis with an abnormal chest X-ray, a rectal mass or high FIT, ascites or a pelvic mass with raised CA-125). Ovarian is 0 for a male patient.
- suspectedCancer: the cancer the notes point to most, or "none" when nothing points beyond a vague or benign picture.
- riskGradient: the score of suspectedCancer, or the highest score when it is "none".
- riskReason: one English line, at most 30 words, naming the findings behind the score.
- evidence: 1 to 4 short phrases copied character for character from the notes, in the notes' own language.
Use only what the notes, age and sex say. Never invent findings.`;

export interface TriageEarlierNote {
  date: string;
  note: string;
}

/** Port of build_triage_messages(today_note, earlier_notes, patient). Key order: patient, earlierNotes, todayNote. */
export function buildTriageMessages(todayNote: string, earlierNotes: TriageEarlierNote[], patient: { age: number; sex: string }): ChatMessage[] {
  const user = {
    patient: { age: patient.age, sex: patient.sex },
    earlierNotes: earlierNotes.map((e) => ({ date: e.date, note: e.note })),
    todayNote,
  };
  return [
    { role: 'system', content: TRIAGE_SYSTEM },
    { role: 'user', content: pyDumps(user, false, { item: ', ', kv: ': ' }) },
  ];
}
