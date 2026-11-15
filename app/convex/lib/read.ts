// Shared readers: turn table rows into the exact types.ts shapes (no Convex system fields).
// Research prototype. Not a medical device. All patients are made up.
import type { DatabaseReader } from '../_generated/server';
import type { RuleRow } from '../core/rulebook';
import type { CancerType, CountyGap, Patient, ReferralTemplate, Severity, StagingReport, StagingTemplate, Visit } from '../../src/data/types';

/** Drops Convex _id and _creationTime so a row matches its types.ts shape. */
export function plain<T extends { _id: unknown; _creationTime: number }>(doc: T): Omit<T, '_id' | '_creationTime'> {
  const { _id, _creationTime, ...rest } = doc;
  return rest;
}

export async function readVisits(db: DatabaseReader, patientId: string): Promise<Visit[]> {
  const rows = await db
    .query('visits')
    .withIndex('by_patient', (q) => q.eq('patientId', patientId))
    .order('asc')
    .collect();
  return rows.map((r) => ({
    id: r.visitId,
    date: r.date,
    reason: r.reason,
    symptom: r.symptom,
    note: r.note,
    ...(r.reasonFi !== undefined ? { reasonFi: r.reasonFi } : {}),
    ...(r.gpNoteFi !== undefined ? { gpNoteFi: r.gpNoteFi } : {}),
    ...(r.history !== undefined ? { history: r.history } : {}),
  }));
}

export async function readPatient(db: DatabaseReader, id: string): Promise<Patient | null> {
  const row = await db
    .query('patients')
    .withIndex('by_patient_id', (q) => q.eq('id', id))
    .unique();
  if (!row) return null;
  return { ...plain(row), visits: await readVisits(db, id) };
}

export async function readRules(db: DatabaseReader): Promise<RuleRow[]> {
  return (await db.query('rules').collect()).map(plain);
}

/** All severity rows (one per cancer). */
export async function readSeverities(db: DatabaseReader): Promise<Severity[]> {
  return (await db.query('severity').take(50)).map(plain);
}

export async function readReferralTemplate(db: DatabaseReader, cancer: CancerType): Promise<ReferralTemplate | null> {
  const row = await db
    .query('referralTemplates')
    .withIndex('by_cancer', (q) => q.eq('cancer', cancer))
    .unique();
  return row ? plain(row) : null;
}

export async function readStagingTemplate(db: DatabaseReader, cancer: CancerType): Promise<StagingTemplate | null> {
  const row = await db
    .query('stagingTemplates')
    .withIndex('by_cancer', (q) => q.eq('cancer', cancer))
    .unique();
  return row ? plain(row) : null;
}

export async function readDemoStaging(db: DatabaseReader, cancer: CancerType): Promise<StagingReport | null> {
  const row = await db
    .query('stagingReports')
    .withIndex('by_cancer', (q) => q.eq('cancer', cancer))
    .unique();
  return row ? plain(row) : null;
}

export async function readCountyGap(db: DatabaseReader): Promise<CountyGap | null> {
  const row = await db.query('countyGap').first();
  return row ? plain(row) : null;
}
