import { useEffect, useState } from 'react';
import { getAid, getPatients } from './data/api';
import type { CancerType, Patient } from './data/types';
import { Icon, Mark } from './components/Icon';
import { GpWorkspace } from './screens/GpWorkspace';
import { ReferralDesk } from './screens/ReferralDesk';
import { Specialist } from './screens/Specialist';
import { County } from './screens/County';

/* One patient journey: the same patient moves through four steps (Michal, 14 Nov). */
type Step = 'gp' | 'desk' | 'specialist' | 'county';
const STEPS: { id: Step; label: string; problem: string }[] = [
  { id: 'gp', label: 'GP visit', problem: 'Symptoms spread over many visits get missed.' },
  { id: 'desk', label: 'Referral desk', problem: 'Incomplete Referrals bounce back.' },
  { id: 'specialist', label: 'Specialist', problem: 'The Specialist needs checkable evidence.' },
  { id: 'county', label: 'County', problem: "The county can't see where its patients lose time." },
];

function readHash(): Step {
  const h = location.hash.replace('#', '').split('/')[0] as Step;
  return STEPS.some((s) => s.id === h) ? h : 'gp';
}

const DAY = 86_400_000;
const dayOf = (p: Patient, iso: string) => Math.round((Date.parse(iso) - Date.parse(p.visits[0].date)) / DAY);

export default function App() {
  const [step, setStep] = useState<Step>(readHash);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState('SYN-001');
  const [focusRef, setFocusRef] = useState<string>();
  const [cancer, setCancer] = useState<CancerType>();

  useEffect(() => {
    getPatients().then(setPatients);
    const onHash = () => setStep(readHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    let live = true;
    setCancer(undefined);
    getAid(patientId)
      .then((a) => live && setCancer(a.noRuleMatched ? undefined : a.suspectedCancer))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [patientId]);

  const go = (s: Step) => {
    location.hash = s;
    setStep(s);
    scrollTo(0, 0);
  };
  const pickPatient = (id: string) => {
    setPatientId(id);
    setFocusRef(undefined);
  };
  const patient = patients.find((p) => p.id === patientId);
  const at = STEPS.findIndex((s) => s.id === step);
  const next = STEPS[at + 1];
  const lastDay = patient && patient.visits.length > 0 ? dayOf(patient, patient.visits[patient.visits.length - 1].date) : 0;

  return (
    <div className="shell">
      <p className="disclaimer" role="note">
        <strong>Research prototype. Not a medical device. Not for clinical use. Made-up patients only.</strong>
      </p>
      <header className="topbar">
        <span className="wordmark">
          <Mark /> Vitruvian
        </span>
        <nav className="ptabs journey" aria-label="Patient journey">
          {STEPS.map((s, i) => (
            <button key={s.id} className={`ptab${i < at ? ' done' : ''}`} aria-current={step === s.id ? 'step' : undefined} aria-selected={step === s.id} onClick={() => go(s.id)}>
              <span className="n">{i + 1}</span>
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      {patient && (
        <section className="journey-strip" aria-label="Patient">
          <b>{patient.name}</b>
          <span>{patient.age}</span>
          <span>{patient.county}</span>
          <span className="journey-days">
            Day 0 <Icon name="arrow" size={16} /> Day {lastDay}
          </span>
          <span className="journey-problem">{STEPS[at].problem}</span>
          {next && (
            <button className="btn primary journey-next" onClick={() => go(next.id)}>
              Next: {next.label}
              <Icon name="arrow" size={16} />
            </button>
          )}
        </section>
      )}

      <main className="main">
        {patients.length > 0 && step === 'gp' && (
          <GpWorkspace
            patients={patients}
            patientId={patientId}
            onPatient={pickPatient}
            onOpenDesk={(id) => {
              setFocusRef(id);
              go('desk');
            }}
          />
        )}
        {step === 'desk' && <ReferralDesk patients={patients} focusId={focusRef} patientId={patientId} onGoGp={() => go('gp')} />}
        {step === 'specialist' && <Specialist patients={patients} patientId={patientId} />}
        {step === 'county' && patient && <County patient={patient} cancer={cancer} />}
      </main>
    </div>
  );
}
