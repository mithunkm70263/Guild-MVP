import { motion, useReducedMotion } from 'framer-motion';
import { formatRelativeTime } from '../../../lib/profileData.js';
import { fadeUp, staggerFeed } from '../home/motionVariants.js';

function LinkPreviewCard({ preview }) {
  if (!preview) return null;

  return (
    <a
      href={preview.url}
      className="profile-feed-link-card"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="profile-feed-link-thumb" aria-hidden="true" />
      <div className="profile-feed-link-copy">
        <span className="profile-feed-link-title">{preview.title}</span>
        <span className="profile-feed-link-domain">{preview.domain}</span>
      </div>
    </a>
  );
}

export default function ProfileFeed({ extended }) {
  const reduceMotion = useReducedMotion();
  const { feed, identity, avatar } = extended;

  return (
    <section className="profile-feed" aria-label="Activity feed">
      <motion.ul
        className="profile-feed-list"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={staggerFeed}
      >
        {feed.map((item) => (
          <motion.li
            key={item.id}
            className="profile-feed-item"
            variants={fadeUp}
          >
            <div className="profile-feed-item-head">
              <img
                src={avatar.src}
                alt=""
                className="profile-feed-avatar"
              />
              <div className="profile-feed-item-meta">
                <span className="profile-feed-author">{identity.name}</span>
                <span className="profile-feed-time">{formatRelativeTime(item.timestamp)}</span>
              </div>
            </div>
            <p className="profile-feed-text">{item.text}</p>
            <LinkPreviewCard preview={item.linkPreview} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
