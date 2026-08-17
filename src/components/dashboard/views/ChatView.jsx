import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Avatar from '../Avatar.jsx';
import ChatPanel from '../ChatPanel.jsx';
import { POD_CHAT_MESSAGES, POD_CHAT_REPLIES, POD_MEMBERS, PRIVATE_CHATS, USER } from '../data.js';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

function formatTime() {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}

function pickReply(name) {
  const pool = POD_CHAT_REPLIES[name] ?? ['Got it.'];
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ChatView() {
  const [mode, setMode] = useState('pod');
  const [activePrivate, setActivePrivate] = useState(PRIVATE_CHATS[0].id);
  const [podMessages, setPodMessages] = useState(POD_CHAT_MESSAGES);
  const [privateChats, setPrivateChats] = useState(PRIVATE_CHATS);
  const [podDraft, setPodDraft] = useState('');
  const [privateDraft, setPrivateDraft] = useState('');
  const [typingMember, setTypingMember] = useState(null);

  const activeChat = useMemo(
    () => privateChats.find((chat) => chat.id === activePrivate) ?? privateChats[0],
    [activePrivate, privateChats],
  );

  const onlineCount = POD_MEMBERS.filter((m) => m.online).length + 1;

  const sendPodMessage = (event) => {
    event.preventDefault();
    const text = podDraft.trim();
    if (!text) return;

    const userMsg = {
      id: `pu-${Date.now()}`,
      role: 'user',
      author: USER.name,
      text,
      time: formatTime(),
    };
    setPodMessages((current) => [...current, userMsg]);
    setPodDraft('');

    const replier = POD_MEMBERS.find((m) => m.online)?.name ?? 'Anika';
    setTypingMember(replier);
    window.setTimeout(() => {
      setTypingMember(null);
      setPodMessages((current) => [
        ...current,
        {
          id: `pr-${Date.now()}`,
          role: 'member',
          author: replier,
          text: pickReply(replier),
          time: formatTime(),
          online: true,
        },
      ]);
    }, 1400);
  };

  const sendPrivateMessage = (event) => {
    event.preventDefault();
    const text = privateDraft.trim();
    if (!text) return;

    const memberName = activeChat.member.name;
    const userMsg = {
      id: `dm-u-${Date.now()}`,
      role: 'user',
      author: USER.name,
      text,
      time: formatTime(),
    };

    setPrivateChats((current) =>
      current.map((chat) =>
        chat.id === activePrivate
          ? { ...chat, messages: [...chat.messages, userMsg] }
          : chat,
      ),
    );
    setPrivateDraft('');

    window.setTimeout(() => {
      setPrivateChats((current) =>
        current.map((chat) =>
          chat.id === activePrivate
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: `dm-r-${Date.now()}`,
                    role: 'member',
                    author: memberName,
                    text: pickReply(memberName),
                    time: formatTime(),
                    online: chat.member.online,
                  },
                ],
              }
            : chat,
        ),
      );
    }, 1200);
  };

  return (
    <div className="dash-view dash-chat-view">
      <motion.div className="dash-chat-layout" variants={stagger} initial="hidden" animate="show">
        <motion.aside className="dash-chat-sidebar" variants={item}>
          <div className="dash-chat-mode-tabs" role="tablist" aria-label="Chat mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'pod'}
              className={mode === 'pod' ? 'active' : ''}
              onClick={() => setMode('pod')}
            >
              Pod Room
              <span>{onlineCount} online</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'private'}
              className={mode === 'private' ? 'active' : ''}
              onClick={() => setMode('private')}
            >
              Private
              <span>{privateChats.filter((c) => c.member.unread).length} new</span>
            </button>
          </div>

          {mode === 'private' && (
            <div className="dash-private-list">
              {privateChats.map((chat) => (
                <motion.button
                  type="button"
                  key={chat.id}
                  className={`dash-private-item ${activePrivate === chat.id ? 'active' : ''}`}
                  onClick={() => setActivePrivate(chat.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar name={chat.member.name} size={44} online={chat.member.online} />
                  <div>
                    <strong>{chat.member.name}</strong>
                    <span>{chat.member.skill}</span>
                  </div>
                  {chat.member.unread > 0 && (
                    <em className="dash-unread-badge">{chat.member.unread}</em>
                  )}
                </motion.button>
              ))}
            </div>
          )}

          {mode === 'pod' && (
            <div className="dash-pod-chat-info">
              <span className="dash-kicker">Pod 07</span>
              <h3>Builders in sync</h3>
              <p>Your pod's shared space for updates, blockers, and wins.</p>
              <div className="dash-pod-chat-members">
                {[USER, ...POD_MEMBERS].map((member) => (
                  <Avatar
                    key={member.name}
                    name={member.name}
                    size={40}
                    online={member.online !== false}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.aside>

        <motion.div className="dash-chat-main" variants={item}>
          {mode === 'pod' ? (
            <ChatPanel
              title="Pod Room"
              subtitle="Group chat"
              messages={podMessages}
              message={podDraft}
              onMessageChange={setPodDraft}
              onSend={sendPodMessage}
              placeholder="Message your pod..."
              live
              typing={typingMember}
              className="dash-pod-chat-panel"
            />
          ) : (
            <ChatPanel
              title={activeChat.member.name}
              subtitle="Private message"
              messages={activeChat.messages}
              message={privateDraft}
              onMessageChange={setPrivateDraft}
              onSend={sendPrivateMessage}
              placeholder={`Message ${activeChat.member.name}...`}
              headerAvatar={
                <Avatar
                  name={activeChat.member.name}
                  size={44}
                  online={activeChat.member.online}
                />
              }
              className="dash-private-chat-panel"
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
