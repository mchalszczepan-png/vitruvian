import type { Source as S } from '../data/types';
import { useT } from './lang';
import { Icon } from './Icon';

/** Every number on screen sits next to one of these. Placeholder sources say so in words. */
export function Source({ source, prefix = 'Source', short = false }: { source: S; prefix?: string; short?: boolean }) {
  const t = useT();
  const label = short && source.short ? source.short : source.label;
  return (
    <a className="src" href={source.url} target="_blank" rel="noreferrer" title={`${source.label}\n${source.url}`}>
      <Icon name="link" size={12} />
      <span>
        {t(prefix)}: {label}
      </span>
      {source.placeholder && <b className="ph">{t('Placeholder source')}</b>}
    </a>
  );
}

/** Just the external-link icon; the source name and link show on hover or focus. */
export function SourceIcon({ source }: { source: S }) {
  const t = useT();
  return (
    <a className="src-icon" href={source.url} target="_blank" rel="noreferrer" aria-label={`${t('Source')}: ${source.label} (${t('opens in new tab')})`}>
      <Icon name="link" size={16} />
      <span className="src-tip" role="tooltip">
        {source.label}
        {source.placeholder && <b className="ph">{t('Placeholder source')}</b>}
        <small>{source.url}</small>
      </span>
    </a>
  );
}
