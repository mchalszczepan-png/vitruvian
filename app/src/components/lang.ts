import { useSyncExternalStore } from 'react';
import { FI } from './fi';

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
    () => lang, // server render (tests)
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

export const getLang = (): Lang => lang;

type Vars = Record<string, string | number>;

/**
 * Fixed app text in the chosen language (Michal, 15 Nov): a built-in word list, switched instantly.
 * Notes and anything a person typed are never translated. Keys are the English text; {name} marks a value.
 * Text missing from the list falls back to the bracket rule above, then to the English.
 */
export function tr(en: string, l: Lang, vars?: Vars): string {
  const s = l === 'fi' ? (FI[en] ?? bi(en, 'fi')) : bi(en, 'en');
  return vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s;
}

/** The translator as a hook, so a component re-renders when the language changes. */
export function useT() {
  const l = useLang();
  return (en: string, vars?: Vars) => tr(en, l, vars);
}

/** Older name, kept for existing callers. */
export const useBi = useT;
