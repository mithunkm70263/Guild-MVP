import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import PodChatHeader from '../pod/PodChatHeader.jsx';
import PodChatMessages from '../pod/PodChatMessages.jsx';
import PodChatInput from '../pod/PodChatInput.jsx';
import PodMembersPanel from '../pod/PodMembersPanel.jsx';
import KairosHelper from '../pod/KairosHelper.jsx';
import {
  appendChatMessage,
  getChatMessages,
  getPodMembersWithStatus,
} from '../../../lib/podChatData.js';
import { pageFade } from '../home/motionVariants.js';

export default function PodRoomView() {
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState(() => getChatMessages());
  const [membersCollapsed, setMembersCollapsed] = useState(false);
  const [showTyping, setShowTyping] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const syncCollapse = () => setMembersCollapsed(mq.matches);
    syncCollapse();
    mq.addEventListener('change', syncCollapse);
    return () => mq.removeEventListener('change', syncCollapse);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setShowTyping(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setShowTyping(false), 4200);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const handleSend = useCallback((text) => {
    const newMessage = appendChatMessage(text);
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const members = getPodMembersWithStatus();

  return (
    <motion.section
      className="dashboard-pod"
      aria-label="My Pod chat room"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={pageFade}
    >
      <div className="pod-chat-layout">
        <div className="pod-chat-main">
          <PodChatHeader />
          <PodChatMessages messages={messages} isTyping={showTyping} />
          <PodChatInput onSend={handleSend} />
        </div>

        <PodMembersPanel
          members={members}
          collapsed={membersCollapsed}
          onToggle={() => setMembersCollapsed((prev) => !prev)}
        />
      </div>

      <KairosHelper />
    </motion.section>
  );
}
