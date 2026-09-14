export default function PinnedStatus({ extended }) {
  const { pinnedStatus } = extended;

  return (
    <article className="profile-pinned" aria-label="Current status">
      <div className="profile-pinned-head">
        <span className="profile-pinned-icon" aria-hidden="true">📌</span>
        <p className="profile-pinned-text">
          Currently: {pinnedStatus.podName}, {pinnedStatus.cycleLabel}, {pinnedStatus.goalsLabel}
        </p>
      </div>
      <div className="profile-pinned-bar" role="progressbar" aria-valuenow={pinnedStatus.progressPercent} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="profile-pinned-bar-fill"
          style={{ width: `${pinnedStatus.progressPercent}%` }}
        />
      </div>
    </article>
  );
}
