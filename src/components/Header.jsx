import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <motion.header
      className="header"
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
          <Link
            to="/login"
            className="btn-login"
          >
            LOG IN
          </Link>
        </motion.div>
        <motion.a
          href="/apply"
          className="btn-join"
          whileHover={{ y: -2, scale: 1.03, rotate: 0.5 }}
          whileTap={{ scale: 0.96 }}
        >
          JOIN THE GUILD
        </motion.a>
      </nav>
    </motion.header>
  );
}
