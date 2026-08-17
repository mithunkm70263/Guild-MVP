export function GuildMark() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className="dash-guild-mark">
      <rect x="2" y="2" width="40" height="40" rx="12" fill="#FFFDF5" />
      <path
        d="M22 8l10 6v12l-10 6-10-6V14l10-6z"
        fill="none"
        stroke="#121212"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M22 14v16M16 18l6 4 6-4" fill="none" stroke="#E86F2C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function NavIcon({ type }) {
  const paths = {
    chat: (
      <>
        <path d="M4 6h16v10H4z" />
        <path d="M8 18l-3-2h11" />
      </>
    ),
    command: (
      <>
        <path d="M4 7h16v10H4z" />
        <path d="M8 11h8M8 14h5" />
      </>
    ),
    pod: (
      <>
        <circle cx="12" cy="8" r="3" />
        <circle cx="6" cy="16" r="2.5" />
        <circle cx="18" cy="16" r="2.5" />
        <path d="M9.5 10.5 7 14M14.5 10.5 17 14M8 16h8" />
      </>
    ),
    missions: (
      <>
        <path d="M6 6h12v12H6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    signals: (
      <>
        <path d="M4 14c2.5-3 5.5-3 8 0s5.5 3 8 0" />
        <path d="M7 10c1.8-2 4.2-2 6 0s4.2 2 6 0" />
        <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="dash-nav-icon">
      {paths[type]}
    </svg>
  );
}

export function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3 10 14" />
      <path d="m21 3-7 18-4-7-7-4 18-7Z" />
    </svg>
  );
}

export function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2l2.4 7.1L22 12l-7.6 2.9L12 22l-2.4-7.1L2 12l7.6-2.9L12 2Z" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
