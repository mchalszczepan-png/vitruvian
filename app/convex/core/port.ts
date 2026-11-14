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
}

export interface RiskOutput {
  score: number;
  reason: string;
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
  /** The Referral fields from the notes (ml/CONTRACT.md call). Never cached. */
  fill(input: FillInput): Promise<FillOutput>;
}
