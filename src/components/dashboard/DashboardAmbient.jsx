import { motion } from 'framer-motion';

const PARTICLES = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${6 + ((index * 19) % 88)}%`,
  top: `${4 + ((index * 27) % 92)}%`,
  size: 2 + (index % 4),
  delay: index * 0.18,
  duration: 5 + (index % 6) * 0.7,
}));

export default function DashboardAmbient() {
  return (
    <div className="dash-ambient" aria-hidden="true">
      <div className="dash-ambient-glow dash-ambient-glow-one" />
      <div className="dash-ambient-glow dash-ambient-glow-two" />
      <div className="dash-ambient-glow dash-ambient-glow-three" />
      <div className="dash-grid-overlay" />

      <div className="dash-particles">
        {PARTICLES.map((particle) => (
          <motion.span
            key={particle.id}
            className="dash-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              opacity: [0, 0.9, 0.3, 0.85, 0],
              scale: [0.3, 1, 0.6, 1.15, 0.4],
              y: [0, -22, -10, -28, 0],
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
    </div>
  );
}
