import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { KAIROS_REPLIES } from '../data.js';

const firstMessages = [
  { id: 'welcome', role: 'kairos', text: 'Good evening, Mithun. Before we plan anything, how does the work feel right now?', time: '8:44 PM' },
  { id: 'you', role: 'user', text: 'A little scattered. I want to make the check-in flow feel clear before I show it to the pod.', time: '8:45 PM' },
  { id: 'reply', role: 'kairos', text: 'That sounds like a good kind of constraint. Let’s keep it human: what should someone feel in the first five seconds?', time: '8:45 PM' },
];

function KairosGlyph({ tiny = false }) { return <div className={`kairos-glyph ${tiny ? 'tiny' : ''}`} aria-hidden="true"><img src="/kairos.png" alt="" /><i /></div>; }

export default function KairosView() {
  const [messages, setMessages] = useState(firstMessages);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const replyIndex = useRef(0);
  const threadRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [messages, typing]);
  const send = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [...current, { id: `user-${Date.now()}`, role: 'user', text, time: 'Now' }]);
    setDraft(''); setTyping(true);
    window.setTimeout(() => {
      const reply = KAIROS_REPLIES[replyIndex.current % KAIROS_REPLIES.length];
      replyIndex.current += 1;
      setTyping(false);
      setMessages((current) => [...current, { id: `kairos-${Date.now()}`, role: 'kairos', text: reply, time: 'Now' }]);
    }, 700);
  };
  return <section className="kairos-workspace">
    <motion.aside className="kairos-aside" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
      <div className="kairos-aside-glow" aria-hidden="true" /><KairosGlyph /><p className="dash-kicker">A private thinking room</p><h2>Find the<br /><em>next true step.</em></h2><p>Kairos holds the loose threads while you decide what deserves your attention.</p>
      <div className="kairos-context-card"><header><span className="dash-kicker">What Kairos is holding</span><i>live</i></header><ul><li><span>01</span><p>Your focus: <strong>the weekly check-in flow</strong></p></li><li><span>02</span><p>Anika is ready for the first pass.</p></li><li><span>03</span><p>Pod session begins at <strong>6:30 PM</strong>.</p></li></ul></div>
      <div className="kairos-suggestions"><span>Start somewhere</span><button type="button" onClick={() => setDraft('What deserves my full attention today?')}>What deserves my full attention? <i>↗</i></button><button type="button" onClick={() => setDraft('Help me make this task smaller.')}>Help me make this task smaller. <i>↗</i></button></div>
    </motion.aside>
    <motion.div className="kairos-conversation dash-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}>
      <header><div className="kairos-title-row"><KairosGlyph tiny /><div><span className="dash-kicker">Private conversation</span><h2>Kairos <i>✦</i></h2></div></div><div className="kairos-header-meta"><span className="kairos-status"><i /> present</span><button type="button" aria-label="More Kairos options">•••</button></div></header>
      <div className="kairos-thread" ref={threadRef} aria-live="polite"><div className="kairos-thread-date">TODAY · A CLEARER THREAD</div><AnimatePresence initial={false}>{messages.map((message) => <motion.article className={`kairos-message ${message.role}`} key={message.id} initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}><>{message.role === 'kairos' && <KairosGlyph tiny />}</><div><p>{message.text}</p><time>{message.time}</time></div></motion.article>)}</AnimatePresence>{typing && <motion.article className="kairos-message kairos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><KairosGlyph tiny /><div className="kairos-typing"><i /><i /><i /></div></motion.article>}</div>
      <form className="kairos-compose" onSubmit={send}><div><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Tell Kairos what’s on your mind…" /><small>Nothing here leaves this browser yet.</small></div><motion.button type="submit" whileTap={{ scale: .94 }} aria-label="Send message">↑</motion.button></form>
    </motion.div>
  </section>;
}
