# GP talk script (10 minutes)

Use with Finnish public health centre GPs, 2026-11-14. Ask about past behaviour, not opinions. Take notes per GP in the table at the end. Do not record patient data.

"§7" means the Risky assumptions section of `docs/BUILD-PLAN.md`. The hospital-call questions in §6 are not repeated here.

## Opener (about 1 minute)

**EN:** Hi, we are a team at the Junction 2026 hackathon. We are building a tool that helps GPs notice suspected lung, colorectal and prostate cancer earlier, and the GP always makes the decision. We are not asking for any patient data; we only want to hear how referrals work in your day.

**FI:** Hei, olemme tiimi Junction 2026 -hackathonista. Teemme työkalua, joka auttaa yleislääkäriä huomaamaan epäillyn keuhko-, paksusuoli- ja eturauhassyövän aiemmin. Lääkäri tekee aina päätöksen itse. Emme pyydä potilastietoja, haluamme vain kuulla, miten lähetteet teillä käytännössä menevät.

## Questions (most important first)

### 1. Returns

**EN:** In the last month, how many of your referrals came back, or were asked to be completed? What were the reasons?

**FI:** Viime kuukauden aikana, kuinka moni lähetteenne palasi takaisin tai siihen pyydettiin täydennystä? Mitä syitä niihin oli?

**Why we ask:** Tests §7 #1, that incomplete referrals really come back and cost time.

### 2. What is missing

**EN:** When a referral comes back, what was it usually missing? What did they ask you for last time?

**FI:** Kun lähete palaa, mitä siinä yleensä puuttui? Mitä viimeksi pyydettiin lisäämään?

**Why we ask:** Tests §7 #1 and #4, what a structured referral must contain. The hospital side of this is in §6, so keep this question about the GP's experience.

### 3. Time per referral

**EN:** Think of the last referral you wrote for a suspected cancer. Roughly how long did it take you, from opening the record to sending it?

**FI:** Ajatelkaa viimeisintä syöpäepäilyn lähetettänne. Noin kuinka kauan se teiltä kului, avaamisesta lähettämiseen?

**Why we ask:** Tests §7 #1, whether the time cost is big enough for a template to matter. Ask for a rough estimate, not an exact figure.

### 4. Stage

**EN:** When you know how far the disease has spread, do you write that stage in the referral? When was the last time it was left out, and why?

**FI:** Kun tiedätte, missä vaiheessa sairaus on, kirjoitatteko sen lähetteeseen? Milloin se viimeksi jäi pois, ja miksi?

**Why we ask:** Tests §7 #3, that the stage is known but not sent.

### 5. Third visit

**EN:** How do you notice that a patient has come in for the same symptom a third time? Do you use something to track it, or do you remember it yourself?

**FI:** Miten huomaatte, että sama potilas on tullut kolmannen kerran samasta oireesta? Käytättekö siihen jotakin keinoa, vai huomaatteko sen muistamalla?

**Why we ask:** Tests whether the Repeat visit flag catches something GPs miss today. It links to §7 #5, that a GP acts on an aid.

### 6. Past alerts

**EN:** Do you remember the last time your patient record system showed you an alert or a reminder? What did you do after it?

**FI:** Muistatteko viimeksi, kun potilastietojärjestelmä näytti jonkin hälytyksen tai muistutuksen? Mitä teitte sen jälkeen?

**Why we ask:** Tests §7 #5, whether an AI estimate beside guideline Rules would be used or ignored. We ask about a real past alert, not about our tool. Follow up with: "Was it useful or annoying?"

### 7. Stopped tools

**EN:** Do you remember a tool or a guideline that you stopped using? What led to that?

**FI:** Muistatteko jonkin työkalun tai ohjeen, jonka lopititte käyttämästä? Mikä siihen johti?

**Why we ask:** Tests §7 #5, what makes a GP trust or ignore an aid. Skip this if time is short.

## Close (about 1 minute)

**EN:** Thank you. Is there anything you would want us to know before we build? (Write it down word for word.)

**FI:** Kiitos paljon. Onko jotain, mitä toivoisitte meidän tietävän ennen kuin rakennamme mitään? (Kirjatkaa vastaus sanatarkasti.)

## Answers per GP

No names. Fill one row per GP.

| GP | Area | Years in practice | Q1 returned last month (count, reasons) | Q3 minutes per referral | Q5 how they spot a 3rd visit | Q6 last alert and what they did | Notes (Q2, Q4, Q7, close) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GP 1 | | | | | | | |
| GP 2 | | | | | | | |
| GP 3 | | | | | | | |
