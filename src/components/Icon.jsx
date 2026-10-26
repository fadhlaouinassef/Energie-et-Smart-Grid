export default function Icon({ name = "bolt", size = 24 }) {
  const paths = {
    bolt: <path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    diagonal: <path d="M5 19 19 5M5 5h14v14" />,
    solar: (
      <>
        <path d="m5 12-3 8h20l-3-8H5Zm7 0v8M4 16h16M12 20v3M8 23h8" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 0v1M5 2l1 1m12-1-1 1M3 7h2m14 0h2" />
      </>
    ),
    grid: (
      <path d="m12 2-7 20m7-20 7 20M8 12h8M6 18h12M4 7h16M9 7l6 5-8 6m8-11-6 5 8 6" />
    ),
    equipment: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <path d="m13 7-4 6h5l-2 4M8 3V1m8 2V1" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3" />
      </>
    ),
    place: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    sparkle: (
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM21 2v4m-2-2h4" />
    ),
    link: <path d="m9 15 6-6m-7 3H6a4 4 0 0 1 0-8h5m2 16h5a4 4 0 0 0 0-8h-2" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.bolt}
    </svg>
  );
}
