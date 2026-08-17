import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import KairosMascot from './KairosMascot.jsx';

/* ── Icons ── */
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="2" y="4" width="20" height="16" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect width="18" height="11" x="3" y="11" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GuildLoginMark() {
  return (
    <span className="login-logo-mark-brutal">
      <img src="/guild-logo.png" alt="" />
    </span>
  );
}

/* ── Main Login Page ── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const enterConnect = () => navigate('/connect');

  return (
    <div className="login-page-brutal">
      <div className="login-ambient login-ambient-top" aria-hidden="true" />
      <div className="login-ambient login-ambient-bottom" aria-hidden="true" />
      <div className="login-container-brutal">
        {/* Logo */}
        <motion.div
          className="login-logo-brutal"
          initial={{ opacity: 0, y: -40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        >
          <Link to="/" className="login-logo-link-brutal">
            <GuildLoginMark />
            <span>Guild</span>
          </Link>
        </motion.div>

        {/* Kairos Mascot */}
        <KairosMascot />

        {/* Headline */}
        <motion.div
          className="login-headline-brutal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1>I'll connect you with the finest people in the world</h1>
          <p>Welcome back to the Guild command room.</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="login-card-brutal"
          initial={{ opacity: 0, y: 60, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.3, type: 'spring', bounce: 0.3 }}
        >
          <div className="login-card-kicker-brutal">Member access</div>
          <div className="login-card-title-brutal">
            <h2>Enter the Guild</h2>
            <p>Kairos is standing by.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enterConnect();
            }}
            className="login-form-brutal"
          >
            {/* Email */}
            <div className={`login-field-brutal ${focusedField === 'email' ? 'focused' : ''}`}>
              <label htmlFor="email">Email</label>
              <div className="login-input-wrapper-brutal">
                <span className="login-input-icon-brutal"><MailIcon /></span>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className={`login-field-brutal ${focusedField === 'password' ? 'focused' : ''}`}>
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper-brutal">
                <span className="login-input-icon-brutal"><LockIcon /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn-brutal"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="login-submit-btn-brutal"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>

            {/* Divider */}
            <div className="login-divider-brutal">
              <span>OR</span>
            </div>

            {/* Google Sign-In */}
            <motion.button
              type="button"
              className="login-google-btn-brutal"
              onClick={enterConnect}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </motion.button>

            {/* Forgot password */}
            <a
              href="#"
              className="login-forgot-brutal"
            >
              Forgot password?
            </a>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
