import SettingsSection from './SettingsSection.jsx';

const CONNECTED_ACCOUNTS = [
  {
    key: 'github',
    label: 'GitHub',
    description: 'Show your repos and contributions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    description: 'Link your builder presence',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export default function ConnectedAccounts({ settings, onPersist }) {
  const handleConnectToggle = (key) => {
    onPersist({
      connectedAccounts: {
        ...settings.connectedAccounts,
        [key]: !settings.connectedAccounts[key],
      },
    });
  };

  return (
    <SettingsSection
      id="settings-connected"
      kicker="Integrations"
      title="Connected accounts"
      description="Link profiles to enrich your builder identity"
      icon={<LinkIcon />}
    >
      <div className="settings-connected-list">
        {CONNECTED_ACCOUNTS.map((acct, index) => {
          const isConnected = settings.connectedAccounts[acct.key];
          return (
            <div key={acct.key} className="settings-connected-item">
              {index > 0 && <div className="settings-divider" aria-hidden="true" />}
              <div className="settings-connected-row">
                <div className="settings-connected-main">
                  <span className="settings-connected-icon">{acct.icon}</span>
                  <div className="settings-connected-copy">
                    <span className="settings-connected-label">{acct.label}</span>
                    <span className="settings-connected-desc">{acct.description}</span>
                  </div>
                  <span className={`settings-connected-badge${isConnected ? ' is-connected' : ''}`}>
                    {isConnected ? 'Connected' : 'Not connected'}
                  </span>
                </div>
                <button
                  type="button"
                  className={`settings-connected-btn${isConnected ? ' is-disconnect' : ''}`}
                  onClick={() => handleConnectToggle(acct.key)}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </SettingsSection>
  );
}
