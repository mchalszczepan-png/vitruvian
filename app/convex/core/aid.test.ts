import { describe, expect, it } from 'vitest';
import { analyze, lastingCount, mapLimit, MEDGEMMA_BADGE, pickCancer, snippetOf, TRIAGE_BADGE, TRIAGE_PPV_BADGE, techUsedFor, withoutSafetyNet, type RepeatSource } from './aid';
import { buildRuleBook, type RuleBook } from './rulebook';
import { stubPort } from './ports/stub';
import type { ModelPort } from './port';
import type { Patient, Visit } from '../../src/data/types';
import rulesJson from '../seed/rules.json';
import severityJson from '../seed/severity.json';
import patientsJson from '../seed/patients.json';
import visitsJson from '../seed/visits.json';

describe('techUsedFor: the triage risk', () => {
  const riskOf = (servedBy?: 'modal-lora' | 'gemma') => techUsedFor('modal-lora', 'symptom-match', servedBy).find((t) => t.step === 'risk');

  it('a triage answer gives the risk step modal-lora with the TRIAGE_BADGE detail', () => {
    expect(riskOf('modal-lora')).toEqual({ step: 'risk', provider: 'modal-lora', detail: TRIAGE_BADGE });
    expect(TRIAGE_BADGE).toBe('Gemma 4 E4B, fine-tuned on synthetic GP notes, Gemini-teacher labels, not clinically validated');
  });

  it('a fallback or no triage keeps the prompted risk on gemma, with no detail', () => {
    expect(riskOf('gemma')).toEqual({ step: 'risk', provider: 'gemma' });
    expect(riskOf()).toEqual({ step: 'risk', provider: 'gemma' });
  });
});

describe('techUsedFor: the published-risk (-ppv) triage badge', () => {
  const riskOf = (servedBy: 'modal-lora' | 'medgemma' | 'gemma' | undefined, servedModel?: string) =>
    techUsedFor('modal-lora', 'symptom-match', servedBy, servedModel).find((t) => t.step === 'risk');

  it('a -ppv triage model gives TRIAGE_PPV_BADGE, with the exact wording', () => {
    expect(riskOf('modal-lora', 'vitruvian-triage-ppv')).toEqual({ step: 'risk', provider: 'modal-lora', detail: TRIAGE_PPV_BADGE });
    expect(TRIAGE_PPV_BADGE).toBe('Gemma 4 E4B, fine-tuned on synthetic GP notes; scores computed from published UK primary-care PPVs; not clinically validated.');
  });

  it('a non-ppv triage model keeps TRIAGE_BADGE, and a -ppv MedGemma keeps MEDGEMMA_BADGE', () => {
    expect(riskOf('modal-lora', 'vitruvian-triage')).toEqual({ step: 'risk', provider: 'modal-lora', detail: TRIAGE_BADGE });
    expect(riskOf('modal-lora', undefined)).toEqual({ step: 'risk', provider: 'modal-lora', detail: TRIAGE_BADGE });
    expect(riskOf('medgemma', 'vitruvian-triage-ppv')).toEqual({ step: 'risk', provider: 'modal-lora', detail: MEDGEMMA_BADGE });
  });

  it('a prompted fallback (gemma) is never shown with a triage badge', () => {
    expect(riskOf('gemma', 'vitruvian-triage-ppv')).toEqual({ step: 'risk', provider: 'gemma' });
  });
});

describe('techUsedFor: the MedGemma risk', () => {
  const riskOf = (servedBy?: 'medgemma' | 'modal-lora' | 'gemma') => techUsedFor('modal-lora', 'symptom-match', servedBy).find((t) => t.step === 'risk');

  it('a MedGemma answer gives the risk step modal-lora (no new provider) with the MEDGEMMA_BADGE detail', () => {
    expect(riskOf('medgemma')).toEqual({ step: 'risk', provider: 'modal-lora', detail: MEDGEMMA_BADGE });
    expect(MEDGEMMA_BADGE).toBe('MedGemma 27B, fine-tuned on synthetic GP notes, Gemini-teacher labels, not clinically validated');
  });

  it('the E4B triage still gives TRIAGE_BADGE, and a fallback keeps the prompted risk on gemma', () => {
    expect(riskOf('modal-lora')).toEqual({ step: 'risk', provider: 'modal-lora', detail: TRIAGE_BADGE });
    expect(riskOf('gemma')).toEqual({ step: 'risk', provider: 'gemma' });
  });
});

