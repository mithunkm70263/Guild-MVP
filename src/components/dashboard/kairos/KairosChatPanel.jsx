import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { QUICK_PROMPTS } from '../../../lib/kairosData.js';
import KairosEmptyState from './KairosEmptyState.jsx';

/**
 * Format markdown-like text to React elements:
 * Handles **bold**, *italic*, `code`, and newlines / bullet points
 */
function FormattedMessage({ text }) {
  const lines = text.split('\n');

  return (
    <div className="kairos-msg-text">
      {lines.map((line, lineIdx) => {
        // Handle markdown header
        if (line.startsWith('### ')) {
          return (
            <div key={lineIdx} style={{ fontWeight: 800, margin: '6px 0 4px', fontSize: '0.98rem' }}>
              {line.slice(4)}
            </div>
          );
        }

        // Handle bullet points
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
        const content = isBullet ? line.trim().slice(2) : line;

        // Parse inline bold and code
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

export default function KairosChatPanel({
  messages = [],
  isThinking = false,
  onSendMessage,
}) {
  const reduceMotion = useReducedMotion();
  const streamContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const scrollToBottom = () => {
    if (streamContainerRef.current) {
      streamContainerRef.current.scrollTop = streamContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) return;
    onSendMessage(trimmed);
    setInputValue('');
  };

  const handleChipClick = (query) => {
    if (isThinking) return;
    onSendMessage(query);
  };

  return (
    <div className="kairos-chat-card">
      {/* Top Bar of Chat */}
      <div className="kairos-chat-head">
        <div className="kairos-chat-persona">
          <div className="kairos-chat-avatar-thumb">
            <img src="/kairos.png" alt="Kairos" />
          </div>
          <div className="kairos-chat-name-wrap">
            <span className="kairos-chat-name">Kairos</span>
            <span className="kairos-chat-desc">AI Accountability Coach • Pod Guide</span>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div ref={streamContainerRef} className="kairos-chat-stream">
        {messages.length === 0 ? (
          <KairosEmptyState onStartChat={handleChipClick} />
        ) : (
          messages.map((msg, index) => {
            const isKairos = msg.sender === 'kairos';
            return (
              <motion.div
                key={msg.id}
                className={`kairos-msg-row ${
                  isKairos ? 'kairos-msg-row--kairos' : 'kairos-msg-row--user'
                }`}
                initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.32,
                  delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.2),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {isKairos && (
                  <div className="kairos-msg-avatar">
                    <img src="/kairos.png" alt="" aria-hidden="true" />
                  </div>
                )}

                <div className="kairos-msg-bubble">
                  <FormattedMessage text={msg.text} />

                  {/* Embedded interactive card if assigned */}
                  {msg.cardType === 'task-assigned' && msg.cardData && (
                    <div className="kairos-chat-embedded-card">
                      <span className="kairos-embedded-card-text">
                        ⚡ Added to Today's Focus: {msg.cardData.title}
                      </span>
                      <span className="kairos-embedded-card-badge">
                        {msg.cardData.focusMinutes}M FOCUS
                      </span>
                    </div>
                  )}

                  <div className="kairos-msg-meta">{msg.timestamp || 'Just now'}</div>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {isThinking && (
            <motion.div
              className="kairos-typing-row"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="kairos-msg-avatar">
                <img src="/kairos-focus.png" alt="" aria-hidden="true" />
              </div>
              <div className="kairos-typing-bubble">
                <span className="kairos-dot" />
                <span className="kairos-dot" />
                <span className="kairos-dot" />
                <span className="kairos-typing-label">Kairos is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested Quick Replies */}
      <div className="kairos-quick-chips" role="group" aria-label="Suggested quick replies">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            type="button"
            className="kairos-chip-btn"
            onClick={() => handleChipClick(prompt.query)}
            disabled={isThinking}
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="kairos-chat-input-bar">
        <form className="kairos-input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="kairos-input-field"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Kairos anything or share what's blocking you..."
            disabled={isThinking}
            maxLength={280}
            aria-label="Message to Kairos"
          />
          <button
            type="submit"
            className="kairos-send-btn"
            disabled={!inputValue.trim() || isThinking}
            aria-label="Send message"
          >
            <svg
              width="16"
              height="16"
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
          </button>
        </form>
      </div>
    </div>
  );
}
