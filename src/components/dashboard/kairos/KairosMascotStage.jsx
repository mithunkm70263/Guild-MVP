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
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % RANDOM_TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [reduceMotion]);

  // Occasional blink / tilt accent on idle
  useEffect(() => {
    if (reduceMotion || pose !== 'idle') return undefined;
    const schedule = () => {
      const delay = 3200 + Math.random() * 4200;
      return setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 160);
      }, delay);
    };
    let timer = schedule();
    const loop = setInterval(() => {
      clearTimeout(timer);
      timer = schedule();
    }, 7000);
    return () => {
      clearTimeout(timer);
      clearInterval(loop);
    };
  }, [reduceMotion, pose]);

  const currentPose = POSE_MAP[pose] || POSE_MAP.idle;
  const displaySpeech = customMessage || RANDOM_TIPS[tipIndex];

  const handleMascotClick = () => {
    setClickReaction(true);
    setTipIndex((prev) => (prev + 1) % RANDOM_TIPS.length);
    setTimeout(() => setClickReaction(false), 1200);
  };

  return (
    <motion.div
      className="kairos-mascot-card"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="kairos-mascot-glow" aria-hidden="true" />

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

      <motion.div
        className="kairos-mascot-figure"
        onClick={handleMascotClick}
        title="Click to interact with Kairos"
        animate={
          reduceMotion
            ? {}
            : clickReaction
              ? { scale: [1, 1.12, 0.98, 1], rotate: [0, -4, 4, 0] }
              : blink
                ? { scaleY: [1, 0.88, 1], rotate: [0, 2.2, 0] }
                : {
                    y: [0, -6, 0],
                    scale: [1, 1.025, 1],
                    rotate: [-0.8, 0.9, -0.8],
                  }
        }
        transition={
          reduceMotion
            ? {}
            : clickReaction
              ? { duration: 0.6, ease: 'easeOut' }
              : blink
                ? { duration: 0.18, ease: 'easeInOut' }
                : {
                    y: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
                    scale: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 5.8, repeat: Infinity, ease: 'easeInOut' },
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

      <div className="kairos-mascot-footer">
        <span className="kairos-mascot-badge">
          <span className="kairos-mascot-ready-dot" aria-hidden="true" />
          Online &amp; Ready
        </span>
      </div>
    </motion.div>
  );
}
