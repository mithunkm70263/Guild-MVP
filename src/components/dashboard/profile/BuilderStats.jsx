import ProfileSection from './ProfileSection.jsx';

const STAT_ITEMS = [
  { key: 'currentStreak', label: 'Current streak', suffix: ' days', accent: true },
  { key: 'totalWeeksCompleted', label: 'Weeks completed', suffix: '' },
  { key: 'projectsShipped', label: 'Projects shipped', suffix: '' },
  { key: 'publicUpdatesPosted', label: 'Public updates', suffix: '' },
  { key: 'podsJoined', label: 'Pods joined', suffix: '' },
];

export default function BuilderStats({ extended }) {
  const stats = extended.builderStats;

  return (
    <ProfileSection kicker="Momentum" title="Builder stats" className="profile-builder-stats">
      <div className="profile-stat-row">
        {STAT_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`profile-stat-chip${item.accent ? ' profile-stat-chip--accent' : ''}`}
          >
            <span className="profile-stat-chip-value">
              {stats[item.key]}{item.suffix}
            </span>
            <span className="profile-stat-chip-label">{item.label}</span>
          </div>
        ))}
      </div>
    </ProfileSection>
  );
}
