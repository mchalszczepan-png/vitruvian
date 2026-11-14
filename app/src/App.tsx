import { useEffect, useState } from 'react';
import { getPatients } from './data/api';
import type { Patient } from './data/types';
import { Mark } from './components/Icon';
import { GpWorkspace } from './screens/GpWorkspace';
import { ReferralDesk } from './screens/ReferralDesk';
import { Specialist } from './screens/Specialist';
import { County } from './screens/County';

type View = 'gp' | 'desk' | 'specialist' | 'county';
const VIEWS: { id: View; label: string; who: string }[] = [
  { id: 'gp', label: 'GP', who: 'GP (yleislääkäri), health centre' },
  { id: 'desk', label: 'Referral desk', who: 'Referral desk (lähetekäsittely), hospital' },
  { id: 'specialist', label: 'Specialist', who: 'Specialist (erikoislääkäri), hospital' },
  { id: 'county', label: 'Country data', who: 'Wellbeing services county (hyvinvointialue)' },
];

function readHash(): View {
  const h = location.hash.replace('#', '').split('/')[0] as View;
  return VIEWS.some((v) => v.id === h) ? h : 'gp';
}

export default function App() {
  const [view, setView] = useState<View>(readHash);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState('SYN-001');
  const [focusRef, setFocusRef] = useState<string>();

  useEffect(() => {
    getPatients().then(setPatients);
    const onHash = () => setView(readHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  const go = (v: View) => {
    location.hash = v;
    setView(v);
  };

  return (
    <div className="shell">
      <p className="disclaimer" role="note">
        <strong>Research prototype. Not a medical device. Not for clinical use.</strong>
        <span>Made-up patients only.</span>
      </p>
      <header className="topbar">
        <span className="wordmark">
          <Mark /> Vitruvian
        </span>
        <nav className="ptabs" role="tablist" aria-label="Who is using Vitruvian">
          {VIEWS.map((v) => (
            <button key={v.id} role="tab" className="ptab" aria-selected={view === v.id} onClick={() => go(v.id)}>
              {v.label}
            </button>
          ))}
        </nav>
        <span className="who">Viewing as: {VIEWS.find((v) => v.id === view)!.who}</span>
      </header>
      <main className="main">
        {patients.length > 0 && view === 'gp' && (
          <GpWorkspace
            patients={patients}
            patientId={patientId}
            onPatient={setPatientId}
            onOpenDesk={(id) => {
              setFocusRef(id);
              go('desk');
            }}
          />
        )}
        {view === 'desk' && <ReferralDesk patients={patients} focusId={focusRef} onGoGp={() => go('gp')} />}
        {view === 'specialist' && <Specialist />}
        {view === 'county' && <County />}
      </main>
    </div>
  );
}
