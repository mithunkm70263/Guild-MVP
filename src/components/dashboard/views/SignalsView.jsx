import { motion } from 'framer-motion';
import { SIGNALS } from '../data.js';

const accentMap = {
  green: '#47f58b',
  cyan: '#69efff',
  gold: '#f6b13b',
  purple: '#b794ff',
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, x: -24, filter: 'blur(6px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
};

export default function SignalsView() {
  return (
    <div className="dash-view dash-signals">
      <motion.header
        className="dash-signals-head"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <span className="dash-kicker">Live signals</span>
          <h2>Everything moving in your orbit</h2>
        </div>
        <div className="dash-signal-stats">
          {[
            { label: 'Active', value: '5' },
            { label: 'Unread', value: '2' },
            { label: 'Wins', value: '12' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="dash-signal-stat"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.header>

      <motion.div className="dash-signals-layout" variants={stagger} initial="hidden" animate="show">
        <motion.section className="dash-panel dash-signals-feed" variants={item}>
          {SIGNALS.map((signal, index) => (
            <motion.article
              key={signal.id}
              className="dash-signal-card"
              variants={item}
              whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.07)' }}
              style={{ '--signal-accent': accentMap[signal.accent] }}
            >
              <span className="dash-signal-type">{signal.type}</span>
              <h3>{signal.title}</h3>
              <p>{signal.body}</p>
              <time>{signal.time}</time>
              <motion.span
                className="dash-signal-glow"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.2 }}
                aria-hidden="true"
              />
            </motion.article>
          ))}
        </motion.section>

        <motion.aside className="dash-signals-side" variants={item}>
          <div className="dash-panel dash-trend-card">
            <span className="dash-kicker">Momentum trend</span>
            <h3>Last 7 days</h3>
            <div className="dash-trend-bars" aria-hidden="true">
              {[42, 68, 55, 82, 74, 91, 86].map((height, index) => (
                <motion.div
                  key={height}
                  className="dash-trend-bar"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: height / 100 }}
                  transition={{ delay: 0.4 + index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <p>Your signal is trending up. Three-day streak intact.</p>
          </div>

          <div className="dash-panel dash-priority-card">
            <span className="dash-kicker">Top priority</span>
            <h3>Ship auth polish</h3>
            <p>Unlocks review from Anika and keeps Friday demo on track.</p>
            <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              Start focus block
            </motion.button>
          </div>
        </motion.aside>
      </motion.div>
    </div>
  );
}
