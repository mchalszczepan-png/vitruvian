// Dictation helpers with no React and no browser APIs, so tests can run them. The component is components/Dictation.tsx.
// Research prototype. Not a medical device. Not for clinical use.
import type { Dictation, DictationMode, TermFlag } from './types';

/** Gemini's note goes after what is already typed, with one blank line between. */
export function appendNote(current: string, addition: string): string {
  const add = addition.trim();
  if (!add) return current;
  return current.trim() ? `${current.trimEnd()}\n\n${add}` : add;
}

/** Accept: the first exact occurrence of the flagged span becomes the suggestion. Text without the span is unchanged. */
export function applyFlag(text: string, flag: TermFlag): string {
  const i = text.indexOf(flag.text);
  return i < 0 ? text : text.slice(0, i) + flag.suggestion + text.slice(i + flag.text.length);
}

/** Flags still worth showing: the span is still in the note and the GP has not answered it. */
export const openFlags = (text: string, flags: TermFlag[], answered: string[]): TermFlag[] =>
  flags.filter((f) => !answered.includes(f.text) && text.includes(f.text));

/** Recording a visit needs the patient's consent first. Dictating your own note does not. */
export const canRecord = (mode: DictationMode, consent: boolean): boolean => mode === 'dictate' || consent;

const MODE_KEY = 'vitruvian.dictationMode';
/** The last mode used in this browser; 'dictate' when nothing is stored or storage is blocked. */
export function loadMode(storage: Pick<Storage, 'getItem'> | undefined): DictationMode {
  try {
    return storage?.getItem(MODE_KEY) === 'visit' ? 'visit' : 'dictate';
  } catch {
    return 'dictate';
  }
}
export function saveMode(storage: Pick<Storage, 'setItem'> | undefined, mode: DictationMode): void {
  try {
    storage?.setItem(MODE_KEY, mode);
  } catch {
    /* per-browser convenience only */
  }
}

/** The first audio type this browser can record; Opus in WebM first (small at 16 kbps). '' lets the browser choose. */
export function pickMimeType(isSupported: (type: string) => boolean): string {
  for (const t of ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/webm', 'audio/mp4']) if (isSupported(t)) return t;
  return '';
}

/** Long enough for a short visit; keeps the inline audio well under the request limit. */
export const MAX_RECORDING_MS = 5 * 60_000;

/**
 * After a recording: Gemini's note is added to what is in the field now (read at the end, so typing during the call is kept).
 * Exported for the test.
 */
export async function insertDictation(args: {
  audioBase64: string;
  mimeType: string;
  mode: DictationMode;
  transcribe: (audioBase64: string, mimeType: string, mode: DictationMode) => Promise<Dictation>;
  getText: () => string;
  onText: (text: string) => void;
}): Promise<Dictation> {
  const d = await args.transcribe(args.audioBase64, args.mimeType, args.mode);
  args.onText(appendNote(args.getText(), d.note));
  return d;
}
