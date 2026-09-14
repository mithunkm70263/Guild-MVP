import { Link } from 'react-router-dom';

export default function CurrentStatus({ extended }) {
  const { currentStatus } = extended;
  const { weeklyProgress, cycle } = currentStatus;

  return (
    <section className="profile-status" aria-label="Current status">
      <header className="profile-status-head">
        <span className="profile-section-kicker">Now</span>
        <h2 className="profile-section-title">Current status</h2>
      </header>

      <div className="profile-status-body">
        <div className="profile-status-row">
          <span className="profile-status-label">Current pod</span>
          <Link to={currentStatus.podUrl} className="profile-status-pod-link">
            {currentStatus.podName}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        <div className="profile-status-row">
          <span className="profile-status-label">Sprint goal</span>
          <p className="profile-status-goal">{currentStatus.sprintGoal}</p>
        </div>

        <div className="profile-status-progress">
          <div className="profile-status-progress-meta">
            <span className="profile-status-label">Weekly progress</span>
            <span className="profile-status-progress-count">
              {weeklyProgress.completed}/{weeklyProgress.total}
            </span>
          </div>
          <div
            className="profile-status-bar"
            role="progressbar"
            aria-valuenow={weeklyProgress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Weekly goals progress"
          >
            <div
              className="profile-status-bar-fill"
              style={{ width: `${weeklyProgress.percent}%` }}
            />
          </div>
          <p className="profile-status-summary">{weeklyProgress.summary}</p>
          <p className="profile-status-cycle">{cycle.label}</p>
        </div>
      </div>
    </section>
  );
}
