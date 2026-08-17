import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import ChatPanel from '../ChatPanel.jsx';
import { KAIROS_REPLIES, MISSIONS, STARTER_MESSAGES } from '../data.js';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
};

function formatTime() {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}

export default function CommandView() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(STARTER_MESSAGES);
  const [kairosTyping, setKairosTyping] = useState(false);
  const replyIndex = useRef(0);

  const sendMessage = (event) => {
    event.preventDefault();
    const next = message.trim();
    if (!next) return;

    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, role: 'user', text: next, time: formatTime() },
    ]);
    setMessage('');
    setKairosTyping(true);

    window.setTimeout(() => {
      setKairosTyping(false);
      const reply = KAIROS_REPLIES[replyIndex.current % KAIROS_REPLIES.length];
      replyIndex.current += 1;
      setMessages((current) => [
        ...current,
        { id: `k-${Date.now()}`, role: 'kairos', text: reply, time: formatTime() },
      ]);
    }, 1100);
  };

  return (
    <div className="dash-view dash-command">
      <motion.div className="dash-command-layout" variants={stagger} initial="hidden" animate="show">
        <motion.section className="dash-mission-strip" variants={item} aria-label="Mission summary">
          {MISSIONS.map((mission, index) => (
            <motion.article
              key={mission.id}
              className={`dash-mission-card tone-${mission.tone}`}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <span>{mission.label}</span>
              <strong>{mission.value}</strong>
              <p>{mission.detail}</p>
              <div className="dash-mission-progress" aria-hidden="true">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${mission.progress}%` }}
                  transition={{ duration: 1, delay: 0.25 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </motion.article>
          ))}
        </motion.section>

        <motion.div variants={item} className="dash-kairos-chat-wrap">
          <ChatPanel
            title="Kairos"
            subtitle="Your AI co-pilot"
            messages={messages}
            message={message}
            onMessageChange={setMessage}
            onSend={sendMessage}
            placeholder="Ask Kairos anything — missions, focus, pod context..."
            live
            typing={kairosTyping ? 'Kairos' : null}
            headerAvatar={
              <div className="dash-kairos-header-avatar">
                <img src="/kairos.png" alt="Kairos" />
                <span className="dash-kairos-pulse" aria-hidden="true" />
              </div>
            }
            className="dash-kairos-chat-panel"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
