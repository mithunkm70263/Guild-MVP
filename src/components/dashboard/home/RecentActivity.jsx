import { formatRelativeTime, getRecentActivity } from '../../../lib/homeData.js';
import HomeCard from './HomeCard.jsx';

const TYPE_LABELS = {
  artifact: 'Artifact',
  milestone: 'Milestone',
  update: 'Update',
};

export default function RecentActivity() {
  const activities = getRecentActivity();
  const featured = activities[0];

  return (
    <HomeCard className="home-activity-card" hoverable={false}>
      <header className="home-card-head">
        <div className="home-card-head-row">
          <div>
            <h2 className="home-card-title">Recent Progress</h2>
            <p className="home-card-subtitle">Latest from you and your pod</p>
          </div>
        </div>
      </header>

      {featured && (
        <div className="home-activity-featured">
          <span className="home-activity-featured-label">Latest artifact</span>
          <p className="home-activity-featured-text">
            <strong>{featured.actorName}</strong> {featured.action}
          </p>
          <span className="home-activity-featured-time">{formatRelativeTime(featured.timestamp)}</span>
        </div>
      )}

      {activities.length === 0 ? (
        <div className="home-empty-state">
          <p className="home-empty-title">No activity yet</p>
          <p className="home-empty-copy">Ship something today and your pod will see it here.</p>
        </div>
      ) : (
        <ul className="home-activity-feed">
          {activities.map((item) => (
            <li key={item.id} className="home-activity-item">
              <span
                className="home-activity-avatar"
                style={{ background: `linear-gradient(135deg, ${item.avatarColor}, ${item.avatarColor}cc)` }}
                aria-hidden="true"
              >
                {item.actorInitials}
              </span>
              <div className="home-activity-copy">
                <p className="home-activity-text">
                  <strong>{item.actorName}</strong> {item.action}
                </p>
                <div className="home-activity-meta">
                  <span className={`home-activity-type home-activity-type--${item.type}`}>
                    {TYPE_LABELS[item.type] || 'Update'}
                  </span>
                  <span className="home-activity-time">{formatRelativeTime(item.timestamp)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </HomeCard>
  );
}
