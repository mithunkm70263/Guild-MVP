import ProfileSection from './ProfileSection.jsx';
import { formatShipDate } from '../../../lib/profileData.js';

const LINK_LABELS = {
  demo: 'Demo',
  github: 'GitHub',
  twitter: 'Twitter',
};

export default function PublicPortfolio({ extended }) {
  const { portfolio } = extended;

  return (
    <ProfileSection
      kicker="Proof"
      title="Public portfolio"
      subtitle="Projects shipped through Guild."
      className="profile-portfolio"
    >
      <ul className="profile-portfolio-list">
        {portfolio.map((project) => (
          <li key={project.id} className="profile-portfolio-item">
            <div className="profile-portfolio-item-head">
              <div className="profile-portfolio-item-copy">
                <h3 className="profile-portfolio-name">{project.name}</h3>
                <p className="profile-portfolio-desc">{project.description}</p>
              </div>
              <span className="profile-portfolio-badge">Shipped via Guild</span>
            </div>
            <div className="profile-portfolio-meta">
              <span className="profile-portfolio-date">
                {formatShipDate(project.shippedDate)}
              </span>
              {project.links && (
                <div className="profile-portfolio-links">
                  {Object.entries(project.links).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      className="profile-portfolio-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {LINK_LABELS[key] || key}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}
