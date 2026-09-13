import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Avatar from '../Avatar.jsx';
import { KAIROS_MESSAGES, POD_MEMBERS, USER, WEEKLY_RHYTHM } from '../data.js';

const TOTAL_SECONDS = 48 * 60;
const transition = { type: 'spring', stiffness: 300, damping: 28 };
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.075, delayChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } } };

function Arrow() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" /></svg>; }
function PauseIcon({ paused }) { return paused ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 7 5-7 5Z" /></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7v10M15 7v10" /></svg>; }

function FocusClock({ remaining, active }) {
  const progress = 1 - remaining / TOTAL_SECONDS;
  const strokeDasharray = 226.2;
  const offset = strokeDasharray * (1 - progress);
  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  return <div className={`focus-clock ${active ? 'is-active' : ''}`}>
    <svg viewBox="0 0 88 88" aria-hidden="true"><circle cx="44" cy="44" r="36" className="focus-clock-track" /><motion.circle cx="44" cy="44" r="36" className="focus-clock-progress" strokeDasharray={strokeDasharray} animate={{ strokeDashoffset: offset }} transition={{ duration: 0.6, ease: 'easeOut' }} /></svg>
    <span><strong>{minutes}:{seconds}</strong><small>{active ? 'focus is on' : 'ready when you are'}</small></span>
  </div>;
}

export default function CommandView({ onNavigate, focusTrigger }) {
  const [complete, setComplete] = useState(false);
  const [focusActive, setFocusActive] = useState(false);
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const reduceMotion = useReducedMotion();

  useEffect(() => { if (focusTrigger) setFocusActive(true); }, [focusTrigger]);
  useEffect(() => {
    if (!focusActive || remaining <= 0) return undefined;
    const interval = window.setInterval(() => setRemaining((time) => Math.max(0, time - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [focusActive, remaining]);
  useEffect(() => { if (remaining === 0) setFocusActive(false); }, [remaining]);

  const focusProgress = useMemo(() => Math.round(((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 100), [remaining]);
  const checkIns = POD_MEMBERS.filter((member) => member.status !== 'away').length;

  return <motion.div className="command-stage" variants={container} initial="hidden" animate="visible">
    <motion.section className="command-intro" variants={item}>
      <div className="command-intro-top"><p className="dash-kicker">Wednesday / September 10</p><span className="command-weather"><i /> A good day to make a dent</span></div>
      <h2>Your pod.<br /><em>Within reach.</em></h2>
      <p className="command-lede">You don’t need a perfect plan. Just one clear move, a little protected time, and someone who will notice.</p>
      <div className="command-intro-actions"><button type="button" onClick={() => setFocusActive((current) => !current)}><span>{focusActive ? 'Ⅱ' : '▷'}</span>{focusActive ? 'Pause the session' : 'Start a focus session'}</button><button type="button" onClick={() => onNavigate('kairos')}>Ask Kairos <Arrow /></button></div>
    </motion.section>

    <motion.section className={`focus-card ${focusActive ? 'is-running' : ''}`} variants={item} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.005 }} transition={transition}>
      <div className="focus-card-texture" aria-hidden="true"><i /><i /><i /></div>
      <div className="focus-card-top"><span className="dash-kicker">The next true step</span><span className="focus-time">{focusProgress ? `${focusProgress}% held` : '48 min ritual'}</span></div>
      <div className="focus-card-main"><div><h3>Design the weekly<br />check-in flow.</h3><p>Make the first screen feel less like a task and more like a welcome.</p></div><FocusClock remaining={remaining} active={focusActive} /></div>
      <div className="focus-card-bottom"><button className={complete ? 'focus-check complete' : 'focus-check'} onClick={() => setComplete((value) => !value)} type="button"><i>{complete && '✓'}</i>{complete ? 'Moved today' : 'Mark as moved'}</button><div><button className="focus-play" type="button" onClick={() => setFocusActive((current) => !current)} aria-label={focusActive ? 'Pause focus session' : 'Start focus session'}><PauseIcon paused={!focusActive} /></button><button className="round-arrow" type="button" onClick={() => onNavigate('missions')} aria-label="Open missions"><Arrow /></button></div></div>
    </motion.section>

    <motion.section className="command-rhythm" variants={item}>
      <div className="rhythm-copy"><span className="dash-kicker">Your rhythm</span><h3>Small work, kept visible.</h3><p><strong>{USER.focusMinutes} minutes</strong> of attention this week.</p></div>
      <div className="rhythm-week" aria-label="Your weekly consistency">{WEEKLY_RHYTHM.map((day, index) => <motion.div className={`rhythm-day ${day.state}`} key={day.day} initial={{ scaleY: 0.2, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ delay: 0.16 + index * 0.06, type: 'spring', stiffness: 300, damping: 22 }}><i /><span>{day.day}</span></motion.div>)}</div>
      <button className="rhythm-more" type="button" onClick={() => onNavigate('profile')}><span>Week {USER.week} of {USER.totalWeeks}</span><Arrow /></button>
    </motion.section>

    <motion.section className="dash-card checkin-card" variants={item} whileHover={reduceMotion ? undefined : { y: -2 }} transition={transition}>
      <div className="section-heading"><div><span className="dash-kicker">Pod check-in</span><h3>{checkIns} of {POD_MEMBERS.length} are holding the week.</h3></div><button className="text-button" onClick={() => onNavigate('pod')}>See the room <Arrow /></button></div>
      <div className="checkin-row">{POD_MEMBERS.map((member) => <div className="checkin-person" key={member.id}><Avatar initials={member.initials} color={member.color} size="md" status={member.status} /><span><strong>{member.name === 'Mithun' ? 'You' : member.name.split(' ')[0]}</strong><small>{member.status === 'away' ? 'Back soon' : member.detail}</small></span></div>)}</div>
      <div className="checkin-caption"><i /> Last shared by Anika · 9:18 AM</div>
    </motion.section>

    <motion.section className="dash-card kairos-card" variants={item} whileHover={reduceMotion ? undefined : { y: -2 }} transition={transition}>
      <div className="kairos-mark">✦</div><div className="kairos-head"><div><span className="dash-kicker">Kairos / held context</span><h3>A small nudge, at the useful moment.</h3></div><span className="kairos-live"><i /> present</span></div>
      <div className="kairos-messages">{KAIROS_MESSAGES.map((message, index) => <motion.article key={message.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.08 }}><p>{message.text}</p><time>{message.time}</time></motion.article>)}</div>
      <button className="kairos-open" onClick={() => onNavigate('kairos')}>Continue the thought <Arrow /></button>
    </motion.section>

    <motion.button className="pod-invite" type="button" onClick={() => onNavigate('chat')} variants={item} whileHover={reduceMotion ? undefined : { y: -2 }} whileTap={{ scale: 0.99 }}><span><i /> Pod Room is warm</span><strong>Leave the pod one useful note</strong><small>Anika shared 3 thoughts about your flow.</small><Arrow /></motion.button>
  </motion.div>;
}
