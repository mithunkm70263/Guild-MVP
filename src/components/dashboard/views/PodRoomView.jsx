import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import Avatar from '../Avatar.jsx';
import { POD_MEMBERS } from '../data.js';

const nodePositions = [{ left: '17%', top: '36%' }, { left: '65%', top: '12%' }, { left: '65%', top: '61%' }];
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };

function Arrow() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" /></svg>; }

export default function PodRoomView({ onNavigate }) {
  const [joined, setJoined] = useState(false);
  const reduceMotion = useReducedMotion();
  return <motion.div className="pod-room-stage" initial="initial" animate="animate">
    <motion.section className="pod-room-hero" variants={item} transition={{ duration: .45 }}>
      <div className="pod-room-copy"><span className="dash-kicker">Pod 04 / small by design</span><h2>Three people,<br /><em>making room</em><br />for the work.</h2><p>This is not a crowd. It’s a calm, small place where progress gets witnessed before it disappears into the week.</p><div className="pod-room-actions"><button type="button" onClick={() => onNavigate('chat')}>Write to the pod <Arrow /></button><button type="button" className={joined ? 'is-joined' : ''} onClick={() => setJoined((current) => !current)}>{joined ? 'You’re in the room' : 'Join the room'} <i /></button></div></div>
      <div className="pod-orbit" aria-label="Pod 04 members and their current status">
        <svg className="pod-orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M24 44 70 22M24 47l46 39M72 26v52" /></svg>
        <motion.div className="pod-orbit-core" animate={reduceMotion ? undefined : { scale: [1, 1.035, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><img src="/guild-logo.png" alt="" /><span>Pod 04</span><i /></motion.div>
        {POD_MEMBERS.map((member, index) => <motion.article className="pod-orbit-member" key={member.id} style={nodePositions[index]} initial={{ opacity: 0, scale: .72 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .18 + index * .09, type: 'spring', stiffness: 280, damping: 22 }} whileHover={reduceMotion ? undefined : { scale: 1.06 }}><Avatar initials={member.initials} color={member.color} size="lg" status={member.status} /><div><strong>{member.name === 'Mithun' ? 'You' : member.name.split(' ')[0]}</strong><small>{member.status === 'focus' ? 'in focus' : member.status === 'away' ? 'away' : 'checked in'}</small></div></motion.article>)}
      </div>
    </motion.section>
    <motion.aside className="pod-room-side" variants={item} transition={{ delay: .08, duration: .45 }}>
      <section className="pod-session-card"><div className="pod-session-clock"><svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="24" /><path d="M30 16v15l9 5" /></svg></div><span className="dash-kicker">Next shared session</span><h3>Today · 6:30 PM</h3><p>In <strong>3 hours, 18 minutes.</strong> Bring the one thing you moved.</p><div><i /><span>Mithun and Anika are coming</span></div></section>
      <section className="pod-pulse-card"><header><span className="dash-kicker">The room right now</span><b><i /> 2 present</b></header>{POD_MEMBERS.map((member) => <motion.article key={member.id} whileHover={reduceMotion ? undefined : { x: 3 }}><Avatar initials={member.initials} color={member.color} size="sm" status={member.status} /><div><strong>{member.name === 'Mithun' ? 'Mithun (you)' : member.name}</strong><span>{member.detail}</span></div><em>{member.status === 'focus' ? 'Now' : member.status === 'away' ? 'Soon' : 'Here'}</em></motion.article>)}</section>
    </motion.aside>
  </motion.div>;
}
