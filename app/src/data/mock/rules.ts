// Rules and Severity mock data. Source: docs/build/rules.md and docs/build/staging-and-severity.md (2026-11-14).
// Research prototype. Not a medical device. Not for clinical use.
import type { CancerType, Rule, Severity, Source } from '../types';
import { S } from './sources';

const ng12 = (section: string): Source => ({ label: `NICE NG12 ${section}`, url: S.ng12Sites.url });
const CA125_GATE = { test: 'CA-125', threshold: 'by age: 35 IU/mL at 40–49, 31 at 50–59, 24 at 60–69, 25 at 70–79, 31 at 80+', source: ng12('1.5.9 and Table 1 [2026]; not yet checked against the NICE PDF') };
const FIT_GATE = { test: 'FIT', threshold: '≥ 10 µg Hb/g', source: ng12('1.3.2 [2023]; UK threshold, Finnish cut-off not confirmed') };

export const rules: Rule[] = [
  // Lung. Finnish Käypä hoito lung recommendation was removed 15.12.2023; NG12 only.
  {
    id: 'lung-cxr',
    cancer: 'lung',
    text: 'Chest X-ray shows a finding that suggests lung cancer',
    question: 'Does the note say a chest X-ray showed a finding that suggests lung cancer, such as a mass, nodule or shadow?',
    source: ng12('1.1.1 [2015]'),
    conditions: 'Any age.',
  },
  {
    id: 'lung-haemoptysis',
    cancer: 'lung',
    text: 'Unexplained coughing up blood',
    question: 'Does the note say the patient has coughed up blood, with no clear cause found?',
    source: ng12('1.1.1 [2015]'),
    conditions: 'Age 40 and over.',
  },
  {
    id: 'lung-two-symptoms',
    cancer: 'lung',
    text: 'Two or more unexplained: cough, tiredness, breathlessness, chest pain, weight loss, appetite loss',
    question: 'Does the note say the patient has two or more of these unexplained symptoms: cough, tiredness, breathlessness, chest pain, weight loss, or loss of appetite?',
    source: ng12('1.1.2 [2015]'),
    conditions: 'Age 40 and over. No duration threshold in NG12.',
  },
  {
    id: 'lung-smoker-symptom',
    cancer: 'lung',
    text: 'Ever smoked, with one unexplained chest or weight symptom',
    question: 'Does the note say the patient has at least one of these unexplained symptoms: cough, tiredness, breathlessness, chest pain, weight loss, or loss of appetite?',
    source: ng12('1.1.2 [2015]'),
    conditions: 'Age 40 and over; has ever smoked. No duration threshold in NG12.',
  },
  {
    id: 'lung-infection',
    cancer: 'lung',
    text: 'Chest infection that is persistent or keeps coming back',
    question: 'Does the note say the patient has had a chest infection that keeps coming back or does not clear?',
    source: ng12('1.1.3 [2015]'),
    conditions: 'Age 40 and over.',
  },
  {
    id: 'lung-clubbing',
    cancer: 'lung',
    text: 'Finger clubbing',
    question: 'Does the note say the patient has finger clubbing?',
    source: ng12('1.1.3 [2015]'),
    conditions: 'Age 40 and over.',
  },
  {
    id: 'lung-nodes',
    cancer: 'lung',
    text: 'Enlarged lymph nodes above the collarbone, or persistent neck nodes',
    question: 'Does the note say the patient has enlarged lymph nodes above the collarbone, or enlarged neck lymph nodes that have persisted?',
    source: ng12('1.1.3 [2015]'),
    conditions: 'Age 40 and over.',
  },
  {
    id: 'lung-platelets',
    cancer: 'lung',
    text: 'Raised platelet count',
    question: 'Does the note say the platelet count is raised?',
    source: ng12('1.1.3 [2015]'),
    conditions: 'Age 40 and over. NG12 gives no number; use the lab upper reference limit [unverified].',
  },
  {
    id: 'lung-chest-signs',
    cancer: 'lung',
    text: 'Chest examination findings consistent with lung cancer',
    question: 'Does the note describe chest examination findings that could fit lung cancer?',
    source: ng12('1.1.3 [2015]'),
    conditions: 'Age 40 and over.',
  },

  // Colorectal. FIT (>= 10 µg Hb/g) is the gate for every symptom Rule except the FIT Rule itself and rectal mass.
  {
    id: 'crc-fit',
    cancer: 'colorectal',
    text: 'FIT result of 10 µg Hb/g or more',
    question: 'Does the note give a FIT result of 10 micrograms of haemoglobin per gram of faeces or more?',
    source: ng12('1.3.2 [2023]; UK threshold, Finnish cut-off not confirmed'),
    conditions: 'Any age. Finnish FIT cut-off not confirmed [unverified]; NG12 figure used.',
  },
  {
    id: 'crc-abdo-mass',
    cancer: 'colorectal',
    text: 'Abdominal mass, a lump in the tummy',
    question: 'Does the note say the patient has an abdominal mass, a lump in the tummy?',
    source: ng12('1.3.1 and 1.3.3 [2023]'),
    conditions: 'Any age. Offer FIT; refer without waiting for FIT if the GP has strong concern (NG12 1.3.3).',
    gate: FIT_GATE,
  },
  {
    id: 'crc-rectal-mass',
    cancer: 'colorectal',
    text: 'Mass felt in the rectum on examination',
    question: 'Does the note say a mass was felt in the rectum on examination?',
    source: ng12('1.3.5 [2015, amended 2023]'),
    conditions: 'Any age. No FIT needed first.',
  },
  {
    id: 'crc-bowel-habit',
    cancer: 'colorectal',
    text: 'Change in bowel habit, such as new diarrhoea or constipation',
    question: 'Does the note say the patient has had a change in their bowel habit, such as new diarrhoea or constipation?',
    source: ng12('1.3.1 [2023]'),
    conditions: 'No age limit in NG12.',
    gate: FIT_GATE,
  },
  {
    id: 'crc-ida',
    cancer: 'colorectal',
    text: 'Iron-deficiency anaemia',
    question: 'Does the note say the patient has iron-deficiency anaemia?',
    source: ng12('1.3.1 [2023]'),
    conditions: 'No age limit in NG12.',
    gate: FIT_GATE,
  },
  {
    id: 'crc-anaemia-60',
    cancer: 'colorectal',
    text: 'Anaemia (low haemoglobin), even without iron deficiency',
    question: 'Does the note say the patient has anaemia, meaning low haemoglobin?',
    source: ng12('1.3.1 [2023]'),
    conditions: 'Age 60 and over. Haemoglobin cut-off not in NG12 [unverified]; use lab reference limit.',
    gate: FIT_GATE,
  },
  {
    id: 'crc-weight-pain',
    cancer: 'colorectal',
    text: 'Unexplained weight loss together with unexplained abdominal pain',
    question: 'Does the note say the patient has both unexplained weight loss and abdominal pain?',
    source: ng12('1.3.1 [2023]'),
    conditions: 'Age 40 and over.',
    gate: FIT_GATE,
  },
  {
    id: 'crc-bleeding-50',
    cancer: 'colorectal',
    text: 'Unexplained rectal bleeding, abdominal pain or weight loss',
    question: 'Does the note say the patient has unexplained rectal bleeding, unexplained abdominal pain, or unexplained weight loss?',
    source: ng12('1.3.1 [2023]'),
    conditions: 'Age 50 and over; any one of the three is enough.',
    gate: FIT_GATE,
  },
  {
    id: 'crc-bleeding-under-50',
    cancer: 'colorectal',
    text: 'Unexplained rectal bleeding with abdominal pain or weight loss',
    question: 'Does the note say the patient has unexplained rectal bleeding together with unexplained abdominal pain or weight loss?',
    source: ng12('1.3.1 [2023]'),
    conditions: 'Under 50.',
    gate: FIT_GATE,
  },

  // Ovarian. docs/build/rules.md OVAR-01 to OVAR-08. CA-125 is the gate (age 40+), like FIT for colorectal.
  // OVAR-06 leads to an urgent ultrasound; OVAR-01 and OVAR-07 lead to a Referral. No usable Finnish criteria.
  {
    id: 'OVAR-01',
    cancer: 'ovarian',
    text: 'Ascites, or a pelvic or abdominal mass on examination',
    question: 'Does the note say the examination found fluid in the abdomen (ascites), or a mass in the pelvis or abdomen that is not obviously fibroids?',
    source: ng12('1.5.1 [2011, amended 2020]'),
    conditions: 'Any age. Not obviously uterine fibroids. Refer.',
  },
  {
    id: 'OVAR-02',
    cancer: 'ovarian',
    text: 'Persistent or frequent bloating (abdominal distension)',
    question: 'Does the note say the patient has had persistent or frequent bloating or abdominal swelling?',
    source: ng12('1.5.2 [2011]'),
    conditions: 'Any age, especially 50+. CA-125 needed from age 40.',
    gate: CA125_GATE,
  },
  {
    id: 'OVAR-03',
    cancer: 'ovarian',
    text: 'Persistent or frequent early fullness, or loss of appetite',
    question: 'Does the note say the patient has had persistent or frequent early fullness after small amounts of food, or loss of appetite?',
    source: ng12('1.5.2 [2011]'),
    conditions: 'Any age, especially 50+. CA-125 needed from age 40.',
    gate: CA125_GATE,
  },
  {
    id: 'OVAR-04',
    cancer: 'ovarian',
    text: 'Persistent or frequent pelvic or abdominal pain',
    question: 'Does the note say the patient has had pelvic or abdominal pain that persists or keeps coming back?',
    source: ng12('1.5.2 [2011]'),
    conditions: 'Any age, especially 50+. CA-125 needed from age 40.',
    gate: CA125_GATE,
  },
  {
    id: 'OVAR-05',
    cancer: 'ovarian',
    text: 'Persistent urinary urgency or frequency, more than 12 times a month',
    question: 'Does the note say the patient passes urine more than 12 times a month, or has urgency or frequency that persists, with no urine infection explaining it?',
    source: ng12('1.5.2 [2011]'),
    conditions: 'Any age, especially 50+. Not a short urine infection. CA-125 needed from age 40.',
    gate: CA125_GATE,
  },
  {
    id: 'OVAR-06',
    cancer: 'ovarian',
    text: 'CA-125 at or above the threshold for her age',
    question: 'Does the note say the CA-125 is at or above the age threshold: 35 IU/mL at ages 40–49, 31 at 50–59, 24 at 60–69, 25 at 70–79, or 31 at 80 and over?',
    source: ng12('1.5.9 and Table 1 [2026]; not yet checked against the NICE PDF'),
    conditions: 'Age 40+. Next step: urgent ultrasound of the abdomen and pelvis. The lab limit of 35 IU/mL is not the referral rule.',
  },
  {
    id: 'OVAR-07',
    cancer: 'ovarian',
    text: 'Ultrasound suggests ovarian cancer',
    question: 'Does the note say the ultrasound scan suggested ovarian cancer?',
    source: ng12('1.5.10 [2011, amended 2026]'),
    conditions: 'Any age. Refer.',
  },
  {
    id: 'OVAR-08',
    cancer: 'ovarian',
    text: 'Persistent ovarian symptoms at 39 or under',
    question: 'Does the note say the patient is 39 or under and has persistent symptoms that suggest ovarian cancer?',
    source: ng12('1.5.6 and 1.5.7 [2026]'),
    conditions: 'Age 39 and under. Do not use CA-125 alone. Consider an urgent ultrasound.',
  },
];

