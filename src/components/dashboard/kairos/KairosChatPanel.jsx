import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { QUICK_PROMPTS } from '../../../lib/kairosData.js';
import KairosEmptyState from './KairosEmptyState.jsx';

const KAIROS_AVATAR = '/kairos-noted.png';
const KAIROS_TYPING_AVATAR = '/kairos-focus.png';

/**
 * Format markdown-like text to React elements:
 * Handles **bold**, *italic*, `code`, and newlines / bullet points
 */
function FormattedMessage({ text }) {
  const lines = text.split('\n');

  return (
    <div className="kairos-msg-text">
      {lines.map((line, lineIdx) => {
        if (line.startsWith('### ')) {
          return (
            <div
              key={lineIdx}
              style={{ fontWeight: 800, margin: '6px 0 4px', fontSize: '0.98rem' }}
            >
              {line.slice(4)}
            </div>
          );
        }

        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
        const content = isBullet ? line.trim().slice(2) : line;

        const parts = [];
        const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
          if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
          }
          const raw = match[0];
          if (raw.startsWith('**') && raw.endsWith('**')) {
            parts.push(<strong key={match.index}>{raw.slice(2, -2)}</strong>);
          } else if (raw.startsWith('`') && raw.endsWith('`')) {
            parts.push(<code key={match.index}>{raw.slice(1, -1)}</code>);
          } else if (raw.startsWith('*') && raw.endsWith('*')) {
            parts.push(<em key={match.index}>{raw.slice(1, -1)}</em>);
          }
          lastIndex = regex.lastIndex;
        }
        if (lastIndex < content.length) {
          parts.push(content.substring(lastIndex));
        }

        if (isBullet) {
          return (
            <div key={lineIdx} style={{ display: 'flex', gap: '6px', margin: '2px 0' }}>
              <span style={{ color: 'var(--dash-sage)', fontWeight: 700 }}>•</span>
              <div>{parts.length > 0 ? parts : content}</div>
            </div>
          );
        }

        return (
          <div key={lineIdx} style={{ minHeight: content ? undefined : '0.5em' }}>
            {parts.length > 0 ? parts : content}
          </div>
        );
      })}
    </div>
  );
}

function ChatMessage({ msg, index, isNew, reduceMotion }) {
  const isKairos = msg.sender === 'kairos';
  const entranceDelay = isNew
    ? 0
    : reduceMotion
      ? 0
      : Math.min(index * 0.045, 0.28);

  return (
    <motion.div
      className={`kairos-msg-row ${
        isKairos ? 'kairos-msg-row--kairos' : 'kairos-msg-row--user'
      }`}
      layout={!reduceMotion}
      initial={
        reduceMotion
          ? false
          : isKairos
            ? { opacity: 0, y: 14, scale: 0.97 }
            : { opacity: 0, y: 10, scale: 0.94 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: isKairos ? 0.38 : 0.28,
        delay: entranceDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {isKairos && (
        <div className="kairos-msg-avatar">
          <img src={KAIROS_AVATAR} alt="" aria-hidden="true" />
        </div>
      )}

      <motion.div
        className="kairos-msg-bubble"
        whileHover={reduceMotion ? undefined : { y: -1 }}
        transition={{ duration: 0.18 }}
      >
        <FormattedMessage text={msg.text} />

        {msg.cardType === 'task-assigned' && msg.cardData && (
          <div className="kairos-chat-embedded-card">
            <span className="kairos-embedded-card-text">
              ⚡ Added to Today&apos;s Focus: {msg.cardData.title}
            </span>
            <span className="kairos-embedded-card-badge">
              {msg.cardData.focusMinutes}M FOCUS
            </span>
          </div>
        )}

        <div className="kairos-msg-meta">{msg.timestamp || 'Just now'}</div>
      </motion.div>
    </motion.div>
  );
}

export default function KairosChatPanel({
  messages = [],
  isThinking = false,
  onSendMessage,
}) {
  const reduceMotion = useReducedMotion();
  const streamContainerRef = useRef(null);
  const inputRef = useRef(null);
  const prevCountRef = useRef(messages.length);
  const [inputValue, setInputValue] = useState('');
  const [knownIds, setKnownIds] = useState(() => new Set(messages.map((m) => m.id)));

  const hasUserMessages = messages.some((m) => m.sender === 'user');
  const showEmpty = !hasUserMessages;

  useLayoutEffect(() => {
    const el = streamContainerRef.current;
    if (!el) return;

    const behavior = reduceMotion ? 'auto' : 'smooth';
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const shouldStick = distanceFromBottom < 120 || messages.length > prevCountRef.current;

    if (shouldStick) {
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior });
      });
    }
    prevCountRef.current = messages.length;
  }, [messages, isThinking, reduceMotion]);

  useEffect(() => {
    setKnownIds((prev) => {
      const next = new Set(prev);
      messages.forEach((m) => next.add(m.id));
      return next;
    });
  }, [messages]);

  useEffect(() => {
    const field = inputRef.current;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${Math.min(field.scrollHeight, 128)}px`;
  }, [inputValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) return;
    onSendMessage(trimmed);
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleChipClick = (query) => {
    if (isThinking) return;
    onSendMessage(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="kairos-chat-card">
      {!showEmpty && (
        <div className="kairos-presence-corner" aria-hidden="true">
          <img src={KAIROS_AVATAR} alt="" />
        </div>
      )}

      <div ref={streamContainerRef} className="kairos-chat-stream">
        {showEmpty ? (
          <KairosEmptyState onStartChat={handleChipClick} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id}
                msg={msg}
                index={index}
                isNew={!knownIds.has(msg.id)}
                reduceMotion={reduceMotion}
              />
            ))}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {isThinking && (
            <motion.div
              className="kairos-typing-row"
              initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="kairos-msg-avatar">
                <img src={KAIROS_TYPING_AVATAR} alt="" aria-hidden="true" />
              </div>
              <div className="kairos-typing-bubble" aria-live="polite" aria-label="Kairos is thinking">
                <span className="kairos-dot" />
                <span className="kairos-dot" />
                <span className="kairos-dot" />
                <span className="kairos-typing-label">Kairos is thinking…</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="kairos-quick-chips" role="group" aria-label="Suggested quick replies">
        {QUICK_PROMPTS.map((prompt, index) => (
          <motion.button
            key={prompt.label}
            type="button"
            className="kairos-chip-btn"
            onClick={() => handleChipClick(prompt.query)}
            disabled={isThinking}
            initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.28,
              delay: reduceMotion ? 0 : 0.05 + index * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={
              reduceMotion || isThinking
                ? undefined
                : { scale: 1.04, y: -1 }
            }
            whileTap={reduceMotion || isThinking ? undefined : { scale: 0.96 }}
          >
            {prompt.label}
          </motion.button>
        ))}
      </div>

      <div className="kairos-chat-input-bar">
        <form className="kairos-input-form" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="kairos-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Kairos anything… or tell me what's blocking you"
            disabled={isThinking}
            maxLength={500}
            rows={1}
            aria-label="Message to Kairos"
          />
          <motion.button
            type="submit"
            className="kairos-send-btn"
            disabled={!inputValue.trim() || isThinking}
            aria-label="Send message"
            whileHover={
              reduceMotion || !inputValue.trim() || isThinking
                ? undefined
                : { scale: 1.05, y: -1 }
            }
            whileTap={
              reduceMotion || !inputValue.trim() || isThinking
                ? undefined
                : { scale: 0.92 }
            }
            transition={{ type: 'spring', stiffness: 520, damping: 28 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </motion.button>
        </form>
      </div>
    </div>
  );
}
