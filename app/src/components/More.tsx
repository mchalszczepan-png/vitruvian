import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

/**
 * One line of text that trails off with an ellipsis. A chevron opens the full text,
 * plus any `extra` detail. The chevron shows only when there is more to see.
 */
export function More({ children, extra, className = '', defaultOpen = false }: { children: ReactNode; extra?: ReactNode; className?: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOver(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  const canOpen = open || over || !!extra;
  return (
    <div className={`more${open ? ' open' : ''} ${className}`}>
      <div className="more-row">
        <p ref={ref} className="more-text">
          {children}
        </p>
        {canOpen && (
          <button type="button" className="more-btn" aria-expanded={open} aria-label={open ? 'Show less' : 'Show more'} onClick={() => setOpen(!open)}>
            <Icon name={open ? 'up' : 'down'} size={16} />
          </button>
        )}
      </div>
      {open && extra}
    </div>
  );
}