// Finland, 5-year relative survival. Headline = all-ages, comparable measure where one exists (see population).
// Lung and colorectal headlines are age-standardised. Ovarian is age-standardised too (Hemminki 2024, Table S3). Not 58.3%: that is conditional survival.
export const severity: Record<CancerType, Severity> = {
  lung: {
    cancer: 'lung',
    fiveYearSurvivalPct: 16.4,
    population:
      'Finland, men, all ages 0–89, 2016–2020. Age-standardised 5-year relative survival (Pohar Perme), from the Nordic paper, Table 2(b). Women: 25.5%.',
    breakdown: [
      { label: 'Women, all ages 0–89, 2016–2020, age-standardised (Clin Epidemiol 2023)', pct: 25.5 },
      { label: 'Men, aged 60–69, 2017–2021, age-specific (Johansson 2024)', pct: 16.7 },
      { label: 'Women, aged 60–69, 2017–2021, age-specific (Johansson 2024)', pct: 25.5 },
    ],
    ageBands: [
      { sex: 'male', min: 60, max: 69, pct: 16.7, period: '2017–2021', source: S.johansson2024 },
      { sex: 'female', min: 60, max: 69, pct: 25.5, period: '2017–2021', source: S.johansson2024 },
    ],
    source: S.nordicLungClinEpi,
  },
  colorectal: {
    cancer: 'colorectal',
    fiveYearSurvivalPct: 68,
    population:
      'Finland, bowel cancer (as the indicator is titled), both sexes, age-standardised, national, Sotkanet statistical year 2024 (indicator 3627, region 658).',
    breakdown: [
      { label: 'Men, aged 60–69, 2017–2021, age-specific (Johansson 2024)', pct: 68.1 },
      { label: 'Women, aged 60–69, 2017–2021, age-specific (Johansson 2024)', pct: 72.4 },
    ],
    ageBands: [
      { sex: 'male', min: 60, max: 69, pct: 68.1, period: '2017–2021', source: S.johansson2024 },
      { sex: 'female', min: 60, max: 69, pct: 72.4, period: '2017–2021', source: S.johansson2024 },
    ],
    source: S.sotkanetColon,
  },
  ovarian: {
    cancer: 'ovarian',
    fiveYearSurvivalPct: 49.1,
    population:
      'Finland, women, all ages, 2017–2021. Age-standardised 5-year relative survival (Pohar Perme), NORDCAN data, Supplementary Table S3. 95% CI 47.1–51.3.',
    breakdown: [
      { label: 'Women, aged 0–49, 2017–2021, age-specific (Hemminki 2024, Table S3)', pct: 77.7 },
      { label: 'Women, aged 50–59, 2017–2021, age-specific (Hemminki 2024, Table S3)', pct: 65.6 },
      { label: 'Women, aged 60–69, 2017–2021, age-specific (Hemminki 2024, Table S3)', pct: 49.4 },
      { label: 'Women, aged 70–79, 2017–2021, age-specific (Hemminki 2024, Table S3)', pct: 40.8 },
      { label: 'Women, aged 80–89, 2017–2021, age-specific (Hemminki 2024, Table S3)', pct: 23.4 },
    ],
    ageBands: [
      { sex: 'female', min: 0, max: 49, pct: 77.7, period: '2017–2021', source: S.hemminki2024 },
      { sex: 'female', min: 50, max: 59, pct: 65.6, period: '2017–2021', source: S.hemminki2024 },
      { sex: 'female', min: 60, max: 69, pct: 49.4, period: '2017–2021', source: S.hemminki2024 },
      { sex: 'female', min: 70, max: 79, pct: 40.8, period: '2017–2021', source: S.hemminki2024 },
      { sex: 'female', min: 80, max: 89, pct: 23.4, period: '2017–2021', source: S.hemminki2024 },
    ],
    source: S.hemminki2024,
  },
};
