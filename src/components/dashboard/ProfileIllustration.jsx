import { motion, useReducedMotion } from 'framer-motion';

export default function ProfileIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="profile-illustration"
      aria-hidden="true"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
    >
      <motion.svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="profile-illustration-svg"
        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="profile-bg-grad" x1="0" y1="0" x2="320" y2="280" gradientUnits="userSpaceOnUse">
            <stop stopColor="#eef6f2" />
            <stop offset="1" stopColor="#faf7f0" />
          </linearGradient>
          <linearGradient id="profile-sage-grad" x1="120" y1="60" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5a9484" />
            <stop offset="1" stopColor="#4a7c6e" />
          </linearGradient>
          <linearGradient id="profile-gold-grad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f6c96a" />
            <stop offset="1" stopColor="#f6b13b" />
          </linearGradient>
        </defs>

        <rect width="320" height="280" rx="28" fill="url(#profile-bg-grad)" />

        <circle cx="52" cy="48" r="18" fill="rgba(246, 177, 59, 0.18)" />
        <circle cx="268" cy="56" r="12" fill="rgba(74, 124, 110, 0.14)" />
        <circle cx="280" cy="220" r="22" fill="rgba(246, 177, 59, 0.12)" />

        <path
          d="M40 210c20-18 48-28 80-28s60 10 80 28"
          stroke="rgba(74, 124, 110, 0.2)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <ellipse cx="160" cy="228" rx="88" ry="14" fill="rgba(74, 124, 110, 0.08)" />

        <path
          d="M118 198c8-42 36-62 42-62s34 20 42 62"
          fill="url(#profile-sage-grad)"
        />
        <circle cx="160" cy="108" r="38" fill="url(#profile-sage-grad)" />
        <circle cx="160" cy="108" r="34" fill="#5f9a8a" />
        <ellipse cx="160" cy="118" rx="22" ry="18" fill="#f4dcc8" />
        <path
          d="M138 104c6-10 18-14 22-14s16 4 22 14"
          stroke="#3d6b5f"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="148" cy="116" r="3" fill="#2b2620" />
        <circle cx="172" cy="116" r="3" fill="#2b2620" />
        <path d="M154 128c4 4 12 4 16 0" stroke="#c98b72" strokeWidth="2" strokeLinecap="round" />

        <rect x="96" y="168" width="128" height="56" rx="20" fill="url(#profile-sage-grad)" />
        <rect x="108" y="180" width="40" height="6" rx="3" fill="rgba(255,255,255,0.35)" />
        <rect x="108" y="194" width="64" height="6" rx="3" fill="rgba(255,255,255,0.22)" />

        <g transform="translate(228, 148)">
          <rect x="0" y="12" width="44" height="52" rx="8" fill="#fff" stroke="rgba(74,124,110,0.25)" strokeWidth="2" />
          <rect x="8" y="22" width="28" height="4" rx="2" fill="rgba(74,124,110,0.3)" />
          <rect x="8" y="32" width="20" height="4" rx="2" fill="rgba(246,177,59,0.5)" />
          <rect x="8" y="42" width="24" height="4" rx="2" fill="rgba(74,124,110,0.2)" />
          <circle cx="36" cy="8" r="8" fill="url(#profile-gold-grad)" />
        </g>

        <g transform="translate(48, 156)">
          <path
            d="M8 36c0-14 10-24 22-24s22 10 22 24"
            fill="rgba(74,124,110,0.15)"
          />
          <path
            d="M14 20c4-8 12-12 16-12s12 4 16 12"
            stroke="#4a7c6e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path d="M30 8v8M22 12l8-4 8 4" stroke="#f6b13b" strokeWidth="2" strokeLinecap="round" />
        </g>

        <motion.circle
          cx="248"
          cy="88"
          r="6"
          fill="#f6b13b"
          animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx="72"
          cy="96"
          r="4"
          fill="#4a7c6e"
          animate={reduceMotion ? undefined : { opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
      </motion.svg>
    </motion.div>
  );
}
