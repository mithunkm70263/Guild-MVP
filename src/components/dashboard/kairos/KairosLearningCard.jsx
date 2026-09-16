import { motion, useReducedMotion } from 'framer-motion';
import { RECOMMENDED_LEARNING } from '../../../lib/kairosData.js';

export default function KairosLearningCard({ onSelectLearning }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="kairos-learning-card">
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
              delay: reduceMotion ? 0 : 0.1 + index * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
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
    </div>
  );
}