describe('analyze: a MedGemma answer shows its pointer and evidence', () => {
  const book: RuleBook = buildRuleBook({ rules: rulesJson as never, severities: severityJson as never });
  const visits = visitsJson as { patientId: string; visitId: string; order: number; date: string; reason: string; symptom: string; note: string; reasonFi?: string; gpNoteFi?: string }[];
  const patient: Patient = (() => {
    const p = (patientsJson as Omit<Patient, 'visits'>[])[0];
    const vs: Visit[] = visits
      .filter((v) => v.patientId === p.id)
      .sort((a, b) => a.order - b.order)
      .map((v) => ({ id: v.visitId, date: v.date, reason: v.reason, symptom: v.symptom, note: v.note, reasonFi: v.reasonFi, gpNoteFi: v.gpNoteFi }));
    return { ...p, visits: vs };
  })();

  it('riskModelPointer, riskEvidence and the MedGemma techUsed detail are set for servedBy medgemma', async () => {
    const base = await analyze({ patient, book, model: stubPort() });
    const other = base.aid.suspectedCancer === 'lung' ? 'colorectal' : 'lung';
    const model: ModelPort = { ...stubPort(), risk: async () => ({ score: 5, reason: 'r', pointer: other, evidence: ['a phrase'], servedBy: 'medgemma' }) };
    const out = await analyze({ patient, book, model });
    expect(out.aid.riskModelPointer).toBe(other);
    expect(out.aid.riskEvidence).toEqual(['a phrase']);
    expect(out.aid.techUsed?.find((t) => t.step === 'risk')).toEqual({ step: 'risk', provider: 'modal-lora', detail: MEDGEMMA_BADGE });
  });
});

describe('analyze: the triage pointer and evidence', () => {
  const book: RuleBook = buildRuleBook({ rules: rulesJson as never, severities: severityJson as never });
  const visits = visitsJson as { patientId: string; visitId: string; order: number; date: string; reason: string; symptom: string; note: string; reasonFi?: string; gpNoteFi?: string }[];
  const patientFor = (id: string): Patient => {
    const p = (patientsJson as Omit<Patient, 'visits'>[]).find((x) => x.id === id)!;
    const vs: Visit[] = visits
      .filter((v) => v.patientId === id)
      .sort((a, b) => a.order - b.order)
      .map((v) => ({ id: v.visitId, date: v.date, reason: v.reason, symptom: v.symptom, note: v.note, reasonFi: v.reasonFi, gpNoteFi: v.gpNoteFi }));
    return { ...p, visits: vs };
  };
  const withRisk = (risk: Partial<Awaited<ReturnType<ModelPort['risk']>>>): ModelPort => ({
    ...stubPort(),
    risk: async () => ({ score: 5, reason: 'r', ...risk }),
  });

  it('riskModelPointer is set when the triage guess differs from the Rules, and riskEvidence comes with a triage answer', async () => {
    const patient = patientFor('SYN-001');
    const base = await analyze({ patient, book, model: stubPort() });
    const other = base.aid.suspectedCancer === 'lung' ? 'colorectal' : 'lung';
    const out = await analyze({ patient, book, model: withRisk({ pointer: other, evidence: ['a phrase'], servedBy: 'modal-lora' }) });
    expect(out.aid.riskModelPointer).toBe(other);
    expect(out.aid.riskEvidence).toEqual(['a phrase']);
    expect(out.aid.techUsed?.find((t) => t.step === 'risk')).toEqual({ step: 'risk', provider: 'modal-lora', detail: TRIAGE_BADGE });
  });

  it('riskModelPointer is not set when it matches the Rules, and nothing is set without a triage answer', async () => {
    const patient = patientFor('SYN-001');
    const base = await analyze({ patient, book, model: stubPort() });
    const same = await analyze({ patient, book, model: withRisk({ pointer: base.aid.suspectedCancer, evidence: ['x'], servedBy: 'modal-lora' }) });
    expect(same.aid).not.toHaveProperty('riskModelPointer');
    expect(same.aid.riskEvidence).toEqual(['x']);

    // Evidence is shown only for a triage answer: a prompted risk (no servedBy) carries none.
    const prompted = await analyze({ patient, book, model: withRisk({ evidence: ['x'] }) });
    expect(prompted.aid).not.toHaveProperty('riskModelPointer');
    expect(prompted.aid).not.toHaveProperty('riskEvidence');
  });

  it('with no Rule matched the Rules say none: a pointer is shown, and a none pointer is not', async () => {
    const patient = patientFor('SYN-001');
    const silent: ModelPort = { ...withRisk({}), decide: async () => ({}) };
    const shown = await analyze({ patient, book, model: { ...silent, risk: withRisk({ pointer: 'lung', servedBy: 'modal-lora' }).risk } });
    expect(shown.aid.noRuleMatched).toBe(true);
    expect(shown.aid.riskModelPointer).toBe('lung');

    const none = await analyze({ patient, book, model: { ...silent, risk: withRisk({ pointer: 'none', servedBy: 'modal-lora' }).risk } });
    expect(none.aid).not.toHaveProperty('riskModelPointer');
  });
});

