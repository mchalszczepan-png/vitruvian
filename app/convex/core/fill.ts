// Referral filling (docs/SPEC.md "Gemma"), pure: patient + Rule book + ModelPort in, FieldValues out. The server owns the Aid:
// fillReferral runs analyze itself (cache hits when warm) and never trusts Rules sent by the client.
// Record fields come from the record with origin record. The model fills the rest through the contract call, which retries invalid
// output once. Fields still invalid are left out, and required ones are reported with origin empty.
// Research prototype. Not a medical device. Not for clinical use.
import type { CancerType, FieldValues, Patient } from '../../src/data/types';
import { modelFieldValues, recordFactsFor } from '../model/contract';
import { specFor } from '../model/referralSchema';
import { analyze } from './aid';
import type { ModelPort } from './port';
import type { RuleBook } from './rulebook';

export async function fillReferral({ patient, book, model, cancer }: { patient: Patient; book: RuleBook; model: ModelPort; cancer: CancerType }): Promise<FieldValues> {
  const analysis = await analyze({ patient, book, model });
  const specs = specFor(cancer);
  // Only the picked cancer's Rules. The Aid's Risk gradient belongs to the suspected cancer, so it is left out for another pick.
  const matchedIds = analysis.allMatched.filter((m) => m.rule.cancer === cancer).map((m) => m.rule.id);
  const riskScore = cancer === analysis.aid.suspectedCancer ? analysis.aid.riskGradient : undefined;

  // The model path retries once inside the contract call. The stub is deterministic, so it never retries.
  const out = await model.fill({ cancer, patient, facts: analysis.facts, specs, repeatCount: analysis.repeat?.count, matchedIds, riskScore: riskScore ?? 0 });
  const result: FieldValues = modelFieldValues(specs, out, cancer);

  // Record fields: from the record, never from the model.
  const rec = (key: string, value: string | number) => {
    result[key] = { value: String(value), origin: 'record', evidence: 'From the record system' };
  };
  const record = recordFactsFor(patient);
  rec('patientId', record.patientId);
  rec('age', record.age);
  rec('sex', record.sex);
  rec('referringGpId', record.referringGpId);
  rec('referralDate', record.referralDate);

  // Set by the Aid, not read from the note (mock parity).
  result.matchedRuleIds = { value: matchedIds.join(', '), origin: 'gemma', evidence: 'Aid' };
  if (riskScore !== undefined) result.riskGradientAiEstimate = { value: String(riskScore), origin: 'gemma', evidence: 'Aid' };
  return result;
}
