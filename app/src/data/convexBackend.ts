// Convex adapter for api.ts. Used only when VITE_BACKEND=convex.
// Function names and shapes follow app/convex/README.md. api.ts owns the timeout and the mock fallback.
// Research prototype. Not a medical device. Not for clinical use.
import { ConvexHttpClient } from 'convex/browser';
import { makeFunctionReference, type FunctionReference } from 'convex/server';
import type {
  AidResult,
  CancerType,
  CountyGap,
  FieldValues,
  MatchedRule,
  Patient,
  Referral,
  ReferralTemplate,
  ReferralView,
  RepeatVisitFlag,
  StagingReport,
  StagingTemplate,
} from './types';

/** The part of ConvexHttpClient (or convex-test's client) this adapter uses. */
export type ConvexLike = Pick<ConvexHttpClient, 'query' | 'mutation' | 'action'>;

let injected: ConvexLike | undefined;
let httpClient: ConvexHttpClient | undefined;

/** Tests inject a convex-test client here. Pass undefined to go back to the HTTP client. */
export function setConvexClient(client: ConvexLike | undefined): void {
  injected = client;
}

/** Created on first use, so importing this module never needs VITE_CONVEX_URL. */
function client(): ConvexLike {
  if (injected) return injected;
  if (!httpClient) {
    const url = import.meta.env.VITE_CONVEX_URL;
    if (!url) throw new Error('VITE_CONVEX_URL is not set');
    httpClient = new ConvexHttpClient(url);
  }
  return httpClient;
}

type Args = Record<string, unknown>;
const query = <R>(name: string) => makeFunctionReference<'query', Args, R>(name);
const mutation = <R>(name: string) => makeFunctionReference<'mutation', Args, R>(name);
const action = <R>(name: string) => makeFunctionReference<'action', Args, R>(name);

const refs = {
  patientsList: query<Patient[]>('patients:list'),
  patientsGet: query<Patient | null>('patients:get'),
  repeatVisit: query<RepeatVisitFlag | null>('patients:repeatVisit'),
  referralTemplate: query<ReferralTemplate>('templates:referral'),
  stagingTemplate: query<StagingTemplate>('templates:staging'),
  demoStaging: query<StagingReport>('staging:demo'),
  countyGet: query<CountyGap>('county:get'),
  referralsList: query<ReferralView[]>('referrals:list'),
  referralsSend: mutation<Referral>('referrals:send'),
  referralsSetStatus: mutation<ReferralView>('referrals:setStatus'),
  aidGet: action<AidResult>('aid:get'),
  fillFromNote: action<FieldValues>('fill:fromNote'),
};

const run = <R>(ref: FunctionReference<'query' | 'mutation' | 'action', 'public', Args, R>, args: Args): Promise<R> =>
  client().query(ref as FunctionReference<'query', 'public', Args, R>, args);

export async function getPatients(): Promise<Patient[]> {
  return run(refs.patientsList, {});
}

export async function getPatient(id: string): Promise<Patient | undefined> {
  return (await run(refs.patientsGet, { id })) ?? undefined;
}

export async function getRepeatVisit(patientId: string): Promise<RepeatVisitFlag | undefined> {
  return (await run(refs.repeatVisit, { id: patientId })) ?? undefined;
}

export async function getReferralTemplate(cancer: CancerType): Promise<ReferralTemplate> {
  return run(refs.referralTemplate, { cancer });
}

export async function getStagingTemplate(cancer: CancerType): Promise<StagingTemplate> {
  return run(refs.stagingTemplate, { cancer });
}

export async function getDemoStaging(cancer: CancerType): Promise<StagingReport> {
  return run(refs.demoStaging, { cancer });
}

export async function getCountyGap(): Promise<CountyGap> {
  return run(refs.countyGet, {});
}

export async function getAid(patientId: string): Promise<AidResult> {
  return client().action(refs.aidGet, { patientId });
}

export async function fillTemplateFromNote(patientId: string, cancer: CancerType, matched: MatchedRule[]): Promise<FieldValues> {
  return client().action(refs.fillFromNote, { patientId, cancer, matched });
}

export async function sendReferral(referral: Referral): Promise<Referral> {
  return client().mutation(refs.referralsSend, { referral });
}

export async function getReferrals(): Promise<ReferralView[]> {
  return run(refs.referralsList, {});
}

export async function setReferralStatus(referralId: string, status: 'accepted' | 'returned', reason?: string): Promise<ReferralView> {
  return client().mutation(refs.referralsSetStatus, { referralId, status, ...(reason !== undefined ? { reason } : {}) });
}
