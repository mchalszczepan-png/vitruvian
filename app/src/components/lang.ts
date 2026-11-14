import { useSyncExternalStore } from 'react';

/* Label language switch (Michal, 14 Nov): show "Weight loss" or "Painonlasku", not both in brackets. */
export type Lang = 'en' | 'fi';

const KEY = 'vitruvian-lang';
let lang: Lang = (() => {
  try {
    return localStorage.getItem(KEY) === 'fi' ? 'fi' : 'en';
  } catch {
    return 'en';
  }
})();
const subs = new Set<() => void>();

export function setLang(l: Lang) {
  lang = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* private window: keep it in memory only */
  }
  subs.forEach((f) => f());
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => lang,
  );
}

/**
 * "Weight loss (Painonlasku)" -> "Weight loss" or "Painonlasku".
 * Only a trailing bracket that starts with a capital or digit is a Finnish term;
 * lower-case brackets like "(primary tumour)" are English notes and stay.
 */
const BI = /^(.+?)\s*\(([A-ZÄÖÅ0-9][^()]*)\)\s*$/;
export function bi(text: string, l: Lang): string {
  const m = BI.exec(text);
  return m ? (l === 'fi' ? m[2] : m[1]) : text;
}

/** Same, as a hook for components. */
export function useBi() {
  const l = useLang();
  return (text: string) => bi(text, l);
}
