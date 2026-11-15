// One stroke icon set, 1.75 stroke, 16px default. Authored SVG, no icon font.
const paths = {
  link: 'M9 4H4v12h12v-5M12 3h5v5M17 3l-8 8',
  alert: 'M10 3 18 17H2L10 3Zm0 5v4m0 2.5v.5',
  check: 'M4 10.5 8 14.5 16 5.5',
  arrow: 'M4 10h12m-5-5 5 5-5 5',
  down: 'M5 8l5 5 5-5',
  up: 'M5 12l5-5 5 5',
  plus: 'M10 4v12M4 10h12',
  menu: 'M3 5h14M3 10h14M3 15h14',
  trash: 'M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10',
  search: 'M9 3a6 6 0 1 0 0 12A6 6 0 0 0 9 3Zm4.5 10.5L17 17',
  repeat: 'M4 8a6 6 0 0 1 10.5-3.5L16 6M16 2v4h-4M16 12a6 6 0 0 1-10.5 3.5L4 14m0 4v-4h4',
  doc: 'M5 2h7l4 4v12H5V2Zm7 0v4h4M8 10h5M8 13h5',
  plug: 'M7 2v4m6-4v4M5 6h10v3a5 5 0 0 1-10 0V6Zm5 8v4',
  send: 'M3 10 17 3l-4 14-3-6-7-1Zm7 1 7-8',
  pencil: 'M13 3l4 4-9 9H4v-4l9-9Z',
  spark: 'M10 2v4m0 8v4M2 10h4m8 0h4M4.5 4.5l2.5 2.5m6 6 2.5 2.5m0-11-2.5 2.5m-6 6-2.5 2.5',
  mic: 'M10 2.5a2.5 2.5 0 0 0-2.5 2.5v5a2.5 2.5 0 0 0 5 0V5A2.5 2.5 0 0 0 10 2.5ZM5 9.5a5 5 0 0 0 10 0M10 14.5v3',
  play: 'M6 4v12l10-6-10-6Z',
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 16, label }: { name: IconName; size?: number; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={paths[name]} />
    </svg>
  );
}

/** The Vitruvian logo (wine figure in a circle). */
export function Mark({ size = 22 }: { size?: number }) {
  return <img className="mark" src="/logo.png" width={size} height={size} alt="" aria-hidden />;
}
