import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import KairosMascot from './KairosMascot.jsx';
import '../styles/login.css';

/* Ambient Sparkles */
const SPARKLE_CHARS = ['✦', '✧', '★', '⋆', '✶', '·'];

function FloatingSparkles({ count = 16 }) {
  const [sparkles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      char: SPARKLE_CHARS[i % SPARKLE_CHARS.length],
      x: 5 + ((i * 19) % 90),
      y: 8 + ((i * 23) % 84),
      size: 9 + (i % 4) * 3,
      delay: (i * 0.35) % 3,
      dur: 3.5 + (i % 3) * 1.5,
      opacity: 0.18 + (i % 3) * 0.12,
    }))
  );

  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="login-sparkles-layer" aria-hidden="true">
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="login-sparkle-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, s.opacity, 0],
            scale: [0, 1.25, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {s.char}
        </motion.span>
      ))}
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 8 6.9 4.4a2 2 0 0 0 2.2 0L20 8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="16" height="10" x="4" y="11" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

const KAIROS_MESSAGES = [
  "Hey! I'm Kairos. Your gateway is open.",
  'Find your pod. Build in public.',
  'The finest builders are already inside.',
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const enterConnect = () => navigate('/connect');

  return (
    <div className="login-page">
      <FloatingSparkles count={18} />
      <div className="login-paper-noise" aria-hidden="true" />
      <div className="login-ambient login-ambient-one" aria-hidden="true" />
      <div className="login-ambient login-ambient-two" aria-hidden="true" />

      {/* Top Header */}
      <motion.header
        className="login-header"
        initial={reduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className="login-brand" aria-label="Guild home">
          <span className="login-brand-mark">
            <img src="/guild-logo.png" alt="" />
          </span>
          <span>Guild</span>
        </Link>

        <div className="login-header-actions">
          <span className="login-header-chip">
            <span className="login-pulse-dot" />
            Member Gate
          </span>
          <Link to="/" className="login-back-link">
            ← Home
          </Link>
        </div>
      </motion.header>

      {/* Main Split Stage */}
      <main className="login-shell">
        <div className="login-stage">
          {/* Left: Welcoming Hero & Kairos */}
          <motion.div
            className="login-hero-col"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
            }}
          >
            <motion.div className="login-eyebrow-pill" variants={fadeUp}>
              <span className="login-pulse-dot" />
              <span>KAIROS IS AT THE DOOR</span>
            </motion.div>

            <motion.h1 className="login-hero-title" variants={fadeUp}>
              I’ll connect you with the <em>finest people</em> in the world
            </motion.h1>

            <motion.p className="login-hero-desc" variants={fadeUp}>
              Welcome back to the Guild. Your 3/5 person pod is waiting on the other side.
            </motion.p>

            {/* Mascot Centerpiece */}
            <motion.div
              className="login-kairos-frame"
              variants={fadeUp}
              transition={{ delay: 0.15 }}
            >
              <KairosMascot
                tone="light"
                messages={KAIROS_MESSAGES}
                wrapperClassName="kairos-wrapper-login"
                poses={
                  focusedField === 'password'
                    ? [{ src: '/kairos-focus.png', label: 'Kairos focusing' }]
                    : [
                        { src: '/kairos.png', label: 'Kairos greeting you' },
                        { src: '/kairos-cheer.png', label: 'Kairos cheering you on' },
                      ]
                }
                cycleMessages
                cyclePoses={focusedField !== 'password'}
                cycleInterval={4000}
                bubbleDelay={350}
              />
            </motion.div>

            {/* Pod Reassurance Pill */}
            <motion.div className="login-pod-strip" variants={fadeUp}>
              <span>✦ 3 Builders per Pod</span>
              <span className="login-strip-dot" />
              <span>5 Learners per Pod</span>
              <span className="login-strip-dot" />
              <span>Sunday Ship Ritual</span>
              <span className="login-strip-dot" />
              <span>Zero Excuses</span>
            </motion.div>
          </motion.div>

          {/* Right: Member Access Card */}
          <motion.div
            className="login-card-col"
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="login-card-brutal">
              <div className="login-card-top-bar">
                <span className="login-card-kicker">✦ MEMBER ACCESS</span>
              </div>

              <div className="login-card-title-wrap">
                <h2>Enter the Guild</h2>
                <p>Kairos is standing by with your pass.</p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  enterConnect();
                }}
                className="login-form-brutal"
              >
                {/* Email Field */}
                <div className={`login-field-brutal ${focusedField === 'email' ? 'is-focused' : ''}`}>
                  <label htmlFor="email">Email Address</label>
                  <div className="login-page-input-wrap">
                    <span className="login-page-input-icon" aria-hidden="true"><MailIcon /></span>
                    <input
                      className="login-page-input-field"
                      id="email"
                      type="email"
                      placeholder="you@guild.build"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className={`login-field-brutal ${focusedField === 'password' ? 'is-focused' : ''}`}>
                  <div className="login-label-row">
                    <label htmlFor="password">Password</label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your email.'); }} className="login-forgot-link">
                      Forgot password?
                    </a>
                  </div>
                  <div className="login-page-input-wrap">
                    <span className="login-page-input-icon" aria-hidden="true"><LockIcon /></span>
                    <input
                      className="login-page-input-field"
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your secret pass"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="login-page-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="login-submit-btn"
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98, y: 1 }}
                >
                  <span>Login to Guild →</span>
                </motion.button>

                {/* Divider */}
                <div className="login-divider-wrap">
                  <div className="login-divider-line" />
                  <span className="login-divider-text">OR CONTINUE WITH</span>
                  <div className="login-divider-line" />
                </div>

                {/* Google Sign-in */}
                <motion.button
                  type="button"
                  className="login-google-btn"
                  onClick={enterConnect}
                  whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98, y: 1 }}
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </motion.button>

                {/* Bottom Helper */}
                <div className="login-card-foot">
                  <span>Don&apos;t have a pod yet?</span>
                  <Link to="/get-started" className="login-apply-link">
                    Apply to Join →
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
