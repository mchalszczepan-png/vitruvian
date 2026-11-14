# 07 · Privacy, AI Act and medical-device rules for the glasses nudge demo

Researcher: research sub-agent (Direction B, glasses) · Date: 2026-11-14
Scope: GDPR (special-category health data, bystanders, on-device vs cloud, Google API retention), EU AI Act risk class, EU MDR 2017/745 boundary (when a nudge app becomes a medical device), and how to scope the demo as a wellness tool.

Not legal advice. Items marked **UNVERIFIED** were not confirmed in the primary text in this session. Get a regulatory or privacy adviser before any real use.

Terms: **GDPR** = General Data Protection Regulation (EU) 2016/679. **MDR** = Medical Device Regulation (EU) 2017/745. **MDCG** = EU Medical Device Coordination Group (guidance). **MDSW** = medical device software. **DPIA** = data protection impact assessment (GDPR Art. 35).

---

## 1. Summary

1. The app sends camera frames of people's lives to Google. Frames of **bystanders** are personal data. The EDPB (EU data protection board) says smart-glasses recording needs a narrow view of the household exemption and on-device blurring where possible. [source](https://www.edpb.europa.eu/system/files/2026-10/20261310_edpb_statement_smart-glasses_en.pdf) (PDF text not readable in this session; see 2.2)
2. Food, smoking, alcohol and sun-exposure facts are likely to be **health-related data** (GDPR Art. 9 special category). Treat them that way. That needs explicit consent for the user, and no consent path exists for bystanders, so bystanders must not be identified or stored.
3. The AI Act probably does **not** make a wellness nudge high-risk, but it does require telling users they are talking to an AI.
4. The **MDR** question is the real risk. The product's stated purpose — lowering cancer risk — is a disease-**prevention** purpose. Under MDR Art. 2(1) that can make the app a medical device. The fix is to scope the demo's intended purpose as healthy-habit tips with **no disease claim** in the app.
5. Demo checklist in Section 7.

---

## 2. GDPR

### 2.1 Special-category health data

