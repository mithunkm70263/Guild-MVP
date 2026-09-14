import { Link } from 'react-router-dom';
import ProfileSection from './ProfileSection.jsx';

export default function CurrentStatus({ extended }) {
  const { currentStatus } = extended;
  const { weeklyProgress, cycle } = currentStatus;

  return (
    <ProfileSection kicker="Now" title="Current status" className="profile-current-status">
      <div className="profile-status-grid">
        <div className="profile-status-field">
          <span className="profile-status-label">Current pod</span>
          <Link to={currentStatus.podUrl} className="profile-status-link">
            {currentStatus.podName}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="profile-status-field">
          <span className="profile-status-label">Sprint goal</span>
          <p className="profile-status-value">{currentStatus.sprintGoal}</p>
        </div>

        <div className="profile-status-field profile-status-field--wide">
          <div className="profile-status-progress-head">
            <span className="profile-status-label">Weekly progress</span>
            <span className="profile-status-progress-pill">{cycle.label}</span>
          </div>
          <p className="profile-status-value">{weeklyProgress.summary}</p>
          <div className="profile-status-bar-wrap">
            <div className="profile-status-bar">
              <div
                className="profile-status-bar-fill"
                style={{ width: `${weeklyProgress.percent}%` }}
              />
            </div>
            <span className="profile-status-bar-label">
              {weeklyProgress.completed}/{weeklyProgress.total} goals
            </span>
          </div>
        </div>
      </div>
    </ProfileSection>
  );
}
