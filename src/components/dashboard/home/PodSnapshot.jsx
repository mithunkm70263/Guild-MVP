import { Link } from 'react-router-dom';
import { getPodMembers } from '../../../lib/homeData.js';
import HomeCard from './HomeCard.jsx';

export default function PodSnapshot() {
  const members = getPodMembers();

  return (
    <HomeCard className="home-pod-card">
      <header className="home-card-head">
        <div className="home-card-head-row">
          <div>
            <h2 className="home-card-title">My Pod</h2>
            <p className="home-card-subtitle">Builder room snapshot</p>
          </div>
          <Link to="/dashboard/pod" className="home-link-btn">Go to My Pod</Link>
        </div>
      </header>

      {members.length === 0 ? (
        <div className="home-empty-state">
          <p className="home-empty-title">Pod matching in progress</p>
          <p className="home-empty-copy">Kairos is finding your builder crew. Hang tight.</p>
        </div>
      ) : (
        <ul className="home-pod-list">
          {members.map((member) => (
            <li key={member.id} className="home-pod-member">
              <span
                className="home-pod-avatar"
                style={{ background: `linear-gradient(135deg, ${member.avatarColor}, ${member.avatarColor}cc)` }}
                aria-hidden="true"
              >
                {member.initials}
              </span>
              <div className="home-pod-member-copy">
                <span className="home-pod-member-name">{member.name}</span>
                <span className="home-pod-member-status">{member.status}</span>
              </div>
              <span className="home-pod-pulse" aria-hidden="true" />
            </li>
          ))}
        </ul>
      )}
    </HomeCard>
  );
}
