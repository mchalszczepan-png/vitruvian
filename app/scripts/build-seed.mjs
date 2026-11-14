// Builds app/convex/seed/*.json from docs/build/*.md and the mock modules.
// Run: node app/scripts/build-seed.mjs   (from the repo root or anywhere; paths are resolved from this file)
// Research prototype. Not a medical device. Not for clinical use. All patients are made up.
//
// Sources:
//   docs/build/rules.md            "## JSON for the app" (26 Rules with overTime)  -> rules.json
//   docs/build/rule-extras.json    limits, numeric bands, scan role, cue per Rule  -> merged into rules.json
//   docs/build/mock-patients.json                                                  -> patients.json, visits.json
//   app/src/data/mock/{templates,staging,county,rules}.ts (bundled with rolldown)   -> the rest
// The mock modules carry the types.ts shapes (labels, kinds, sources, gate tests) that the docs
// JSON does not hold, so the Convex output equals the mock output field for field.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { rolldown } from 'rolldown';

const here = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(here, '..');
const repo = resolve(appDir, '..');
const docs = resolve(repo, 'docs/build');
const out = resolve(appDir, 'convex/seed');
const tmp = resolve(appDir, 'node_modules/.tmp');
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });

const write = (name, data) => writeFileSync(resolve(out, name), JSON.stringify(data, null, 2) + '\n');

/* ---------- 1. Rules from docs/build/rules.md ---------- */

// Docs id -> mock id. The mock holds the gate test (FIT or CA-125) that the docs JSON lacks.
const DOCS_TO_MOCK = {
  'LUNG-01': 'lung-cxr', 'LUNG-02': 'lung-haemoptysis', 'LUNG-03': 'lung-two-symptoms',
  'LUNG-04': 'lung-smoker-symptom', 'LUNG-05': 'lung-infection', 'LUNG-06': 'lung-clubbing',
  'LUNG-07': 'lung-nodes', 'LUNG-08': 'lung-platelets', 'LUNG-09': 'lung-chest-signs',
  'COLO-01': 'crc-fit', 'COLO-02': 'crc-abdo-mass', 'COLO-03': 'crc-rectal-mass',
  'COLO-04': 'crc-bowel-habit', 'COLO-05': 'crc-ida', 'COLO-06': 'crc-anaemia-60',
  'COLO-07': 'crc-weight-pain', 'COLO-08': 'crc-bleeding-50', 'COLO-09': 'crc-bleeding-under-50',
  'OVAR-01': 'OVAR-01', 'OVAR-02': 'OVAR-02', 'OVAR-03': 'OVAR-03', 'OVAR-04': 'OVAR-04',
  'OVAR-05': 'OVAR-05', 'OVAR-06': 'OVAR-06', 'OVAR-07': 'OVAR-07', 'OVAR-08': 'OVAR-08',
};

const rulesMd = readFileSync(resolve(docs, 'rules.md'), 'utf8');
const jsonSection = rulesMd.slice(rulesMd.indexOf('## JSON for the app'));
const docRules = [...jsonSection.matchAll(/```json\n([\s\S]*?)```/g)].flatMap((m) => JSON.parse(m[1]));
if (docRules.length !== 26) throw new Error(`expected 26 Rules in rules.md, found ${docRules.length}`);

/* ---------- 2. Mock modules, bundled so the TypeScript is read as written ---------- */

const mockEntry = resolve(tmp, 'seed-mock-entry.ts');
writeFileSync(
  mockEntry,
  ['templates', 'staging', 'county', 'rules'].map((m) => `export * from ${JSON.stringify(resolve(appDir, 'src/data/mock', `${m}.ts`))};`).join('\n') + '\n',
);
const bundle = await rolldown({ input: mockEntry, platform: 'node', logLevel: 'silent' });
const { output } = await bundle.generate({ format: 'esm' });
const mockOut = resolve(tmp, 'seed-mock.mjs');
writeFileSync(mockOut, output[0].code);
const mock = await import(pathToFileURL(mockOut).href);

// docs/build/rule-extras.json: limits, numeric bands, scan role and snippet cue per Rule, restating rules.md as data.
// Only these four fields are merged, so a rebuild from rules.md never drops them. An unknown Rule id or field fails the build.
const EXTRA_FIELDS = ['limits', 'numeric', 'scan', 'cue'];
const { _readme: _ignored, ...extras } = JSON.parse(readFileSync(resolve(docs, 'rule-extras.json'), 'utf8'));
for (const [id, e] of Object.entries(extras)) {
  if (!docRules.some((r) => r.id === id)) throw new Error(`rule-extras.json: unknown Rule ${id}`);
  const bad = Object.keys(e).filter((k) => !EXTRA_FIELDS.includes(k));
  if (bad.length) throw new Error(`rule-extras.json: ${id} has unknown field(s) ${bad.join(', ')}`);
}

const rules = docRules.map((r) => {
  const mockId = DOCS_TO_MOCK[r.id];
  const mockRule = mock.rules.find((m) => m.id === mockId);
  if (!mockRule) throw new Error(`no mock Rule for ${r.id}`);
  const first = r.sources[0];
  return {
    id: r.id,
    cancer: r.cancerType,
    text: r.redFlag,
    question: r.question,
    source: { label: first.label, url: first.url },
    conditions: r.threshold,
    ...(mockRule.gate ? { gate: mockRule.gate } : {}),
    overTime: r.overTime,
    ...(extras[r.id] ?? {}),
  };
});
write('rules.json', rules);

/* ---------- 3. Patients and visits from docs/build/mock-patients.json ---------- */

// Symptom groups for the Repeat visit flag. Order matters: the first match wins. (Port of api.ts SYMPTOM_GROUPS.)
const SYMPTOM_GROUPS = [
  ['asthma', /asthma|wheeze/i],
  ['cough', /cough|sputum/i],
  ['bowel change', /bowel|stool|fit\b|rectal/i],
  ['bloating', /bloat|fullness|full early/i],
  ['reflux', /reflux|heartburn/i],
  ['back pain', /back pain/i],
];
const symptomOf = (reason) => SYMPTOM_GROUPS.find(([, re]) => re.test(reason))?.[0] ?? reason.toLowerCase();

const rawPatients = JSON.parse(readFileSync(resolve(docs, 'mock-patients.json'), 'utf8'));
const patients = [];
const visits = [];
for (const p of rawPatients) {
  patients.push({
    id: p.patientId,
    name: p.name,
    age: p.age,
    sex: p.sex,
    smokingStatus: p.smokingStatus,
    county: p.wellbeingServicesCounty,
  });
  p.visits.forEach((v, i) => {
    visits.push({
      visitId: `${p.patientId}-v${i + 1}`,
      patientId: p.patientId,
      order: i,
      date: v.date,
      reason: v.reason,
      symptom: symptomOf(v.reason),
      note: v.gpNote,
    });
  });
}
write('patients.json', patients);
write('visits.json', visits);

/* ---------- 4. Templates, staging, severity, county from the mock modules (types.ts shapes) ---------- */

write('referralTemplates.json', Object.values(mock.referralTemplates));
write('stagingTemplates.json', Object.values(mock.stagingTemplates));
write('stagingReports.json', Object.entries(mock.demoStaging).map(([cancer, report]) => ({ ...report, cancer })));
write('severity.json', Object.values(mock.severity));
write('countyGap.json', mock.countyGap);

console.log(
  `seed: ${rules.length} rules, ${patients.length} patients, ${visits.length} visits, ` +
    `${Object.keys(mock.referralTemplates).length} referral templates, ${Object.keys(mock.stagingTemplates).length} staging templates -> ${out}`,
);
