import { motion, useReducedMotion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HomeView() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="dashboard-home"
      aria-labelledby="dashboard-home-title"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
      }}
    >
      <motion.div className="dashboard-home-glow" aria-hidden="true" variants={fadeUp} />
      <motion.span className="dashboard-home-kicker" variants={fadeUp}>
        Your command room
      </motion.span>
      <motion.h1 id="dashboard-home-title" className="dashboard-home-title" variants={fadeUp}>
        Home
      </motion.h1>
      <motion.p className="dashboard-home-subtitle" variants={fadeUp}>
        Welcome back. Your pod workspace is being staged — content lands here soon.
      </motion.p>
    </motion.section>
  );
}
