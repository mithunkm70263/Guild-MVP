import { useCallback, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  addKairosTask,
  generateCoachResponse,
  getInitialMessages,
  getKairosTasks,
  resetKairosDemo,
  toggleKairosTask,
  KAIROS_CHAT_KEY,
} from '../../../lib/kairosData.js';
import { pageFade } from '../home/motionVariants.js';
import KairosHeader from '../kairos/KairosHeader.jsx';
import KairosMascotStage from '../kairos/KairosMascotStage.jsx';
import KairosQuickStats from '../kairos/KairosQuickStats.jsx';
import KairosTodaysFocus from '../kairos/KairosTodaysFocus.jsx';
import KairosLearningCard from '../kairos/KairosLearningCard.jsx';
import KairosSprintCard from '../kairos/KairosSprintCard.jsx';
import KairosChatPanel from '../kairos/KairosChatPanel.jsx';

export default function KairosView() {
  const reduceMotion = useReducedMotion();
  const [tasks, setTasks] = useState(() => getKairosTasks());
  const [messages, setMessages] = useState(() => getInitialMessages());
  const [isThinking, setIsThinking] = useState(false);
  const [activePose, setActivePose] = useState('idle');
  const [mascotMessage, setMascotMessage] = useState(null);
  const [mobileTab, setMobileTab] = useState('overview'); // 'overview' | 'chat'

  // Toggle task completion
  const handleToggleTask = useCallback((taskId) => {
    const next = toggleKairosTask(taskId);
    setTasks(next);

    const toggled = next.find((t) => t.id === taskId);
    if (toggled && toggled.completed) {
      setActivePose('cheer');
      setMascotMessage('Crushed it! Every finished task builds momentum. 🚀');
      setTimeout(() => {
        setActivePose('idle');
        setMascotMessage(null);
      }, 3500);
    }
  }, []);

  // Send message to Kairos
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
      setActivePose('focus');

      // Simulate coach thinking & generation
      setTimeout(() => {
        const coachResponse = generateCoachResponse(text, tasks);

        // If coach assigned a task, dynamically add it to Today's Focus
        if (coachResponse.assignTask) {
          const { nextTasks } = addKairosTask(coachResponse.assignTask);
          setTasks(nextTasks);
          setActivePose('cheer');
          setMascotMessage('New mission assigned to Today’s Focus!');
          setTimeout(() => {
            setActivePose('idle');
            setMascotMessage(null);
          }, 3500);
        } else {
          setActivePose('idle');
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

  // When clicking a recommended learning item, ask Kairos about it
  const handleSelectLearning = useCallback(
    (item) => {
      handleSendMessage(`Can you explain why "${item.title}" is important for our sprint?`);
      setMobileTab('chat');
    },
    [handleSendMessage]
  );

  // Reset demo to fresh state
  const handleResetDemo = useCallback(() => {
    const demo = resetKairosDemo();
    setTasks(demo.tasks);
    setMessages(demo.messages);
    setActivePose('idle');
    setMascotMessage('Demo reset! Ask me anything to get started.');
    setTimeout(() => setMascotMessage(null), 3000);
  }, []);

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <motion.div
      className="kairos-view"
      aria-label="Kairos AI Guide"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={pageFade}
    >
      <KairosHeader onResetDemo={handleResetDemo} />

      {/* Mobile Tabs Switcher */}
      <div className="kairos-mobile-tabs" role="tablist" aria-label="Mobile view tabs">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'overview'}
          className={`kairos-mobile-tab-btn ${mobileTab === 'overview' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('overview')}
        >
          Daily Overview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'chat'}
          className={`kairos-mobile-tab-btn ${mobileTab === 'chat' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('chat')}
        >
          Chat with Kairos
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="kairos-layout">
        {/* Left Column: Context & Daily Overview */}
        <div
          className={`kairos-left-col ${
            mobileTab !== 'overview' ? 'is-hidden-mobile' : ''
          }`}
        >
          <KairosMascotStage pose={activePose} customMessage={mascotMessage} />
          <KairosQuickStats
            completedCount={completedTasksCount}
            totalCount={tasks.length}
          />
          <KairosTodaysFocus tasks={tasks} onToggleTask={handleToggleTask} />
          <KairosLearningCard onSelectLearning={handleSelectLearning} />
          <KairosSprintCard />
        </div>

        {/* Right Column: Chat Interface */}
        <div
          className={`kairos-chat-wrapper ${
            mobileTab !== 'chat' ? 'is-hidden-mobile' : ''
          }`}
        >
          <KairosChatPanel
            messages={messages}
            isThinking={isThinking}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </motion.div>
  );
}
