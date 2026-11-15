import type { ReactNode } from 'react';
import { Icon } from './Icon';

/** The GP patient list: grey panel, search with icon, rows of buttons (aria-current marks the open one).
 *  Shared by the GP screen and the Referral desk so both lists look the same. */
export function SearchList({
  label,
  placeholder,
  searchLabel,
  query,
  onQuery,
  empty,
  children,
}: {
  label: string;
  placeholder: string;
  searchLabel: string;
  query: string;
  onQuery: (q: string) => void;
  /** shown when nothing matches the search */
  empty?: string;
  children: ReactNode;
}) {
  return (
    <nav className="nf-list" aria-label={label}>
      <div className="nf-search-wrap">
        <Icon name="search" size={16} />
        <input type="search" className="nf-search" placeholder={placeholder} aria-label={searchLabel} value={query} onChange={(e) => onQuery(e.target.value)} />
      </div>
      {empty && <p className="nf-list-none">{empty}</p>}
      {children}
    </nav>
  );
}