- Art. 9(1) prohibits processing "data concerning health" unless an Art. 9(2) condition applies. Source: https://gdpr-info.eu/art-9-gdpr/ (text re-read in this session).
- Art. 4(15) definition, verbatim: "'data concerning health' means personal data related to the physical or mental health of a natural person, including the provision of health care services, which reveal information about his or her health status" (source: https://gdpr-info.eu/art-4-gdpr/, re-read in this session).
- Art. 9(2)(a): explicit consent "for one or more specified purposes" (source: https://gdpr-info.eu/art-9-gdpr/, re-read).
- **Inference risk:** the CJEU held in *OT v Vyriausioji tarnybinės etikos komisija* (C-184/20, 1 Aug 2022) that Art. 9 covers data that reveals sensitive information **indirectly**. Source: secondary (https://www.thomashelbing.com/en/wissen/dsgvo-hub/rechtsprechung/1.4.15-eugh-vyriausioji); judgment text not read. Primary copy seen but not readable in this session (BAILII returned 403, EUR-Lex returned navigation only): https://mansfield.bailii.org/eu/cases/EUECJ/2022/C18420.html Judgment reference ECLI:EU:C:2022:601 per that summary (**UNVERIFIED**).
- **Our reading (assumption):** a frame that shows a cigarette, a glass of alcohol, or a meat dish with "processed" inferred reveals something about the user's health status or behaviour. Treat it as special-category data. Consent-based processing (Art. 9(2)(a)) is the realistic basis for the user. A lawyer should confirm whether food or smoking inference is always special category (**UNVERIFIED**).

### 2.2 Bystanders and filming

- The household exemption (GDPR Art. 2(2)(c)) covers purely personal or household activity. It does **not** cover a device that records other people in public or shares the footage. Source: EDPB Statement 1/2026 on smart glasses: https://www.edpb.europa.eu/system/files/2026-10/20261310_edpb_statement_smart-glasses_en.pdf . News page (confirms that posting to a public social media account makes the user a controller): https://www.edpb.europa.eu/news/edpb-publishes-statement-on-the-data-protection-challenges-of-smart-glasses_en . (corrected: the news page is dated 13 Oct 2026 and does not print an adoption date.) **The PDF was not readable in this session, so the paragraph numbers and quotes in 2.2 are not re-checked.**
- EDPB para. 14, verbatim: "This exemption must, however, be narrowly construed and be considered on a case-by-case basis in light of the circumstances of the processing." It says the exemption does not apply where footage is shared "to an indefinite number of persons on a public social media account".
- EDPB para. 7: smart glasses "allow a near invisible or hidden collection, storage, and other forms of processing of personal data since they can be difficult to distinguish from ordinary eyewear."
- EDPB para. 8: individuals may oppose being filmed, and this can change how people behave.
- EDPB para. 30: legitimate interests (Art. 6(1)(f)) for bystander data needs a case-by-case test. Controllers must let all data subjects object at any time, which "can prove difficult in many cases". **Do not rely on legitimate interests for bystanders in this demo.**
- EDPB para. 33 (recommendation): controllers should consider measures such as "blur/obscure or avoid processing the identity of bystanders, pseudonymisation, or anonymisation before sharing or re-use. Where possible, this processing should happen on-device." It also says persistent storage "should therefore be disabled by default" for real-time assistance devices.
- Our reading: the demo must not store or share bystander faces. Face blurring on the phone before upload is the matching measure.

### 2.3 On-device vs cloud

- The Gemini Decisions API (model `gemini-decision-1`) is a hosted Google endpoint, served through the Gemini API and Google AI Studio. (corrected: the blog does not use the word "cloud".) Source: https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/ (dated 11 Nov 2026). So every frame that goes to the API leaves the phone and reaches Google.
- What can run on device: capture, face blurring, deciding whether to call the API (motion or change detection), and deleting frames after the answer.
- What cannot run on device in this design: the probability answers themselves (the Decisions API model is hosted). **UNVERIFIED:** whether an on-device model is part of the plan.
- The API key stays on a small backend (per `/home/michal/.t3/projects/vitruvian/docs/README.md`). The backend should not log frame content.

### 2.4 Google API data retention

Source (verified in this session): https://aistudio.google.com/docs/logs-policy (the old ai.google.dev URL redirects here).
- Logging is on by default for Generate Content calls in projects created on or after **26 Oct 2026**, and for Interactions API calls.
- Retention: "a default maximum period of 55 days"; can be set to 7, 14, 28 or 55 days in AI Studio.
- Project logs are private to the Google Cloud project and are not used for training by default. Abuse-monitoring logs are "separate from any logs held solely for abuse monitoring purposes."
- Sharing a dataset is opt-in and can be used for model training. Do not opt in.
- A search summary says `store=false` on a request turns logging off (**UNVERIFIED**: not shown on the fetched page).
- Gemini Decisions API runs on a paid Google API key (paid-tier terms), GDPR compliant per Michal (2026-11-14).

### 2.5 DPIA and minimisation

- Art. 35 requires a DPIA where processing is likely to be high risk, which includes large-scale special-category data and systematic monitoring of public areas. Source: https://gdpr-info.eu/art-35-gdpr/ (checked this session against a third-party copy of the GDPR text: Art. 35(1), 35(3)(b) and 35(3)(c) confirmed).
- Art. 5(1)(c) minimisation: send the smallest useful frame, skip frames without food or people, and never store raw frames. Source: https://gdpr-info.eu/art-5-gdpr/ (**UNVERIFIED** re-read).
- For a hackathon, write a short DPIA-style note in the repo. It is cheap and a judge may ask.

---

## 3. EU AI Act

### 3.1 Risk class

- Art. 6(1): an AI system is high-risk if it is a **product, or safety component, under EU product law listed in Annex I** and "is required to undergo a third-party conformity assessment pursuant to the Union harmonisation legislation listed in Annex I". Source: https://artificialintelligenceact.eu/article/6/ (text re-read in this session).
- Under MDR, third-party assessment is needed for MDR class IIa and above [source needed]. Our app is not in that class if it is not a medical device at all (see Section 4). So Art. 6(1) probably does **not** apply to a pure wellness build.
- Art. 6(2) / **Annex III** lists standalone high-risk uses. Annex III point 5 covers access to essential services. Point 5(d) covers "emergency healthcare patient triage systems" (checked this session: https://artificialintelligenceact.eu/annex/3/). **Keep the routing features out of the demo** if you want to avoid this.
- Not prohibited: the Art. 5 bans on emotion recognition in work or schools (Art. 5(1)(f)) and on untargeted face scraping (Art. 5(1)(e)) do not apply. Source: https://artificialintelligenceact.eu/article/5/ (checked this session). **Do not add face or identity recognition** (the EDPB statement warns about facial recognition with smart glasses).

### 3.2 Transparency (Art. 50)

- Art. 50(1), verbatim: providers must design AI systems that interact directly with people so that "the natural persons concerned are informed that they are interacting with an AI system", unless it is obvious. Source: https://artificialintelligenceact.eu/article/50/ (re-read in this session).
- Practical: the spoken nudge must be clearly AI-generated, and the demo should say so at the start.

### 3.3 Dates (UNVERIFIED primary source)

- Secondary sources say, after the May 2026 provisional deal on the Digital Omnibus on AI: Annex III high-risk obligations from **2 Dec 2027**; Annex I (product-embedded, incl. medical devices) from **2 Aug 2028**. Sources: https://www.wsgrdataadvisor.com/2026/05/eu-ai-act-undergoes-significant-changes/ and https://www.techuk.org/insights/news/eu-ai-omnibus-deal-reached-more-clarity-on-ai-act-obligations
- Sources disagree on the final Council adoption date (29 June vs 1 July 2026). Check the Official Journal text before quoting dates.

---

## 4. EU MDR 2017/745: when a nudge app becomes a medical device

### 4.1 The definition

- Art. 2(1) (secondary quote; EUR-Lex text was not retrievable in this session): a medical device is an instrument, software etc. "intended by the manufacturer to be used for human beings for the purpose of diagnosis, prevention, monitoring, prediction, prognosis, treatment or alleviation of disease". Source: https://eur-lex.europa.eu/eli/reg/2017/745/oj (open the English text to confirm).
- The **intended purpose** (what the manufacturer says the product is for, in label, marketing and copy) decides. How the software works is secondary.
- "Prevention" is in the list. The MDR does not define it; commentators read it as primary prevention (search summary only: https://arxiv.org/pdf/2202.12049 is an academic analysis of "intention", not guidance).

### 4.2 What MDCG 2019-11 rev.1 (June 2025) says

Source (PDF read in an earlier session; on 14 Nov the PDF was not readable by the fetch tool, so the quotes below are **not re-checked**): https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf (announcement: https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en, 17 June 2025).

- Section 3 (Qualification), verbatim excerpt: software "only intended for non-medical purposes (excluding MDR Annex XVI devices), such as invoicing, staff planning, e-mailing, web or voice messaging, data parsing, word processing, and back-up, wellness or fitness apps, do not qualify as MDSW."
- So a **pure wellness or fitness app with no medical purpose** is outside MDSW.
- Section 4.2.1, Rule 11 (Annex VIII of MDR): software "intended to provide information which is used to take decisions with diagnosis or therapeutic purposes is classified as class IIa", with higher classes for serious harm.
- Example in the guidance (verbatim): "a device intended to prevent the risk of illnesses or pathologies by analysing physiological parameters ... can be considered as a device providing information which is used to take decisions with diagnosis purpose (potential detection of pathologies) and in this case is in class IIa."
- Reading: a **prevention** purpose that analyses a person to predict disease can be class IIa. Our app analyses a person's images to estimate cancer-risk behaviour. That is prevention-plus-prediction. The example maps closely.

### 4.3 Where our product sits (assessment)

| Product version | Intended purpose as written | MDR status (our assessment, **UNVERIFIED** legal view) |
|---|---|---|
| "Lower your cancer risk. Smoking? Processed meat? Here's a tip." | Prevention and prediction of cancer | **Likely a medical device** (prevention + prediction, Rule 11 class IIa). Needs a CE mark and a notified body. Not feasible in a hackathon |
| "Healthy-habit tips while you eat and walk outside." No disease names; no risk scores | General wellness | **Likely outside MDR** under MDCG section 3 (wellness app), if the claims and UI support it |
| "Shows you a risk percentage for your health" | Prediction of disease for an individual | **Likely medical device**. Do not build |

- Note the Decisions API outputs probabilities. Showing them to the user as a risk estimate pushes the app toward prediction. Keep the probabilities internal and act on a threshold without showing numbers.
- Fimea is the Finnish competent authority for medical devices: https://fimea.fi/en/medical-devices (page read in this session; it says "Fimea supervises the regulatory compliance of medical devices and the operators in the sector in Finland" but has **no** wellness or MDSW boundary text). Search also surfaced a Fimea MDSW decision tree (**UNVERIFIED**: not opened).

---

## 5. Scope the demo as a wellness tool

Concrete wording and design rules. Each one reduces the MDR and GDPR risk.

1. **Intended-purpose statement (write it once, show it in the app and in the repo):** "Demonstration of general healthy-eating and outdoor-habit tips. Not for diagnosis, screening, disease prevention or risk assessment. Does not replace medical advice."
2. **No disease claims in the app itself.** Spoken nudges say "Consider a lighter processed-meat option" and "Shade and sunscreen help on a strong-sun day", not "reduces your cancer risk". Put the cancer background on the slides, labelled as research context with sources.
3. **No risk numbers shown to the user.** Use the probabilities only for a yes/no threshold inside the app.
4. **No symptom checks, no skin-lesion advice, no routing to clinical care** in the demo. (These push toward detection = medical device.)
5. **Say it is AI** at the start of the demo (Art. 50).
6. **Bystanders:** no real strangers filmed. Use staff or volunteers who agree on tape. Blur faces on the phone before any upload.

---

## 6. Data flow for the demo (minimum)

1. Phone captures a frame only when the user taps "ask" (no continuous capture). Source of the design: EDPB para. 33 on storage and on-device steps.
2. On device: blur any face; drop frames with no food, smoke, drink or sun in view if a cheap check exists.
3. Frame goes over HTTPS to the backend. Backend calls Gemini Decisions API with the questions. **Set logging off where the API allows it (verify first; see Section 2.4).**
4. Backend returns yes/no or a threshold answer to the phone. Backend does not store the frame or the answer.
5. Phone speaks one short nudge and deletes the frame.
6. Analytics: count events only (e.g. "nudge shown: yes"). No frame, no face, no location.

---

## 7. Practical checklist for the demo

- [ ] Intended-purpose statement written and shown (Section 5.1)
- [ ] No disease names, no risk scores, no clinical routing in app copy (Section 5.2–5.4)
- [ ] Spoken AI disclosure at start (Art. 50)
- [ ] Bystanders: only consenting staff; no stranger faces in recordings; face blur on device before upload
- [ ] Capture on user tap only; no continuous video; no raw frames stored on phone or backend
- [ ] Backend keeps the API key and logs no frame content; logging on Gemini side checked (`store=false` or equivalent, verified for Decisions API)
- [ ] Gemini processing: no dataset sharing; no training opt-in
- [ ] Health-related inferences (smoking, alcohol, food) treated as special-category; the demo collects no personal identifiers and no health records
- [ ] Short DPIA-style note in repo (purpose, data, retention, bystander handling)
- [ ] Source list for every slide claim (the brief requires sources) — link the EDPB statement, MDCG 2019-11 rev.1 and the Gemini blog
- [ ] Demo recording: no bystander faces, or consent on tape
- [ ] Judge Q&A answer ready: "Why is this not a medical device?" → the wellness scope above, plus MDCG section 3; "Why is Google seeing frames?" → Google as processor, 55-day default logs, on-device blur, no storage

---

## 8. Open UNVERIFIED items

- Decisions API logging, retention and region (Section 2.4).
- Whether `store=false` (or equivalent) applies to Decisions API calls.
- Art. 9 status of food and smoking inference (Section 2.1) — legal view needed.
- Full text of MDR Art. 2(1), Annex VIII Rule 11 (EUR-Lex not read), and Fimea's MDSW decision tree.
- Final AI Act dates and the Annex I medical-device route (Section 3.3).
- Art. 5 (minimisation) statute text: not re-read in this session. (Art. 35 and Annex III point 5 are now checked; see 2.5 and 3.1.)
- EDPB statement paragraph numbers and quotes (Section 2.2): the PDF was not readable in this session.
- CJEU C-184/20 judgment text and ECLI (Section 2.1): primary copy not readable in this session.
- MDCG 2019-11 quotes (Section 4.2) and MDR Art. 2(1) wording (Section 4.1): not re-checked in this session.
