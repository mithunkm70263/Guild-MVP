import { motion, useReducedMotion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  {
    id: 'profile',
    label: 'Profile',
    to: '/dashboard/profile',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    id: 'home',
    label: 'Home',
    to: '/dashboard',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'focus',
    label: 'Focus',
    to: '/dashboard/focus',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
      </svg>
    ),
  },
  {
    id: 'pod',
    label: 'My Pod',
    to: '/dashboard/pod',
    end: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ collapsed, onToggle, onNavigate }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className={`dashboard-sidebar${collapsed ? ' is-collapsed' : ''}`}
      aria-label="Dashboard navigation"
      initial={reduceMotion ? false : { opacity: 0, x: -16 }}
      animate={{
        opacity: 1,
        x: 0,
        width: collapsed ? 'var(--dash-sidebar-collapsed)' : 'var(--dash-sidebar-width)',
      }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dashboard-sidebar-inner">
        <div className="dashboard-sidebar-brand">
          <NavLink to="/" className="dashboard-sidebar-logo" aria-label="Guild home">
            <img src="/guild-logo.png" alt="" />
            {!collapsed && <span>Guild</span>}
          </NavLink>
          <button
            type="button"
            className="dashboard-sidebar-toggle"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {collapsed ? (
                <path d="m9 18 6-6-6-6" />
              ) : (
                <path d="m15 18-6-6 6-6" />
              )}
            </svg>
          </button>
        </div>

        <nav className="dashboard-sidebar-nav">
          <p className="dashboard-sidebar-label" aria-hidden={collapsed}>
            {!collapsed && 'Navigate'}
          </p>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  data-label={item.label}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `dashboard-nav-link dashboard-nav-link--${item.id}${isActive ? ' is-active' : ''}`
                  }
                >
                  <span className="dashboard-nav-icon">{item.icon}</span>
                  {!collapsed && <span className="dashboard-nav-text">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="dashboard-sidebar-foot">
          {!collapsed && (
            <p className="dashboard-sidebar-footnote">
              More nav items coming soon
            </p>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
