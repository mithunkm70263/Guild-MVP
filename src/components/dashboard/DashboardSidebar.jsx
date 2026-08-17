import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { NAV_ITEMS, PANEL_EASE, USER } from './data.js';
import { NavIcon } from './icons.jsx';

export default function DashboardSidebar({ activeNav, onNavChange }) {
  return (
    <motion.aside
      className="dash-sidebar"
      initial={{ opacity: 0, x: -36 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: PANEL_EASE }}
    >
      <Link to="/" className="dash-brand" aria-label="Guild home">
        <img
          src="/guild-logo.png"
          alt=""
          className="dash-guild-logo"
          width="44"
          height="44"
        />
        <span>Guild</span>
      </Link>

      <motion.button
        type="button"
        className="dash-profile-mini"
        onClick={() => onNavChange('profile')}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: PANEL_EASE }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Open profile"
      >
        <Avatar name={USER.name} size={56} online />
        <div>
          <p>{USER.track}</p>
          <h2>{USER.name}</h2>
          <span className="dash-status-pill">{USER.status}</span>
        </div>
        <div className="dash-profile-mini-rank">
          <small>{USER.rank}</small>
          <b>L{USER.level}</b>
        </div>
      </motion.button>

      <nav className="dash-nav" aria-label="Dashboard navigation">
        {NAV_ITEMS.map((item, index) => (
          <motion.button
            type="button"
            key={item.id}
            className={activeNav === item.id ? 'active' : ''}
            onClick={() => onNavChange(item.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.14 + index * 0.05, ease: PANEL_EASE }}
            whileHover={{ x: 8 }}
            whileTap={{ scale: 0.97 }}
          >
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
            {activeNav === item.id && (
              <motion.span
                className="dash-nav-indicator"
                layoutId="dash-nav-indicator"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      <motion.section
        className="dash-sidebar-card"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.42, ease: PANEL_EASE }}
      >
        <span>Next ritual</span>
        <strong>Pod sync at 7:30 PM</strong>
        <p>Five minutes to share progress, blockers, and the one move that matters tomorrow.</p>
      </motion.section>
    </motion.aside>
  );
}
