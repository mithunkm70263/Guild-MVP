import { motion, useReducedMotion } from 'framer-motion';
import { cardHover, fadeUp } from './motionVariants.js';

export default function HomeCard({
  children,
  className = '',
  variant = 'default',
  hoverable = true,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const variantClass = variant !== 'default' ? ` home-card--${variant}` : '';

  return (
    <motion.article
      className={`home-card${variantClass}${className ? ` ${className}` : ''}`}
      variants={hoverable && !reduceMotion ? { ...fadeUp, ...cardHover } : fadeUp}
      initial={reduceMotion || !hoverable ? false : 'rest'}
      whileHover={reduceMotion || !hoverable ? undefined : 'hover'}
      animate={hoverable && !reduceMotion ? 'rest' : undefined}
      {...props}
    >
      {children}
    </motion.article>
  );
}
