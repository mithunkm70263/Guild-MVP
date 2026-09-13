import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Avatar from '../Avatar.jsx';
import { USER, WEEKLY_RHYTHM } from '../data.js';

function CountUp({ value, suffix = '' }) {
  const [shown, setShown] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) { setShown(value); return undefined; }
    const start = performance.now();
    const duration = 760;
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduceMotion]);
  return <>{shown}{suffix}</>;
}

export default function ProfileView() {
  const reduceMotion = useReducedMotion();
  return <motion.div className="profile-stage" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .08 } } }}>
    <motion.section className="profile-portrait" variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}><div className="profile-portrait-orbit" aria-hidden="true"><i /><i /><i /></div><Avatar initials={USER.initials} color="clay" size="xxl" status="focus" /><span className="dash-kicker">Founder track / week {USER.week}</span><h2>{USER.name}</h2><p>Making Guild feel like a small room people want to return to.</p><button type="button">Edit your note <span>↗</span></button></motion.section>
    <motion.section className="profile-commitment dash-card" variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}><div className="profile-commitment-top"><span className="dash-kicker">The one thing you chose</span><em>Active commitment</em></div><h3>{USER.commitment}</h3><p>Not a level. Not a streak for show. A promise to keep turning up for the work that matters.</p><div className="profile-progress-meta"><span>Week {USER.week} of {USER.totalWeeks}</span><span>{Math.round((USER.week / USER.totalWeeks) * 100)}% held</span></div><div className="profile-progress"><motion.i initial={{ width: 0 }} animate={{ width: `${USER.week / USER.totalWeeks * 100}%` }} transition={{ duration: .9, delay: .3, ease: [0.16, 1, 0.3, 1] }} /></div><div className="profile-week-line">{WEEKLY_RHYTHM.map((day, index) => <motion.span key={day.day} className={day.state} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38 + index * .06 }}><i>{day.state === 'done' ? '✓' : day.state === 'today' ? '•' : ''}</i>{day.day}</motion.span>)}</div></motion.section>
    <motion.section className="profile-stats" variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}><article><strong><CountUp value={USER.week} /><sup>/8</sup></strong><span>weeks held</span><i>steady</i></article><article><strong><CountUp value={USER.sessions} /></strong><span>sessions attended</span><i>with others</i></article><article><strong><CountUp value={USER.streak} suffix="d" /></strong><span>current streak</span><i>softly kept</i></article></motion.section>
    <motion.section className="profile-reflection" variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} whileHover={reduceMotion ? undefined : { y: -2 }}><div><span className="dash-kicker">A note to your future self</span><p>“The work got clearer when I stopped treating every thought like it had to become a feature.”</p><small>— written after last Tuesday’s pod session</small></div><span className="profile-reflection-mark">“</span></motion.section>
  </motion.div>;
}
