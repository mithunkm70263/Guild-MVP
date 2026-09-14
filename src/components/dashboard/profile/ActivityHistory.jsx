import { motion, useReducedMotion } from 'framer-motion';
import ProfileSection from './ProfileSection.jsx';
import { listItem, staggerContainer } from '../home/motionVariants.js';

function AttendanceBar({ attended, scheduled }) {
  const percent = Math.round((attended / scheduled) * 100);

  return (
    <div className="profile-attendance-bar-wrap">
      <div className="profile-attendance-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <motion.div
          className="profile-attendance-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
      </div>
      <span className="profile-attendance-bar-label">{percent}% attendance</span>
    </div>
  );
}

function TimelineItem({ item, isLast, variants }) {
  const typeClass = `profile-timeline-item--${item.type}`;

  return (
    <motion.li className={`profile-timeline-item ${typeClass}`} variants={variants}>
      <div className="profile-timeline-marker" aria-hidden="true">
        <span className="profile-timeline-dot" />
        {!isLast && <span className="profile-timeline-line" />}
      </div>
      <div className="profile-timeline-content">
        <span className="profile-timeline-week">{item.label}</span>
        <p className="profile-timeline-artifact">{item.artifact}</p>
        {item.type === 'shipped' && (
          <span className="profile-timeline-badge profile-timeline-badge--shipped">Shipped</span>
        )}
        {item.type === 'in-progress' && (
          <span className="profile-timeline-badge profile-timeline-badge--progress">In progress</span>
        )}
        {item.type === 'upcoming' && (
          <span className="profile-timeline-badge profile-timeline-badge--upcoming">Upcoming</span>
        )}
      </div>
    </motion.li>
  );
}

export default function ActivityHistory({ extended }) {
  const reduceMotion = useReducedMotion();
  const { attendance, timeline } = extended;

  return (
    <ProfileSection
      id="profile-activity"
      kicker="Earned record"
      title="Real activity"
      subtitle="Attendance and artifacts from your actual Guild sessions."
      className="profile-activity"
    >
      <div className="profile-activity-stats">
        <div className="profile-activity-stat">
          <span className="profile-activity-stat-value">{attendance.ratioLabel}</span>
          <span className="profile-activity-stat-label">Session attendance</span>
          <AttendanceBar attended={attendance.attended} scheduled={attendance.scheduled} />
        </div>

        <div className="profile-activity-stat profile-activity-streak">
          <div className="profile-streak-ring">
            <span className="profile-streak-count">{attendance.streak}</span>
          </div>
          <div className="profile-streak-copy">
            <span className="profile-activity-stat-value">Week streak</span>
            <span className="profile-activity-stat-label">From actual attendance</span>
          </div>
        </div>
      </div>

      <div className="profile-timeline-wrap">
        <h3 className="profile-timeline-heading">Weekly artifacts</h3>
        <motion.ol
          className="profile-timeline"
          variants={staggerContainer}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          {timeline.map((item, index) => (
            <TimelineItem
              key={item.week}
              item={item}
              isLast={index === timeline.length - 1}
              variants={listItem}
            />
          ))}
        </motion.ol>
      </div>
    </ProfileSection>
  );
}
