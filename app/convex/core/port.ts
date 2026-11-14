// The one seam between the Aid pipeline and any model: ModelPort, with domain types only.
// A port never sees env, Convex or HTTP details. makePort (ports/index.ts) is the only place that picks one.
// Research prototype. Not a medical device. Not for clinical use.
import type { CancerType, Patient } from '../../src/data/types';
import type { FillOutput } from '../model/contract';
import type { FieldSpec } from '../model/referralSchema';
import type { Facts } from './facts';

/** Who a Rule is asked about. Age, sex and smoking decide in code whether a Rule may be asked at all. */
export type Who = Pick<Patient, 'age' | 'sex' | 'smokingStatus'>;

/** What the ports read from a patient (the stub fill reads the visits). */
export type PatientView = Pick<Patient, 'id' | 'age' | 'sex' | 'smokingStatus' | 'visits'>;

export interface Question {
  id: string;
  /** the yes/no question the Decisions API answers on the structured facts */
  question: string;
}

export interface Decision {
  yes: boolean;
  /** the fact sentence behind a yes, when the port gives one. Without it the Aid uses the Rule text plus a visit snippet. */
  because?: string;
}

export interface RiskInput {
  cancer: CancerType;
  matched: { id: string; because: string }[];
  history: { visitCount: number; repeatVisit: boolean; lasting: number; age: number; sex: string; visits: { date: string; reason: string }[] };
  /** true when no Rule of any cancer matched. The triage score is then the model's riskGradient, not scores[cancer]. */
  noRuleMatched: boolean;
  /** raw visit notes (not withoutSafetyNet): today's note and the earlier ones, oldest first. The triage model reads these. */
  notes: { today: string; earlier: { date: string; note: string }[] };
}

export interface RiskOutput {
  score: number;
  reason: string;
  /** the triage model's own cancer guess. A note only: the Rules pick the cancer (decision 14). Set only by a triage port. */
  pointer?: CancerType | 'none';
  /** phrases copied from the notes that the triage model cited, for highlighting. Set only by a triage port. */
  evidence?: string[];
  /** set only when the triage model was tried: 'modal-lora' answered it, 'gemma' is the prompted fallback. */
  servedBy?: 'modal-lora' | 'gemma';
}

export interface FillInput {
  cancer: CancerType;
  patient: PatientView;
  /** facts known up to the last visit (the stub fill reads them; the model fill reads the notes) */
  facts: Facts;
  specs: FieldSpec[];
  repeatCount?: number;
  matchedIds: string[];
  riskScore: number;
}

export interface ModelPort {
  /** stub, gemma or modal-lora */
  readonly name: string;
  /** Facts from one note (safety-net advice already removed by the caller). */
  extractFacts(note: string): Promise<Partial<Facts>>;
  /** One yes/no per question on the facts known so far. Questions are already limited by age and sex. */
  decide(args: { facts: Facts; who: Who; questions: Question[] }): Promise<Record<string, Decision>>;
  /** The Risk gradient. The only model output that reaches the Aid. The caller clamps it. */
  risk(input: RiskInput): Promise<RiskOutput>;
  /** The Referral fields from the notes (ml/CONTRACT.md call). The cache decorator keys it by its whole input. */
  fill(input: FillInput): Promise<FillOutput>;
}
