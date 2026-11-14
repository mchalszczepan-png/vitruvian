import { setLang, useLang, type Lang } from './lang';

/** EN / FI switch for field labels and Finnish terms. */
export function LangSwitch() {
  const l = useLang();
  return (
    <div className="lang" role="group" aria-label="Label language">
      {(['en', 'fi'] as Lang[]).map((x) => (
        <button key={x} type="button" className="btn small" aria-pressed={l === x} onClick={() => setLang(x)}>
          {x.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
