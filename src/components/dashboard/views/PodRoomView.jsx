import { motion } from 'framer-motion';
import Avatar from '../Avatar.jsx';
import { POD_MEMBERS } from '../data.js';
import { PlusIcon, SparkIcon } from '../icons.jsx';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function PodRoomView() {
  return (
    <div className="dash-view dash-pod">
      <motion.div variants={stagger} initial="hidden" animate="show" className="dash-pod-layout">
        <motion.section className="dash-panel dash-pod-hero" variants={item}>
          <span className="dash-kicker">Active pod</span>
          <h2>Builders in your orbit</h2>
          <p>Five minds. One sprint rhythm. Real accountability in every check-in.</p>

          <div className="dash-pod-orbit" aria-label="Pod members">
            <motion.div
              className="dash-pod-orbit-ring"
              animate={{ rotate: 360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            />
            {POD_MEMBERS.map((member, index) => {
              const angle = (index / POD_MEMBERS.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * 42;
              const y = Math.sin(angle) * 42;

              return (
                <motion.div
                  key={member.name}
                  className="dash-pod-orbit-node"
                  style={{ left: `calc(50% + ${x}%)`, top: `calc(50% + ${y}%)` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.08, type: 'spring', stiffness: 320 }}
                  whileHover={{ scale: 1.12, zIndex: 2 }}
                >
                  <Avatar name={member.name} size={64} online={member.online} />
                  <strong>{member.name}</strong>
                  <span>{member.skill}</span>
                </motion.div>
              );
            })}
            <div className="dash-pod-orbit-core">
              <span>Pod 07</span>
              <strong>Live</strong>
            </div>
          </div>
        </motion.section>

        <motion.section className="dash-pod-side" variants={item}>
          <div className="dash-panel dash-pod-sync">
            <span className="dash-kicker">Next ritual</span>
            <h3>Pod sync at 7:30 PM</h3>
            <p>Five minutes to share progress, blockers, and the one move that matters tomorrow.</p>
            <motion.div
              className="dash-sync-countdown"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span style={{ width: '68%' }} />
            </motion.div>
            <small>2h 39m until sync</small>
          </div>

          <div className="dash-panel dash-pod-roster">
            <div className="dash-panel-head compact">
              <h3>Member pulse</h3>
              <motion.button type="button" whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <PlusIcon />
                <span>Invite</span>
              </motion.button>
            </div>

            <div className="dash-pod-list">
              {POD_MEMBERS.map((member, index) => (
                <motion.article
                  key={member.name}
                  className="dash-pod-member"
                  variants={item}
                  whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <Avatar name={member.name} size={48} online={member.online} />
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.skill}</span>
                  </div>
                  <div className="dash-pod-member-meta">
                    <em>{member.status}</em>
                    <SparkIcon />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
