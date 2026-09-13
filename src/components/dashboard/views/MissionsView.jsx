import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { MISSION_BOARD } from '../data.js';

const groups = [{ key: 'today', label: 'Today', caption: 'A little less, but real', tone: 'terracotta' }, { key: 'week', label: 'This week', caption: 'Keep the thread alive', tone: 'sage' }, { key: 'later', label: 'Keep warm', caption: 'Not forgotten', tone: 'sand' }];
const card = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function MissionsView() {
  const [board, setBoard] = useState(MISSION_BOARD);
  const [lens, setLens] = useState('all');
  const [addingTo, setAddingTo] = useState(null);
  const [draft, setDraft] = useState('');
  const reduceMotion = useReducedMotion();
  const toggle = (group, id) => setBoard((current) => ({ ...current, [group]: current[group].map((task) => task.id === id ? { ...task, done: !task.done } : task) }));
  const addIntention = (event, group) => {
    event.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setBoard((current) => ({ ...current, [group]: [...current[group], { id: `intent-${Date.now()}`, title, note: 'Fresh intention', duration: '25 min', done: false }] }));
    setDraft('');
    setAddingTo(null);
  };
  const tasks = Object.values(board).flat();
  const completed = tasks.filter((task) => task.done).length;
  const open = tasks.length - completed;
  const visibleGroups = lens === 'all' ? groups : groups.filter((group) => group.key === lens);
  return <motion.div className="missions-stage" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .08 } } }}>
    <motion.header className="missions-head" variants={card}><div><span className="dash-kicker">The work, without the noise</span><h2>Make room for<br /><em>what matters.</em></h2></div><div className="missions-summary"><article><strong>{open}</strong><span>open threads</span></article><article><strong>{completed}</strong><span>moved this week</span></article><article><strong>4h</strong><span>held for focus</span></article></div></motion.header>
    <motion.div className="mission-lens" variants={card}><span>View</span>{[{ id: 'all', label: 'All work' }, ...groups.map((group) => ({ id: group.key, label: group.label }))].map((option) => <button type="button" key={option.id} className={lens === option.id ? 'active' : ''} onClick={() => setLens(option.id)}>{option.label}</button>)}</motion.div>
    <motion.div className={`missions-layout ${lens !== 'all' ? 'is-filtered' : ''}`} layout>{visibleGroups.map((group, groupIndex) => <motion.section className={`mission-group tone-${group.tone}`} key={group.key} variants={card} layout transition={{ type: 'spring', stiffness: 310, damping: 30 }}><header><div><span className="dash-kicker">{group.label}</span><h3>{group.caption}</h3></div><b>{board[group.key].filter((task) => task.done).length}/{board[group.key].length}</b></header><div className="mission-group-line" /><div className="mission-list">{board[group.key].map((task, index) => <motion.button key={task.id} className={`mission-item ${task.done ? 'done' : ''}`} onClick={() => toggle(group.key, task.id)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 + groupIndex * .05 + index * .06 }} whileHover={reduceMotion ? undefined : { x: 3 }} whileTap={{ scale: .985 }}><i>{task.done && '✓'}</i><span><strong>{task.title}</strong><small><em>{task.note}</em>{task.duration} of attention</small></span><b>↗</b></motion.button>)}</div>{addingTo === group.key ? <form className="mission-add-form" onSubmit={(event) => addIntention(event, group.key)}><input autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Name the intention…" aria-label="New intention" /><button type="submit">Add</button><button type="button" aria-label="Cancel new intention" onClick={() => { setAddingTo(null); setDraft(''); }}>×</button></form> : <button className="mission-add" type="button" onClick={() => setAddingTo(group.key)}><i>+</i> Hold a new intention</button>}</motion.section>)}</motion.div>
  </motion.div>;
}
