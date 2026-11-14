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
