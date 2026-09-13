import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Avatar from '../Avatar.jsx';
import { KAIROS_REPLIES, POD_MESSAGES } from '../data.js';

function KairosGlyph({ small = false }) { return <span className={`pod-kairos-glyph ${small ? 'small' : ''}`}><img src="/kairos.png" alt="" /><i /></span>; }
function currentTime() { return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date()); }

export default function ChatView() {
  const [messages, setMessages] = useState(POD_MESSAGES);
  const [draft, setDraft] = useState('');
  const [kairosHere, setKairosHere] = useState(false);
  const [typing, setTyping] = useState(false);
  const replyIndex = useRef(0);
  const threadRef = useRef(null);
  useEffect(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [messages, typing]);
  const inviteKairos = () => {
    if (kairosHere) return;
    setKairosHere(true);
    setMessages(current => [...current, { id: 'kairos-joined', role: 'notice', text: 'Kairos joined the room', time: currentTime() }]);
    window.setTimeout(() => setMessages(current => [...current, { id: 'kairos-hello', role: 'kairos', text: 'I’m here to help the pod keep the next step clear. Tag me whenever a useful nudge would help.', time: currentTime() }]), 420);
  };
  const send = (event) => {
    event.preventDefault(); const text = draft.trim(); if (!text) return;
    setMessages(current => [...current, { id: `m-${Date.now()}`, author: 'Mithun', initials: 'M', text, time: currentTime(), mine: true }]); setDraft('');
    if (kairosHere) { setTyping(true); window.setTimeout(() => { const reply = KAIROS_REPLIES[replyIndex.current % KAIROS_REPLIES.length]; replyIndex.current += 1; setTyping(false); setMessages(current => [...current, { id: `k-${Date.now()}`, role: 'kairos', text: reply, time: currentTime() }]); }, 760); }
  };
  return <div className="pod-chat-layout">
    <motion.aside className="pod-chat-companion" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}><div className="pod-chat-warmth" aria-hidden="true" /><span className="dash-kicker">Pod 04 · the common room</span><h2>Leave a trace<br />of the <em>real work.</em></h2><p>Keep the thread light: progress, questions, or the one thing that feels stuck.</p><section className="pod-chat-kairos-card"><KairosGlyph /><div><span className="dash-kicker">AI room guide</span><h3>Kairos can join in.</h3><p>Useful when the pod needs a clear next question.</p></div><motion.button type="button" className={kairosHere ? 'is-here' : ''} onClick={inviteKairos} whileTap={{ scale: .96 }} disabled={kairosHere}>{kairosHere ? <><i /> In the room</> : 'Invite Kairos'}</motion.button></section><div className="pod-chat-ritual"><span><i /> Next gathering</span><strong>Today, 6:30 PM</strong><p>Bring one thing you moved.</p></div></motion.aside>
    <motion.section className="chat-shell dash-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}><header className="chat-header"><div className="avatar-stack"><Avatar initials="M" color="clay" size="sm" status="focus" /><Avatar initials="A" color="olive" size="sm" status="checked-in" /><Avatar initials="D" color="ink" size="sm" status="away" />{kairosHere && <KairosGlyph small />}</div><div><span className="dash-kicker">Pod room</span><h2>Work in progress</h2><p><i /> {kairosHere ? 'Kairos + 2 members here' : '2 members here now'}</p></div><button type="button" className="chat-header-kairos" onClick={inviteKairos} disabled={kairosHere}>{kairosHere ? '✦ Kairos is here' : '✦ Add Kairos'}</button></header><div className="chat-thread" ref={threadRef} aria-live="polite"><div className="chat-date">Today</div><AnimatePresence initial={false}>{messages.map((message) => {
      if (message.role === 'notice') return <motion.div className="chat-notice" key={message.id} initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}><span>✦</span>{message.text}</motion.div>;
      if (message.role === 'kairos') return <motion.article className="chat-message kairos" key={message.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}><KairosGlyph small /><div><strong>Kairos <em>AI guide</em></strong><p>{message.text}</p><time>{message.time}</time></div></motion.article>;
      return <motion.article className={`chat-message ${message.mine ? 'mine' : ''}`} key={message.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 25 }}>{!message.mine && <Avatar initials={message.initials} color={message.initials === 'A' ? 'olive' : 'ink'} size="sm" />}<div><strong>{message.mine ? 'You' : message.author}</strong><p>{message.text}</p><time>{message.time}</time></div></motion.article>;
    })}</AnimatePresence>{typing && <motion.article className="chat-message kairos typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><KairosGlyph small /><div className="pod-chat-typing"><i /><i /><i /></div></motion.article>}</div><form className="chat-compose" onSubmit={send}><div className="chat-compose-copy"><span>{kairosHere ? 'Kairos is listening too' : 'Your pod will see this'}</span><input value={draft} onChange={event => setDraft(event.target.value)} placeholder={kairosHere ? 'Ask the pod — or ask Kairos…' : 'Write a note to your pod…'} /></div><motion.button whileTap={{ scale: .92 }} type="submit" aria-label="Send message">↑</motion.button></form></motion.section>
  </div>;
}