describe('techUsedFor', () => {
  it('repeat step names the source: symptom field by default, convex-vector when the caller ran vector search', () => {
    const repeatOf = (src?: RepeatSource) => techUsedFor('stub', src).find((t) => t.step === 'repeat')?.provider;
    expect(repeatOf()).toBe('symptom-match');
    expect(repeatOf('symptom-match')).toBe('symptom-match');
    expect(repeatOf('convex-vector')).toBe('convex-vector');
  });

  it('repeat step reports embeddinggemma when EmbeddingGemma served the vector search', () => {
    expect(techUsedFor('stub', 'embeddinggemma').find((t) => t.step === 'repeat')).toEqual({ step: 'repeat', provider: 'embeddinggemma' });
  });

  it('keeps the other four steps unchanged whatever the repeat source', () => {
    const steps = (src: RepeatSource) => techUsedFor('stub', src).filter((t) => t.step !== 'repeat');
    expect(steps('convex-vector')).toEqual(steps('symptom-match'));
  });

  it('modal-lora: facts and risk on Featherless (gemma), decisions on Gemini, the fill on the LoRA', () => {
    expect(techUsedFor('modal-lora')).toEqual([
      { step: 'facts', provider: 'gemma' },
      { step: 'decisions', provider: 'gemini' },
      { step: 'risk', provider: 'gemma' },
      { step: 'repeat', provider: 'symptom-match' },
      { step: 'fill', provider: 'modal-lora' },
    ]);
  });
});

const cat = { lung: 9, colorectal: 9, ovarian: 8 };
const m = (cancer: 'lung' | 'colorectal' | 'ovarian', visits = 1) => ({ rule: { cancer }, visits: Array.from({ length: visits }, () => ({})) }) as never;

describe('pickCancer', () => {
  it('most matched Rules wins', () => {
    expect(pickCancer([m('lung'), m('lung'), m('colorectal')], cat, 'cough', 'male')).toBe('lung');
  });

  it('tie goes to the cancer with more Rules in the catalogue', () => {
    expect(pickCancer([m('ovarian'), m('lung')], { lung: 9, colorectal: 9, ovarian: 12 }, 'cough', 'female')).toBe('ovarian');
    expect(pickCancer([m('ovarian'), m('lung')], { lung: 12, colorectal: 9, ovarian: 8 }, 'cough', 'female')).toBe('lung');
  });

  it('no match: fallback from the last symptom and sex', () => {
    expect(pickCancer([], cat, 'bowel change', 'male')).toBe('colorectal');
    expect(pickCancer([], cat, 'bloating', 'female')).toBe('ovarian');
    expect(pickCancer([], cat, 'bloating', 'male')).toBe('lung');
    expect(pickCancer([], cat, 'cough', 'female')).toBe('lung');
  });
});

