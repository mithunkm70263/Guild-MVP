import { getSprintStatus, getStreak, getTimeGreeting } from '../../../lib/homeData.js';

export default function WelcomeSection({ name }) {
  const greeting = getTimeGreeting();
  const sprint = getSprintStatus();
  const streak = getStreak();
  const firstName = name.split(' ')[0] || name;

  return (
    <header className="home-welcome">
      <div className="home-welcome-content">
        <span className="home-welcome-kicker">Command room</span>
        <h1 id="dashboard-home-title" className="home-welcome-title">
          {greeting}, {firstName}
        </h1>
        <p className="home-welcome-status">{sprint.line}</p>
        <div className="home-welcome-meta">
          <span className="home-streak-badge" aria-label={`${streak} day streak`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 23c-3.9 0-7.2-2.5-8.4-6-.9-2.7-.3-5.7 1.6-7.9C6.5 7.5 9 6 12 6s5.5 1.5 7.8 3.1c1.9 2.2 2.5 5.2 1.6 7.9C19.2 20.5 15.9 23 12 23z" opacity="0.2" />
              <path d="M12 2c1.5 2.2 3.8 3.5 5.5 5.5 1.4 1.6 2 3.6 1.4 5.6-.5 1.7-1.8 3.1-3.4 3.8-1 .4-2.1.6-3.5.6-1.4 0-2.5-.2-3.5-.6-1.6-.7-2.9-2.1-3.4-3.8-.6-2 0-4 1.4-5.6C8.2 5.5 10.5 4.2 12 2z" />
            </svg>
            {streak} day streak
          </span>
          {sprint.daysLeft !== undefined && sprint.daysLeft > 0 && (
            <span className="home-week-pill">{sprint.daysLeft} days left this week</span>
          )}
        </div>
      </div>
    </header>
  );
}
