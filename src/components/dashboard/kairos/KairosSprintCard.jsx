import { getSprintContext } from '../../../lib/kairosData.js';

export default function KairosSprintCard() {
  const sprint = getSprintContext();

  return (
    <aside className="kairos-sprint-card" aria-label="Current sprint context">
      <div className="kairos-sprint-top">
        <span className="kairos-sprint-week">{sprint.weekLabel}</span>
        <span className="kairos-sprint-days">{sprint.daysUntilShip} days to Sunday ship</span>
      </div>

      <p className="kairos-sprint-goal">{sprint.sprintGoal}</p>

      <div className="kairos-sprint-bar" aria-label={`Sprint ${sprint.progressPercent}% complete`}>
        <div
          className="kairos-sprint-bar-fill"
          style={{ width: `${sprint.progressPercent}%` }}
        />
      </div>

      <p className="kairos-sprint-ritual">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{sprint.podSyncNote}</span>
      </p>
    </aside>
  );
}
