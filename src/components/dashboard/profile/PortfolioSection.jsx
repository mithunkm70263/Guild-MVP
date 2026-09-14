import { formatShipDate } from '../../../lib/profileData.js';

const LINK_LABELS = {
  demo: 'Live demo',
  github: 'GitHub',
  twitter: 'Post',
};

function ProjectLinks({ links }) {
  if (!links) return null;

  const entries = Object.entries(links).filter(([, url]) => Boolean(url));
  if (entries.length === 0) return null;

  return (
    <div className="profile-project-links">
      {entries.map(([key, url]) => (
        <a
          key={key}
          href={url}
          className={`profile-project-link profile-project-link--${key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {LINK_LABELS[key] || key}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      ))}
    </div>
  );
}

export default function PortfolioSection({ extended }) {
  const { portfolio } = extended;

  return (
    <section className="profile-portfolio" aria-label="Public portfolio">
      <header className="profile-portfolio-head">
        <div>
          <span className="profile-section-kicker">Proof of work</span>
          <h2 className="profile-section-title">Public portfolio</h2>
        </div>
        <p className="profile-portfolio-count">
          {portfolio.length} project{portfolio.length === 1 ? '' : 's'} shipped
        </p>
      </header>

      <ul className="profile-portfolio-grid">
        {portfolio.map((project) => (
          <li key={project.id} className="profile-project-card">
            <div className="profile-project-top">
              <div className="profile-project-accent" aria-hidden="true" />
              <div className="profile-project-copy">
                <div className="profile-project-title-row">
                  <h3 className="profile-project-name">{project.name}</h3>
                  {project.shippedViaGuild !== false && (
                    <span className="profile-project-badge">Shipped via Guild</span>
                  )}
                </div>
                <p className="profile-project-desc">{project.description}</p>
                <time className="profile-project-date" dateTime={project.shippedDate}>
                  Shipped {formatShipDate(project.shippedDate)}
                </time>
              </div>
            </div>
            <ProjectLinks links={project.links} />
          </li>
        ))}
      </ul>
    </section>
  );
}
