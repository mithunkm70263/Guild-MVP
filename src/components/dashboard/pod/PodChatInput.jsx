import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PodChatInput({ onSend, disabled }) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <form className="pod-chat-input-bar" onSubmit={handleSubmit}>
      <label className="pod-chat-input-label" htmlFor="pod-chat-input">
        Message your pod
      </label>
      <div className="pod-chat-input-row">
        <input
          id="pod-chat-input"
          type="text"
          className="pod-chat-input"
          placeholder="Share a build update…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled}
          autoComplete="off"
        />
        <motion.button
          type="submit"
          className="pod-chat-send-btn"
          disabled={!value.trim() || disabled}
          aria-label="Send message"
          whileHover={reduceMotion ? undefined : { scale: 1.04 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 520, damping: 24 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </motion.button>
      </div>
    </form>
  );
}
