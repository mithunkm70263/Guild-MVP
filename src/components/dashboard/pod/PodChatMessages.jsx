import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CURRENT_USER,
  PINNED_MESSAGE,
  formatMessageTime,
  getAuthorById,
} from '../../../lib/podChatData.js';
import { staggerFeed } from '../home/motionVariants.js';

const messageVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
};

function MessageBubble({ message, reduceMotion }) {
  const author = getAuthorById(message.authorId);
  const isSelf = message.authorId === CURRENT_USER.id;

  return (
    <motion.article
      className={`pod-chat-message${isSelf ? ' is-self' : ''}`}
      variants={messageVariants}
      layout={!reduceMotion}
    >
      {!isSelf && (
        <span
          className="pod-chat-avatar pod-chat-avatar--xs"
          style={{ background: `linear-gradient(135deg, ${author.avatarColor}, ${author.avatarColor}cc)` }}
          aria-hidden="true"
        >
          {author.initials}
        </span>
      )}

      <div className="pod-chat-message-body">
        {!isSelf && (
          <span className="pod-chat-message-author">{author.name.split(' ')[0]}</span>
        )}
        <div className="pod-chat-bubble">
          <p>{message.text}</p>
        </div>
        <div className="pod-chat-message-meta">
          <time dateTime={message.timestamp}>{formatMessageTime(message.timestamp)}</time>
          {message.reactions?.length > 0 && (
            <div className="pod-chat-reactions" aria-label="Reactions">
              {message.reactions.map((reaction) => (
                <span key={reaction.emoji} className="pod-chat-reaction">
                  {reaction.emoji}
                  {reaction.count > 1 && <span className="pod-chat-reaction-count">{reaction.count}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function PodChatMessages({ messages, isTyping }) {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages.length, isTyping, reduceMotion]);

  return (
    <div className="pod-chat-messages-wrap" ref={scrollRef}>
      <motion.div
        className="pod-chat-pinned"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="pod-chat-pin-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 3H5a2 2 0 0 0-2 2v14l3-3h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
          </svg>
        </span>
        <p>{PINNED_MESSAGE}</p>
      </motion.div>

      <motion.div
        className="pod-chat-messages"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={staggerFeed}
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} reduceMotion={reduceMotion} />
        ))}

        {isTyping && (
          <motion.div
            className="pod-chat-typing"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-live="polite"
          >
            <span className="pod-chat-typing-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>Priya is typing…</span>
          </motion.div>
        )}

        <div ref={bottomRef} className="pod-chat-scroll-anchor" aria-hidden="true" />
      </motion.div>
    </div>
  );
}
