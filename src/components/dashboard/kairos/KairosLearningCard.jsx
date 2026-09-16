import { motion, useReducedMotion } from 'framer-motion';
import { RECOMMENDED_LEARNING } from '../../../lib/kairosData.js';

export default function KairosLearningCard({ onSelectLearning }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="kairos-learning-card"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="kairos-learning-head">
        <h2 className="kairos-learning-title">Recommended Learning</h2>
      </div>

      <div className="kairos-learning-list">
        {RECOMMENDED_LEARNING.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            className="kairos-learn-item"
            onClick={() => onSelectLearning?.(item)}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: reduceMotion ? 0 : 0.2 + index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={
              reduceMotion
                ? undefined
                : { y: -3, scale: 1.01, transition: { duration: 0.2 } }
            }
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          >
            <div className="kairos-learn-item-top">
              <span className="kairos-learn-type">{item.type}</span>
              <span className="kairos-learn-duration">{item.duration}</span>
            </div>
            <h3 className="kairos-learn-headline">{item.title}</h3>
            <p className="kairos-learn-summary">{item.summary}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
