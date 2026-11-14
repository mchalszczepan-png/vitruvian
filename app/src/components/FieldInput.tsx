import type { FieldValue, TemplateField } from '../data/types';
import { More } from './More';
import { optionLabel, originLabel } from './labels';

interface Props {
  field: TemplateField;
  value?: FieldValue;
  onChange: (value: string) => void;
  /** false on forms with no AI fill, such as the Staging report */
  showOrigin?: boolean;
}

/** One Referral template field. Any field is editable; a GP edit marks the value as the GP's own. */
export function FieldInput({ field, value, onChange, showOrigin = true }: Props) {
  const v = value?.value ?? '';
  const origin = value && v !== '' ? value.origin : 'empty';
  const missing = field.required && v === '';
  const id = `f-${field.key}`;
  const multi = field.kind === 'choice' && field.hint?.startsWith('Select all');

  let control;
  if (multi) {
    const picked = new Set(v.split(',').map((s) => s.trim()).filter(Boolean));
    control = (
      <div className="chips" role="group" aria-labelledby={`${id}-l`}>
        {field.options!.map((o) => {
          const on = picked.has(o);
          return (
            <button
              key={o}
              type="button"
              className="btn small"
              aria-pressed={on}
              onClick={() => {
                const next = new Set(picked);
                if (on) next.delete(o);
                else next.add(o);
                onChange([...next].join(', '));
              }}
            >
              {optionLabel(o)}
            </button>
          );
        })}
      </div>
    );
  } else if (field.kind === 'yesno') {
    control = (
      <div className="chips" role="radiogroup" aria-labelledby={`${id}-l`}>
        {['yes', 'no'].map((o) => (
          <button key={o} type="button" role="radio" aria-checked={v === o} aria-pressed={v === o} className="btn small" onClick={() => onChange(o)}>
            {optionLabel(o)}
          </button>
        ))}
      </div>
    );
  } else if (field.kind === 'choice') {
    control = (
      <select id={id} className="input" value={v} onChange={(e) => onChange(e.target.value)}>
        <option value="">Choose…</option>
        {field.options!.map((o) => (
          <option key={o} value={o}>
            {optionLabel(o)}
          </option>
        ))}
      </select>
    );
  } else if (field.kind === 'longtext') {
    control = <textarea id={id} className="input" value={v} rows={2} onChange={(e) => onChange(e.target.value)} />;
  } else {
    const input = (
      <input
        id={id}
        className="input num"
        type={field.kind === 'date' ? 'date' : 'text'}
        inputMode={field.kind === 'number' ? 'decimal' : undefined}
        value={v}
        onChange={(e) => onChange(e.target.value)}
      />
    );
    control = field.unit ? (
      <div className="unit-row">
        {input}
        <span>{field.unit}</span>
      </div>
    ) : (
      input
    );
  }

  return (
    <div className={`field${missing ? ' missing' : ''}`}>
      <div className="field-top">
        <label id={`${id}-l`} htmlFor={id}>
          {field.label}
        </label>
        {field.required && <span className="req">Required</span>}
        {showOrigin && <span className={`tag ${origin}`}>{originLabel[origin]}</span>}
      </div>
      {control}
      {missing && field.kind === 'text' && (
        <div className="toolbar">
          <button type="button" className="linkbtn" onClick={() => onChange('None known')}>
            Set to “None known”
          </button>
        </div>
      )}
      {value?.evidence && origin === 'gemma' && (
        <More className="evidence">
          From the note: <q>{value.evidence}</q>
        </More>
      )}
      {field.hint && !multi && <More className="evidence">{field.hint}</More>}
    </div>
  );
}