describe('lastingCount', () => {
  it('counts Rules with more than one backing visit', () => {
    expect(lastingCount([m('lung', 1), m('lung', 3), m('lung', 2)])).toBe(2);
  });
});

describe('withoutSafetyNet', () => {
  it('drops safety-net advice but keeps the findings', () => {
    const note = 'Blood in sputum today. Sooner if any blood in sputum.';
    expect(withoutSafetyNet(note)).toContain('Blood in sputum today.');
    expect(withoutSafetyNet(note)).not.toMatch(/sooner/i);
  });
});

describe('snippetOf', () => {
  it('picks the sentence with the cue, skipping a leading "no"', () => {
    const note = 'No blood seen before. Coughed up streaks of fresh blood on three mornings.';
    expect(snippetOf(note, 'reason', /blood/i)).toBe('Coughed up streaks of fresh blood on three mornings.');
  });

  it('falls back to the visit reason when no sentence has the cue', () => {
    expect(snippetOf('Looks well.', 'Dry cough, 3 weeks', /blood/i)).toBe('Dry cough, 3 weeks');
  });
});

describe('mapLimit', () => {
  it('keeps order and caps concurrency', async () => {
    let inFlight = 0;
    let peak = 0;
    const out = await mapLimit([1, 2, 3, 4, 5], 2, async (x) => {
      inFlight++;
      peak = Math.max(peak, inFlight);
      await new Promise((r) => setTimeout(r, 5));
      inFlight--;
      return x * 10;
    });
    expect(out).toEqual([10, 20, 30, 40, 50]);
    expect(peak).toBeLessThanOrEqual(2);
  });
});

describe('analyze: published risk (PPV)', () => {
  const book: RuleBook = buildRuleBook({ rules: rulesJson as never, severities: severityJson as never });
  const visits = visitsJson as { patientId: string; visitId: string; order: number; date: string; reason: string; symptom: string; note: string }[];
  const patientFor = (id: string): Patient => {
    const p = (patientsJson as Omit<Patient, 'visits'>[]).find((x) => x.id === id)!;
    const vs: Visit[] = visits
      .filter((v) => v.patientId === id)
      .sort((a, b) => a.order - b.order)
      .map((v) => ({ id: v.visitId, date: v.date, reason: v.reason, symptom: v.symptom, note: v.note }));
    return { ...p, visits: vs };
  };

  it('SYN-001 (lung) shows the highest applicable PPV row, with its population and quote', async () => {
    const out = await analyze({ patient: patientFor('SYN-001'), book, model: stubPort() });
    expect(out.aid.suspectedCancer).toBe('lung');
    expect(out.aid.publishedRisk).toMatchObject({ pct: 8.37, rowId: 'LUNG-PPV-06', isLowerBound: false, aboveNg12Threshold: true });
    expect(out.aid.publishedRisk?.studyPopulation).toBeTruthy();
    expect(out.aid.publishedRisk?.quote).toBeTruthy();
  });

  it('is absent when no Rule matched', async () => {
    const silent: ModelPort = { ...stubPort(), decide: async () => ({}) };
    const out = await analyze({ patient: patientFor('SYN-001'), book, model: silent });
    expect(out.aid.noRuleMatched).toBe(true);
    expect(out.aid).not.toHaveProperty('publishedRisk');
  });

  it('a decide that throws for the PPV questions leaves publishedRisk absent and the rest of the Aid intact', async () => {
    const patient = patientFor('SYN-001');
    const base = await analyze({ patient, book, model: stubPort() });
    const ppvThrows: ModelPort = {
      ...stubPort(),
      decide: async (args) => {
        if (args.questions.some((q) => q.id.includes('-PPV-'))) throw new Error('Decisions API call failed: HTTP 503');
        return stubPort().decide(args);
      },
    };
    const out = await analyze({ patient, book, model: ppvThrows });
    expect(out.aid).not.toHaveProperty('publishedRisk');
    expect(out.aid.matchedRules).toEqual(base.aid.matchedRules);
    expect(out.aid.suspectedCancer).toBe(base.aid.suspectedCancer);
    expect(out.aid.riskGradient).toBe(base.aid.riskGradient);
    expect(out.aid.testNeeded).toEqual(base.aid.testNeeded);
  });
});
