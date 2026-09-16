import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const POSE_MAP = {
  idle: { src: '/kairos.png', label: 'Kairos greeting you' },
  cheer: { src: '/kairos-cheer.png', label: 'Kairos cheering you on' },
  focus: { src: '/kairos-focus.png', label: 'Kairos deep in thought' },
  noted: { src: '/kairos-noted.png', label: 'Kairos taking notes' },
};

const RANDOM_TIPS = [
  'Ready to ship today?',
  'Consistency beats intensity.',
  '25 minutes of deep focus incoming.',
  'I believe in your commit history.',
  'Small steps compound fast.',
];

export default function KairosMascotStage({ pose = 'idle', customMessage = null }) {
  const reduceMotion = useReducedMotion();
  const [tipIndex, setTipIndex] = useState(0);
  const [clickReaction, setClickReaction] = useState(false);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % RANDOM_TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  const currentPose = POSE_MAP[pose] || POSE_MAP.idle;
  const displaySpeech = customMessage || RANDOM_TIPS[tipIndex];

  const handleMascotClick = () => {
    setClickReaction(true);
    setTipIndex((prev) => (prev + 1) % RANDOM_TIPS.length);
    setTimeout(() => setClickReaction(false), 1200);
  };

  return (
    <div className="kairos-mascot-card">
      <div className="kairos-mascot-glow" aria-hidden="true" />

      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={displaySpeech}
          className="kairos-mascot-speech"
          initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p>{displaySpeech}</p>
          <div className="kairos-speech-tail" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      {/* Mascot Animated Figure */}
      <motion.div
        className="kairos-mascot-figure"
        onClick={handleMascotClick}
        title="Click to interact with Kairos"
        animate={
          reduceMotion
            ? {}
            : clickReaction
            ? { scale: [1, 1.12, 0.98, 1], rotate: [0, -4, 4, 0] }
            : {
                y: [0, -7, 0],
                rotate: [-0.6, 0.8, -0.6],
              }
        }
        transition={
          reduceMotion
            ? {}
            : clickReaction
            ? { duration: 0.6, ease: 'easeOut' }
            : {
                y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 5.4, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentPose.src}
            src={currentPose.src}
            alt={currentPose.label}
            className="kairos-mascot-img"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            draggable={false}
          />
        </AnimatePresence>
        <div className="kairos-mascot-pedestal" aria-hidden="true" />
      </motion.div>

      {/* Mascot Status Badge */}
      <div className="kairos-mascot-footer">
        <span className="kairos-mascot-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 5 5.6.8-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4 5.6-.8z" />
          </svg>
          Accountability Companion
        </span>
      </div>
    </div>
  );
}
