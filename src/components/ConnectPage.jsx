import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import KairosMascot from './KairosMascot.jsx';

const KAIROS_MESSAGES = [
  "You're in. I felt your signal the moment you crossed the gate.",
  'The finest builders in the world are already inside. Let me introduce you.',
  'Your pod is live. One step left — then we build in public together.',
];

const PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 17) % 84)}%`,
  top: `${6 + ((index * 23) % 88)}%`,
  size: 2 + (index % 3),
  delay: index * 0.22,
  duration: 4.2 + (index % 5) * 0.6,
}));

const panelTransition = {
  duration: 0.72,
  ease: [0.16, 1, 0.3, 1],
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.35 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: panelTransition,
  },
};

export default function ConnectPage() {
  const navigate = useNavigate();

  const enterDashboard = () => navigate('/dashboard');

  return (
    <main className="connect-page dashboard-entry" aria-labelledby="connect-title">
      <div className="connect-ambient connect-ambient-one" aria-hidden="true" />
      <div className="connect-ambient connect-ambient-two" aria-hidden="true" />
      <div className="connect-grid-overlay" aria-hidden="true" />

      <div className="connect-particles" aria-hidden="true">
        {PARTICLES.map((particle) => (
          <motion.span
            key={particle.id}
            className="connect-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.85, 0.35, 0.9, 0],
              scale: [0.4, 1, 0.7, 1.1, 0.5],
              y: [0, -18, -8, -24, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="dashboard-entry-ring connect-ring connect-ring-outer"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.72, rotate: -18 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ ...panelTransition, delay: 0.1 }}
      />
      <motion.div
        className="connect-ring connect-ring-inner"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{
          opacity: { duration: 0.8, delay: 0.2 },
          scale: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
          rotate: { duration: 28, repeat: Infinity, ease: 'linear', delay: 0.8 },
        }}
      />

      <motion.div
        className="connect-kairos-stage"
        initial={{ opacity: 0, y: 40, scale: 0.86 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...panelTransition, delay: 0.18, type: 'spring', bounce: 0.34 }}
      >
        <KairosMascot
          messages={KAIROS_MESSAGES}
          wrapperClassName="connect-kairos-wrapper"
          tone="dark"
          cycleMessages
          cyclePoses
          bubbleDelay={650}
        />
      </motion.div>

      <motion.div
        className="dashboard-entry-copy connect-copy"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={fadeUp}>Guild link established</motion.span>
        <motion.h1 id="connect-title" variants={fadeUp}>
          Ready to dive in?
        </motion.h1>
        <motion.p className="connect-subcopy" variants={fadeUp}>
          Kairos has your command room staged. The builders who move the world are one click away.
        </motion.p>
        <motion.div variants={fadeUp}>
          <motion.button
            type="button"
            className="connect-cta"
            onClick={enterDashboard}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.96, y: 2 }}
            initial={{ boxShadow: '0 16px 0 rgba(0,0,0,0.34), 0 0 0 rgba(0,229,255,0)' }}
            animate={{
              boxShadow: [
                '0 16px 0 rgba(0,0,0,0.34), 0 0 32px rgba(0,229,255,0.2)',
                '0 16px 0 rgba(0,0,0,0.34), 0 0 52px rgba(0,229,255,0.42)',
                '0 16px 0 rgba(0,0,0,0.34), 0 0 32px rgba(0,229,255,0.2)',
              ],
            }}
            transition={{
              boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            Dive In <span aria-hidden="true">→</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </main>
  );
}
