import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Avatar from './Avatar.jsx';
import { NAV_ITEMS, USER } from './data.js';
const iconPaths = { command: <><path d="M4 5.5h16v13H4z" /><path d="M8 10h8M8 14h5" /></>, kairos: <><path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" /><path d="m18.5 16 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" /></>, chat: <><path d="M4 5h16v11H9l-5 4v-4.5z" /><path d="M8 10h8M8 13h5" /></>, pod: <><circle cx="12" cy="7" r="2.5" /><circle cx="6.5" cy="16.5" r="2" /><circle cx="17.5" cy="16.5" r="2" /><path d="m10.5 9-3 5M13.5 9l3 5M8.5 17h7" /></>, missions: <><rect x="5" y="4" width="14" height="16" rx="1.5" /><path d="m8 10 1.5 1.5L12 8.5M8 15l1.5 1.5L12 13.5M14 10h2M14 15h2" /></>, profile: <><circle cx="12" cy="8" r="3" /><path d="M5.5 20c.7-3.3 3.1-5 6.5-5s5.8 1.7 6.5 5" /></> };
export default function DashboardSidebar({ activeNav, onNavChange }) {
  return <aside className="dash-sidebar">
    <Link to="/" className="dash-brand" aria-label="Guild home"><span><img src="/guild-logo.png" alt="" /></span><strong>guild</strong><em>workspace</em></Link>
    <button className="dash-user-card" onClick={() => onNavChange('profile')} type="button">
      <Avatar initials={USER.initials} color="clay" size="lg" status="focus" />
      <span><small>Today’s maker</small><strong>{USER.name.split(' ')[0]}</strong><em>{USER.track}</em></span>
      <b title={`${USER.streak} day streak`}>✦ {USER.streak}</b>
    </button>
    <p className="dash-sidebar-label">Your space</p>
    <nav className="dash-nav" aria-label="Dashboard navigation">
      {NAV_ITEMS.map((item) => {
        const active = activeNav === item.id;
        return <motion.button key={item.id} type="button" onClick={() => onNavChange(item.id)} className={active ? 'active' : ''} whileTap={{ scale: 0.975 }} whileHover={{ x: 2 }}>
          {active && <motion.i className="dash-nav-active-surface" layoutId="active-dashboard-nav" transition={{ type: 'spring', stiffness: 460, damping: 34 }} />}
          <svg viewBox="0 0 24 24" aria-hidden="true">{iconPaths[item.icon]}</svg><span>{item.label}</span>
          {item.count ? <b className="dash-nav-count">{item.count}</b> : <em>{item.hint}</em>}
          {item.signal && <i className="dash-kairos-nav-dot" />}
        </motion.button>;
      })}
    </nav>
    <section className="dash-side-ritual"><span><i /> Next pod session</span><strong>Today, 6:30 PM</strong><p>Bring one small thing you moved.</p><div><span>03h</span><i /><span>18m</span></div></section>
  </aside>;
}
