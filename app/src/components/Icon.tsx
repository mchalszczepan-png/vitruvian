// One stroke icon set, 1.75 stroke, 16px default. Authored SVG, no icon font.
const paths = {
  link: 'M9 4H4v12h12v-5M12 3h5v5M17 3l-8 8',
  alert: 'M10 3 18 17H2L10 3Zm0 5v4m0 2.5v.5',
  check: 'M4 10.5 8 14.5 16 5.5',
  arrow: 'M4 10h12m-5-5 5 5-5 5',
  repeat: 'M4 8a6 6 0 0 1 10.5-3.5L16 6M16 2v4h-4M16 12a6 6 0 0 1-10.5 3.5L4 14m0 4v-4h4',
  doc: 'M5 2h7l4 4v12H5V2Zm7 0v4h4M8 10h5M8 13h5',
  plug: 'M7 2v4m6-4v4M5 6h10v3a5 5 0 0 1-10 0V6Zm5 8v4',
  send: 'M3 10 17 3l-4 14-3-6-7-1Zm7 1 7-8',
  pencil: 'M13 3l4 4-9 9H4v-4l9-9Z',
  spark: 'M10 2v4m0 8v4M2 10h4m8 0h4M4.5 4.5l2.5 2.5m6 6 2.5 2.5m0-11-2.5 2.5m-6 6-2.5 2.5',
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

export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path d="M11 4h16a2 2 0 0 1 2 2.4l-4.2 20A2 2 0 0 1 22.8 28H5a2 2 0 0 1-2-2.4l4.2-20A2 2 0 0 1 9.2 4Z" fill="#690C3E" />
      <path d="M15 10h6.5l-2.2 12H12.8Z" fill="#F3BA2C" />
    </svg>
  );
}
