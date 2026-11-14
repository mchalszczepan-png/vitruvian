import { useEffect, useState } from 'react';
import { getPatients } from './data/api';
import type { Patient } from './data/types';
import { Mark } from './components/Icon';
import { GpWorkspace } from './screens/GpWorkspace';
import { ReferralDesk } from './screens/ReferralDesk';
import { Specialist } from './screens/Specialist';
import { County } from './screens/County';
import { Login, ROLES, type Role } from './screens/Login';

/* Fake sign-in (Michal, 14 Nov): each role sees only its own screen. #county is hidden, for screenshots only. */
type View = Role | 'county' | 'login';
function readHash(): View {
  const h = location.hash.replace('#', '').split('/')[0];
  return h === 'county' || ROLES.some((r) => r.id === h) ? (h as View) : 'login';
}

export default function App() {
  const [view, setView] = useState<View>(readHash);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState('SYN-001');

  useEffect(() => {
    getPatients().then(setPatients);
    const onHash = () => setView(readHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);
  const go = (v: View) => {
    location.hash = v === 'login' ? '' : v;
    setView(v);
  };
  const role = ROLES.find((r) => r.id === view);

  return (
    <div className={`shell${view === 'login' ? ' shell-login' : ''}`}>
      <p className="disclaimer" role="note">
        <strong>Research prototype. Not a medical device. Not for clinical use. Made-up patients only.</strong>
      </p>
      {view === 'login' ? (
        <Login onSignIn={go} />
      ) : (
        <>
          <header className="topbar">
            <span className="wordmark">
              <Mark /> Vitruvian
            </span>
            {role && (
              <span className="who">
                <b>{role.label}</b> · {role.user}
              </span>
            )}
            <button className="btn signout" onClick={() => go('login')}>
              Sign out
            </button>
          </header>
          <main className="main">
            {patients.length > 0 && view === 'gp' && <GpWorkspace patients={patients} patientId={patientId} onPatient={setPatientId} />}
            {view === 'desk' && <ReferralDesk patients={patients} />}
            {view === 'specialist' && <Specialist patients={patients} />}
            {view === 'county' && <County />}
          </main>
        </>
      )}
    </div>
  );
}
