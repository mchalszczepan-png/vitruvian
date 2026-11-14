import type { Source as S } from '../data/types';
import { Icon } from './Icon';

/** Every number on screen sits next to one of these. Placeholder sources say so in words. */
export function Source({ source, prefix = 'Source', short = false }: { source: S; prefix?: string; short?: boolean }) {
  const label = short && source.short ? source.short : source.label;
  return (
    <a className="src" href={source.url} target="_blank" rel="noreferrer" title={`${source.label}\n${source.url}`}>
      <Icon name="link" size={12} />
      <span>
        {prefix}: {label}
      </span>
      {source.placeholder && <b className="ph">Placeholder source</b>}
    </a>
  );
}

/** Just the external-link icon; the source name and link show on hover or focus. */
export function SourceIcon({ source }: { source: S }) {
  return (
    <a className="src-icon" href={source.url} target="_blank" rel="noreferrer" aria-label={`Source: ${source.label} (opens in new tab)`}>
      <Icon name="link" size={16} />
      <span className="src-tip" role="tooltip">
        {source.label}
        {source.placeholder && <b className="ph">Placeholder source</b>}
        <small>{source.url}</small>
      </span>
    </a>
  );
}
