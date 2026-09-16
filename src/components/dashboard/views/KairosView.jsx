import { useCallback, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  addKairosTask,
  generateCoachResponse,
  getInitialMessages,
  getKairosTasks,
  KAIROS_CHAT_KEY,
} from '../../../lib/kairosData.js';
import { pageFade } from '../home/motionVariants.js';
import KairosChatPanel from '../kairos/KairosChatPanel.jsx';

export default function KairosView() {
  const reduceMotion = useReducedMotion();
  const [tasks, setTasks] = useState(() => getKairosTasks());
  const [messages, setMessages] = useState(() => getInitialMessages());
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = useCallback(
    (text) => {
      const userMsg = {
        id: `msg-${Date.now()}-user`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      try {
        localStorage.setItem(KAIROS_CHAT_KEY, JSON.stringify(updatedMessages));
      } catch {}

      setIsThinking(true);

      setTimeout(() => {
        const coachResponse = generateCoachResponse(text, tasks);

        if (coachResponse.assignTask) {
          const { nextTasks } = addKairosTask(coachResponse.assignTask);
          setTasks(nextTasks);
        }

        const kairosMsg = {
          id: `msg-${Date.now()}-kairos`,
          sender: 'kairos',
          text: coachResponse.text,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          cardType: coachResponse.cardType,
          cardData: coachResponse.cardData,
        };

        const finalMessages = [...updatedMessages, kairosMsg];
        setMessages(finalMessages);
        setIsThinking(false);
        try {
          localStorage.setItem(KAIROS_CHAT_KEY, JSON.stringify(finalMessages));
        } catch {}
      }, 850);
    },
    [messages, tasks]
  );

  return (
    <motion.div
      className="kairos-view"
      aria-label="Kairos AI Guide"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={pageFade}
    >
      <KairosChatPanel
        messages={messages}
        isThinking={isThinking}
        onSendMessage={handleSendMessage}
      />
    </motion.div>
  );
}
