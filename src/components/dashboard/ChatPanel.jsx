import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Avatar from './Avatar.jsx';
import { SendIcon } from './icons.jsx';

export default function ChatPanel({
  title,
  subtitle,
  messages,
  message,
  onMessageChange,
  onSend,
  placeholder = 'Type a message...',
  live = false,
  typing = null,
  headerAvatar = null,
  className = '',
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages, typing]);

  return (
    <section className={`dash-panel dash-chat-panel ${className}`.trim()}>
      <header className="dash-panel-head">
        <div className="dash-chat-panel-title">
          {headerAvatar}
          <div>
            <span className="dash-kicker">{subtitle}</span>
            <h2>{title}</h2>
          </div>
        </div>
        {live && <div className="dash-live-pill">Live</div>}
      </header>

      <div className="dash-messages dash-chat-scroll" ref={scrollRef} aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((entry) => (
            <motion.div
              key={entry.id}
              className={`dash-chat-row ${entry.role}`}
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {entry.role === 'member' && entry.author && (
                <Avatar name={entry.author} size={36} online={entry.online} />
              )}
              {entry.role === 'kairos' && (
                <div className="dash-chat-kairos-avatar" aria-hidden="true">
                  <img src="/kairos.png" alt="" />
                </div>
              )}
              <div className="dash-chat-bubble-wrap">
                {entry.author && entry.role !== 'user' && (
                  <span className="dash-chat-author">{entry.author}</span>
                )}
                <p className={`dash-message ${entry.role}`}>{entry.text}</p>
                {entry.time && <time className="dash-chat-time">{entry.time}</time>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div
            className={`dash-chat-row ${typing === 'Kairos' ? 'kairos' : 'member'} typing`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {typing === 'Kairos' ? (
              <div className="dash-chat-kairos-avatar" aria-hidden="true">
                <img src="/kairos.png" alt="" />
              </div>
            ) : (
              <Avatar name={typing} size={36} online />
            )}
            <div className="dash-typing-indicator" aria-label={`${typing} is typing`}>
              <span /><span /><span />
            </div>
          </motion.div>
        )}
      </div>

      <form className="dash-chat-form" onSubmit={onSend}>
        <input
          type="text"
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder={placeholder}
          aria-label={`Message ${title}`}
        />
        <motion.button type="submit" whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.96 }}>
          <SendIcon />
          <span>Send</span>
        </motion.button>
      </form>
    </section>
  );
}
