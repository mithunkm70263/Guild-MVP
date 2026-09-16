import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MENU_LINKS = [
  { href: '#how-guild-works', label: 'See How Guild Works', className: 'header-menu-link header-menu-link--how' },
  { href: '#faq', label: 'FAQ', className: 'header-menu-link header-menu-link--faq' },
  { to: '/login', label: 'Log In', className: 'header-menu-link header-menu-link--login' },
  { href: '/get-started', label: 'Join the Guild', className: 'header-menu-link header-menu-link--join' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      className={`header${menuOpen ? ' is-menu-open' : ''}`}
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href="/" className="header-logo" aria-label="Guild home">
        <img
          src="/guild-logo.png"
          alt="Guild"
          className="header-logo-icon"
          width="72"
          height="72"
        />
        <span className="header-logo-text">Guild</span>
      </a>

      <nav className="header-nav" aria-label="Primary navigation">
        <motion.a
          href="#how-guild-works"
          className="btn-how"
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          SEE HOW GUILD WORKS
        </motion.a>
        <motion.a
          href="#faq"
          className="btn-faq"
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          FAQ
        </motion.a>
        <motion.div
          whileHover={{ y: -2, scale: 1.03, rotate: -0.5 }}
          whileTap={{ scale: 0.96 }}
          style={{ display: 'inline-flex' }}
        >
          <Link to="/login" className="btn-login">
            LOG IN
          </Link>
        </motion.div>
        <motion.a
          href="/get-started"
          className="btn-join"
          whileHover={{ y: -2, scale: 1.03, rotate: 0.5 }}
          whileTap={{ scale: 0.96 }}
        >
          JOIN THE GUILD
        </motion.a>
      </nav>

      <button
        type="button"
        className="header-menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="header-mobile-menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {menuOpen ? (
            <>
              <line x1="6" x2="18" y1="6" y2="18" />
              <line x1="6" x2="18" y1="18" y2="6" />
            </>
          ) : (
            <>
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </>
          )}
        </svg>
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="header-menu-scrim"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.nav
              id="header-mobile-menu"
              className="header-menu-drawer"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              {MENU_LINKS.map((item) => (
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={item.className}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className={item.className}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
