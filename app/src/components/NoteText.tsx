import { useLayoutEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { useT } from './lang';

/*
 * Notes stay plain text (Michal, 15 Nov): lines starting "- " show as a bullet list,
 * lines starting "1. " as a numbered list. Everything else keeps its line breaks.
 */
const BULLET = /^\s*[-•*]\s+(.*)$/;
const NUMBER = /^\s*(\d+)[.)]\s+(.*)$/;

type Block = { kind: 'p'; text: string } | { kind: 'ul'; items: string[] } | { kind: 'ol'; start: number; items: string[] };

function blocks(text: string): Block[] {
  const out: Block[] = [];
  for (const line of text.split('\n')) {
    const b = BULLET.exec(line);
    const n = NUMBER.exec(line);
    const last = out.at(-1);
    if (b) {
      if (last?.kind === 'ul') last.items.push(b[1]);
      else out.push({ kind: 'ul', items: [b[1]] });
    } else if (n) {
      if (last?.kind === 'ol') last.items.push(n[2]);
      else out.push({ kind: 'ol', start: Number(n[1]), items: [n[2]] });
    } else if (last?.kind === 'p') last.text += `\n${line}`;
    else out.push({ kind: 'p', text: line });
  }
  return out.filter((b) => b.kind !== 'p' || b.text.trim());
}

/** A note as written, with "- " and "1. " lines shown as lists. */
export function NoteText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`note-text ${className}`}>
      {blocks(text).map((b, i) =>
        b.kind === 'p' ? (
          <p key={i}>{b.text.trim()}</p>
        ) : b.kind === 'ul' ? (
          <ul key={i}>
            {b.items.map((t, j) => (
              <li key={j}>{t}</li>
            ))}
          </ul>
        ) : (
          <ol key={i} start={b.start}>
            {b.items.map((t, j) => (
              <li key={j}>{t}</li>
            ))}
          </ol>
        ),
      )}
    </div>
  );
}

/** A saved note folds itself to a few lines; the chevron opens the rest. The chevron shows only when there is more. */
export function FoldedNote({ text }: { text: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOver(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, open]);
  return (
    <div className={`note-fold${open ? ' open' : ''}${over ? ' over' : ''}`}>
      <div ref={ref} className="note-fold-body">
        <NoteText text={text} />
      </div>
      {(over || open) && (
        <button type="button" className="linkbtn note-fold-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
          {t(open ? 'Show less' : 'Show all')} <Icon name={open ? 'up' : 'down'} size={14} />
        </button>
      )}
    </div>
  );
}
