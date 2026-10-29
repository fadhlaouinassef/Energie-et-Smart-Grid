const PATHS = {
  search: <path d="m21 21-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4" />,
  trash: <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v6m4-6v6" />,
  download: <path d="M12 4v11m-5-4 5 5 5-5M5 20h14" />,
  check: <path d="m5 13 4 4L19 7" />,
  alert: <path d="M12 4 2 20h20L12 4Zm0 6v5m0 3v.01" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  code: <path d="m8 8-5 4 5 4m8-8 5 4-5 4m-3-10-2 12" />,
  graph: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="18" cy="19" r="2" />
      <circle cx="5" cy="18" r="2" />
      <path d="m10 10-3.5-3.5M14 10.5l3.5-3M14 14l3 3.5M10 14l-3.5 3" />
    </>
  ),
  history: <path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-4v4h4m5-1v5l3 2" />,
  send: <path d="m4 12 16-8-6 17-3-7-7-2Z" />,
};

export default function Glyph({ name, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
