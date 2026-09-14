import { motion, useReducedMotion } from 'framer-motion';
import {
  formatMeetingDate,
  formatMeetingTime,
  getUpcomingMeeting,
} from '../../../lib/homeData.js';
import HomeCard from './HomeCard.jsx';

export default function UpcomingMeeting() {
  const meeting = getUpcomingMeeting();
  const reduceMotion = useReducedMotion();
  const hasMeeting = Boolean(meeting?.date);

  if (!hasMeeting) {
    return (
      <HomeCard className="home-meeting-card">
        <header className="home-card-head">
          <h2 className="home-card-title">Upcoming Meeting</h2>
          <p className="home-card-subtitle">Live session with your pod</p>
        </header>
        <div className="home-empty-state">
          <span className="home-empty-icon" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
          <p className="home-empty-title">Schedule your next session</p>
          <p className="home-empty-copy">Your pod lead will set up the next live build review.</p>
          <a href="#" className="home-cta-btn home-cta-btn--secondary">
            Request a session
          </a>
        </div>
      </HomeCard>
    );
  }

  const meetingDate = formatMeetingDate(meeting.date);
  const meetingTime = formatMeetingTime(meeting.date);

  return (
    <HomeCard className="home-meeting-card">
      <header className="home-card-head">
        <h2 className="home-card-title">Upcoming Meeting</h2>
        <p className="home-card-subtitle">Live session with your pod</p>
      </header>

      <div className="home-meeting-body">
        <div className="home-meeting-datetime">
          <motion.span
            className="home-meeting-date"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {meetingDate}
          </motion.span>
          <motion.span
            className="home-meeting-time"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {meetingTime}
            <span className="home-meeting-duration"> · {meeting.durationMinutes} min</span>
          </motion.span>
        </div>

        <p className="home-meeting-title">{meeting.title}</p>

        <motion.a
          href={meeting.joinUrl || '#'}
          className="home-cta-btn home-cta-btn--primary home-join-btn"
          target="_blank"
          rel="noreferrer"
          whileHover={reduceMotion ? undefined : { scale: 1.02, y: -1 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          Join Meeting
        </motion.a>
      </div>
    </HomeCard>
  );
}
