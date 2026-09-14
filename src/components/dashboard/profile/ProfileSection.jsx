import { motion, useReducedMotion } from 'framer-motion';
import { cardHover, fadeUp } from '../home/motionVariants.js';

export default function ProfileSection({
  children,
  className = '',
  id,
  kicker,
  title,
  subtitle,
  hoverable = true,
  variant = 'default',
}) {
  const reduceMotion = useReducedMotion();
  const variantClass = variant !== 'default' ? ` profile-section--${variant}` : '';

  return (
    <motion.section
      id={id}
      className={`profile-section${variantClass}${className ? ` ${className}` : ''}`}
      variants={hoverable && !reduceMotion ? { ...fadeUp, ...cardHover } : fadeUp}
      initial={reduceMotion || !hoverable ? false : 'rest'}
      whileHover={reduceMotion || !hoverable ? undefined : 'hover'}
      animate={hoverable && !reduceMotion ? 'rest' : undefined}
    >
      {(kicker || title) && (
        <header className="profile-section-head">
          {kicker && <span className="profile-section-kicker">{kicker}</span>}
          {title && <h2 className="profile-section-title">{title}</h2>}
          {subtitle && <p className="profile-section-subtitle">{subtitle}</p>}
        </header>
      )}
      {children}
    </motion.section>
  );
}
