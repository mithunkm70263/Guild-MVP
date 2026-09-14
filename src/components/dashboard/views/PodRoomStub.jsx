import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../home/motionVariants.js';

export default function PodRoomStub() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="dashboard-pod-stub"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeUp}
    >
      <span className="profile-kicker">Coming soon</span>
      <h1 className="profile-title">Pod Room</h1>
      <p className="profile-subtitle">
        Your trio&apos;s live builder room is on the way. Check back after your next pod sync.
      </p>
      <Link to="/dashboard/profile" className="profile-pod-link">
        Back to profile
      </Link>
    </motion.section>
  );
}
