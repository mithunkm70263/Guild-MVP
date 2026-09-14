const STAT_META = [
  {
    key: 'currentStreak',
    label: 'Current streak',
    suffix: 'days',
    accent: 'flame',
  },
  {
    key: 'totalWeeksCompleted',
    label: 'Weeks completed',
    suffix: 'weeks',
    accent: 'sage',
  },
  {
    key: 'projectsShipped',
    label: 'Projects shipped',
    suffix: '',
    accent: 'gold',
  },
  {
    key: 'publicUpdatesPosted',
    label: 'Public updates',
    suffix: '',
    accent: 'sage',
  },
  {
    key: 'podsJoined',
    label: 'Pods joined',
    suffix: '',
    accent: 'gold',
  },
];

export default function BuilderStats({ extended }) {
  const { builderStats } = extended;

  return (
    <section className="profile-stats" aria-label="Builder stats">
      <header className="profile-stats-head">
        <span className="profile-section-kicker">Momentum</span>
        <h2 className="profile-section-title">Builder stats</h2>
      </header>

      <ul className="profile-stats-grid">
        {STAT_META.map((stat) => {
          const value = builderStats[stat.key] ?? 0;
          return (
            <li
              key={stat.key}
              className={`profile-stat-card profile-stat-card--${stat.accent}`}
            >
              <span className="profile-stat-value">{value}</span>
              <span className="profile-stat-label">{stat.label}</span>
              {stat.suffix ? (
                <span className="profile-stat-suffix">{stat.suffix}</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
