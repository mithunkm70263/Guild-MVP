import { motion, useReducedMotion } from 'framer-motion';
import ProfileSection from './ProfileSection.jsx';

function ProgressRing({ percent, size = 72 }) {
  const reduceMotion = useReducedMotion();
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="profile-progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="profile-progress-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <motion.circle
          className="profile-progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="profile-progress-ring-label">{percent}%</span>
    </div>
  );
}

export default function CommitmentSection({ extended }) {
  const { cycle, buildingFocus, subGoal, weeklyHours, quitConcern } = extended;

  return (
    <ProfileSection
      id="profile-commitment"
      kicker="This cycle"
      title="Your commitment"
      subtitle="What you said you'd build — and what keeps you honest."
      className="profile-commitment"
      variant="reflective"
    >
      <div className="profile-commitment-grid">
        <div className="profile-commitment-focus">
          <span className="profile-commitment-label">Building toward</span>
          <p className="profile-commitment-value">{buildingFocus}</p>
          {subGoal && (
            <p className="profile-commitment-sub">{subGoal}</p>
          )}
        </div>

        <div className="profile-commitment-stats">
          <div className="profile-commitment-stat">
            <ProgressRing percent={cycle.progressPercent} />
            <div className="profile-commitment-stat-copy">
              <span className="profile-commitment-stat-value">{cycle.label}</span>
              <span className="profile-commitment-stat-hint">Guild cycle progress</span>
            </div>
          </div>

          {weeklyHours && (
            <div className="profile-commitment-hours">
              <span className="profile-commitment-hours-value">{weeklyHours}</span>
              <span className="profile-commitment-hours-label">weekly hours committed</span>
            </div>
          )}
        </div>
      </div>

      <blockquote className="profile-accountability-nudge">
        <span className="profile-accountability-icon" aria-hidden="true">◎</span>
        <p>{quitConcern}</p>
      </blockquote>
    </ProfileSection>
  );
}
