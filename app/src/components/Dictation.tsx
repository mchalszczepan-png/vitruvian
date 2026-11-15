// Dictation under the note field: press the mic to record, press again to stop. Gemini cleans the clip into a note,
// which is added to the field (still editable before Save). Finnish notes get a folded English translation. Then MedGemma
// lists doubtful medicine terms; nothing changes unless the GP accepts. The audio is sent once and never stored.
// Research prototype. Not a medical device. Not for clinical use.
import { useEffect, useRef, useState } from 'react';
import { checkMedicineTerms, transcribeDictation } from '../data/api';
import { applyFlag, canRecord, insertDictation, loadMode, MAX_RECORDING_MS, openFlags, pickMimeType, saveMode } from '../data/dictation';
import type { DictationMode, TermCheck } from '../data/types';
import { Icon } from './Icon';
import { useT } from './lang';

type Phase = 'idle' | 'starting' | 'recording' | 'cleaning';

const storage = (): Storage | undefined => {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).replace(/^data:[^,]*,/, ''));
    r.onerror = () => reject(new Error('could not read the recording'));
    r.readAsDataURL(blob);
  });
}

const clock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export function Dictation({ text, onText, initialMode }: { text: string; onText: (text: string) => void; initialMode?: DictationMode }) {
  const t = useT();
  const [mode, setMode] = useState<DictationMode>(() => initialMode ?? loadMode(storage()));
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [english, setEnglish] = useState('');
  const [check, setCheck] = useState<TermCheck>();
  const [answered, setAnswered] = useState<string[]>([]);
  const textRef = useRef(text);
  useEffect(() => {
    textRef.current = text;
  });
  const rec = useRef<{ recorder: MediaRecorder; stream: MediaStream; timer: ReturnType<typeof setInterval>; stopAt: ReturnType<typeof setTimeout> } | undefined>(undefined);

  // Leaving the note (Save, Cancel, another patient) stops the mic.
  useEffect(
    () => () => {
      const r = rec.current;
      if (!r) return;
      clearInterval(r.timer);
      clearTimeout(r.stopAt);
      r.recorder.onstop = null;
      if (r.recorder.state !== 'inactive') r.recorder.stop();
      r.stream.getTracks().forEach((tr) => tr.stop());
    },
    [],
  );

  const pick = (m: DictationMode) => {
    setMode(m);
    saveMode(storage(), m);
  };

  async function start() {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError(t('This browser cannot record. Type the note instead.'));
      return;
    }
    setPhase('starting');
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setPhase('idle');
      setError(t('No microphone access. Type the note instead.'));
      return;
    }
    const mimeType = pickMimeType((ty) => MediaRecorder.isTypeSupported(ty));
    const recorder = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: 16_000 });
    const chunks: Blob[] = [];
    const recMode = mode;
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };
    recorder.onstop = () => void finish(new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/webm' }), recMode);
    const t0 = Date.now();
    const timer = setInterval(() => setElapsed(Date.now() - t0), 500);
    const stopAt = setTimeout(stop, MAX_RECORDING_MS);
    rec.current = { recorder, stream, timer, stopAt };
    setEnglish('');
    setCheck(undefined);
    setAnswered([]);
    setElapsed(0);
    recorder.start();
    setPhase('recording');
  }

  function stop() {
    const r = rec.current;
    if (!r) return;
    clearInterval(r.timer);
    clearTimeout(r.stopAt);
    r.stream.getTracks().forEach((tr) => tr.stop());
    if (r.recorder.state !== 'inactive') r.recorder.stop();
    rec.current = undefined;
    // Consent covers one recording only.
    setConsent(false);
  }

  async function finish(blob: Blob, recMode: DictationMode) {
    if (!blob.size) {
      setPhase('idle');
      setError(t('Nothing was recorded. Try again or type the note.'));
      return;
    }
    setPhase('cleaning');
    try {
      const d = await insertDictation({
        audioBase64: await blobToBase64(blob),
        mimeType: blob.type,
        mode: recMode,
        transcribe: transcribeDictation,
        getText: () => textRef.current,
        onText,
      });
      if (d.language === 'fi' && d.english) setEnglish(d.english);
      setPhase('idle');
      // The note is already in the field; the medicine check never holds it up.
      const c = await checkMedicineTerms(d.note);
      if (c?.flags.length) setCheck(c);
    } catch {
      setPhase('idle');
      setError(t('Dictation failed. Your note is unchanged; type it or try again.'));
    }
  }

  const allowed = canRecord(mode, consent);
  const busy = phase === 'starting' || phase === 'cleaning';
  const flags = check ? openFlags(text, check.flags, answered) : [];
  const checkBy = check && /medgemma/i.test(check.model) ? 'MedGemma' : (check?.model.split('/').pop() ?? '');

  return (
    <div className="dict">
      <div className="dict-bar">
        {phase === 'recording' ? (
          <button type="button" className="btn small dict-mic on" onClick={stop}>
            <span className="dict-dot" aria-hidden /> {t('Stop')} <span className="num">{clock(elapsed)}</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn small dict-mic"
            disabled={busy || !allowed}
            onClick={() => void start()}
            title={allowed ? undefined : t('Tick patient consent first')}
          >
            <Icon name="mic" /> {phase === 'cleaning' ? t('Cleaning up…') : mode === 'visit' ? t('Record the visit') : t('Dictate')}
          </button>
        )}
        <div className="dict-modes" role="group" aria-label={t('Dictation mode')}>
          {(['dictate', 'visit'] as const).map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} disabled={phase !== 'idle'} onClick={() => pick(m)}>
              {m === 'dictate' ? t('Dictate my note') : t('Record the visit')}
            </button>
          ))}
        </div>
        {mode === 'visit' && (
          <label className="dict-consent">
            <input type="checkbox" checked={consent} disabled={phase !== 'idle'} onChange={(e) => setConsent(e.target.checked)} />{' '}
            {t('Patient agreed to recording')}
          </label>
        )}
      </div>
      <small className="dict-note" role="status">
        {phase === 'recording'
          ? t('Recording. Press Stop when done.')
          : error ||
            (mode === 'visit' ? t('Visit note drafted by Gemini from the recording. Check before saving.') : t('Dictation by Gemini. Check before saving.'))}
      </small>
      {english && (
        <details className="dict-en">
          <summary>{t('English translation (Gemini), check before use')}</summary>
          <p lang="en">{english}</p>
        </details>
      )}
      {flags.length > 0 && (
        <div className="dict-flags" role="group" aria-label={t('Medicine check by {model}', { model: checkBy })}>
          <small>{t('Medicine check by {model}', { model: checkBy })}</small>
          <ul>
            {flags.map((f) => (
              <li key={f.text}>
                <span>
                  <mark>{f.text}</mark> {t('Did you mean {s}?', { s: f.suggestion })}
                  {f.reason && <small> {f.reason}</small>}
                </span>
                <span className="dict-flag-act">
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => {
                      onText(applyFlag(text, f));
                      setAnswered((a) => [...a, f.text]);
                    }}
                  >
                    {t('Accept')}
                  </button>
                  <button type="button" className="btn small" onClick={() => setAnswered((a) => [...a, f.text])}>
                    {t('Ignore')}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
