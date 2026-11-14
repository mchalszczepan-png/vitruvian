import { useState } from 'react';
import { Icon, Mark } from '../components/Icon';
import { useBi } from '../components/lang';
import { LangSwitch } from '../components/LangSwitch';

export type Role = 'gp' | 'desk' | 'specialist';
export const ROLES: { id: Role; label: string; place: string; user: string }[] = [
  { id: 'gp', label: 'GP', place: 'Health centre (Terveyskeskus)', user: 'Dr. Demo, Pirkkala health centre' },
  { id: 'desk', label: 'Referral desk', place: 'Hospital (Sairaala)', user: 'Desk nurse Demo, Tays hospital' },
  { id: 'specialist', label: 'Specialist', place: 'Hospital (Sairaala)', user: 'Dr. Demo, Tays hospital' },
];

/** Fake sign-in: any username and password work. Each role opens only its own screen. */
export function Login({ onSignIn }: { onSignIn: (r: Role) => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const t = useBi();
  return (
    <div className="login">
      <aside className="login-brand">
        {/* Logo slot: swap Mark for the designer's logo. */}
        <span className="login-logo" aria-hidden>
          <Mark />
        </span>
        <h1>Vitruvian</h1>
        <p>Health-care sign-in</p>
      </aside>
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSignIn('gp');
        }}
      >
        <div className="login-head">
          <h2>Sign in</h2>
          <LangSwitch />
        </div>
        <input className="input" aria-label="Username" placeholder="Username" autoComplete="off" value={user} onChange={(e) => setUser(e.target.value)} />
        <input className="input" aria-label="Password" placeholder="Password" type="password" autoComplete="off" value={pass} onChange={(e) => setPass(e.target.value)} />
        <p className="login-hint">Any username and password work. Choose your role.</p>
        <ul className="login-roles">
          {ROLES.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => onSignIn(r.id)}>
                <span>
                  <b>{r.label}</b>
                  <small>{t(r.place)}</small>
                </span>
                <Icon name="arrow" size={16} />
              </button>
            </li>
          ))}
        </ul>
        <p className="login-terms">
          Uses MedGemma under{' '}
          <a href="https://developers.google.com/health-ai-developer-foundations/terms" target="_blank" rel="noreferrer">
            Google's Health AI Developer Foundations Terms of Use
          </a>
          . Demo with made-up patients; not for clinical use.
        </p>
      </form>
    </div>
  );
}
