import { motion } from 'framer-motion';
import Avatar from '../Avatar.jsx';
import { ACHIEVEMENTS, ACTIVITY, USER } from '../data.js';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
};

export default function ProfileView() {
  return (
    <div className="dash-view dash-profile-view">
      <motion.section
        className="dash-profile-hero"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="dash-profile-hero-bg" aria-hidden="true" />
        <div className="dash-profile-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
          >
            <Avatar name={USER.name} size={96} online className="dash-profile-hero-avatar" />
          </motion.div>
          <div>
            <span className="dash-kicker">{USER.track}</span>
            <h2>{USER.name}</h2>
            <p>{USER.bio}</p>
            <div className="dash-profile-meta-row">
              <span>{USER.location}</span>
              <span>Joined {USER.joined}</span>
              <span className="dash-status-pill">{USER.status}</span>
            </div>
          </div>
          <div className="dash-profile-hero-actions">
            <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Edit profile
            </motion.button>
            <motion.button type="button" className="ghost" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Share card
            </motion.button>
          </div>
        </div>
      </motion.section>

      <motion.div className="dash-profile-grid" variants={stagger} initial="hidden" animate="show">
        <motion.section className="dash-panel dash-rank-card" variants={item}>
          <span className="dash-kicker">Current rank</span>
          <div className="dash-rank-row">
            <div>
              <h3>{USER.rank}</h3>
              <p>Level {USER.level} · {USER.progress}% to next rank</p>
            </div>
            <b>LVL {USER.level}</b>
          </div>
          <div className="dash-rank-meter" aria-label="Rank progress">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${USER.progress}%` }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.section>

        <motion.section className="dash-panel dash-stats-card" variants={item}>
          <span className="dash-kicker">Your stats</span>
          <div className="dash-stats-grid">
            {[
              { label: 'Sprints', value: USER.stats.sprints },
              { label: 'Tasks', value: USER.stats.tasks },
              { label: 'Allies', value: USER.stats.allies },
              { label: 'Streak', value: `${USER.stats.streak}d` },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="dash-stat-tile"
                whileHover={{ y: -5, scale: 1.03 }}
              >
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className="dash-panel dash-skills-card" variants={item}>
          <span className="dash-kicker">Skills</span>
          <div className="dash-skill-tags">
            {USER.skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.06 }}
                whileHover={{ scale: 1.08, y: -2 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.section>

        <motion.section className="dash-panel dash-achievements-card" variants={item}>
          <span className="dash-kicker">Achievements</span>
          <div className="dash-achievement-grid">
            {ACHIEVEMENTS.map((badge) => (
              <motion.div
                key={badge.id}
                className={`dash-achievement ${badge.unlocked ? 'unlocked' : 'locked'}`}
                whileHover={{ y: badge.unlocked ? -4 : 0, scale: badge.unlocked ? 1.04 : 1 }}
              >
                <span aria-hidden="true">{badge.icon}</span>
                <strong>{badge.label}</strong>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section className="dash-panel dash-activity-card" variants={item}>
          <span className="dash-kicker">Recent activity</span>
          <ul className="dash-activity-list">
            {ACTIVITY.map((entry, index) => (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.07 }}
              >
                <span aria-hidden="true" />
                <div>
                  <strong>{entry.action}</strong>
                  <time>{entry.time}</time>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </motion.div>
    </div>
  );
}
