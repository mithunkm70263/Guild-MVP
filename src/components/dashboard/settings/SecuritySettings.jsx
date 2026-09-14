import SettingsSection from './SettingsSection.jsx';

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default function SecuritySettings({ account }) {
  return (
    <SettingsSection
      id="settings-security"
      kicker="Access"
      title="Security"
      description="Protect your account and sign-in"
      icon={<ShieldIcon />}
    >
      <div className="settings-fields">
        <div className="settings-field settings-field--inline">
          <div className="settings-field-copy">
            <span className="settings-field-label">Email address</span>
            <span className="settings-field-hint">Your primary sign-in email</span>
          </div>
          <p className="settings-inline-value">
            {account.email || 'Not signed in'}
          </p>
        </div>

        <div className="settings-divider" aria-hidden="true" />

        <div className="settings-field settings-field--inline">
          <div className="settings-field-copy">
            <span className="settings-field-label">Password</span>
            <span className="settings-field-hint">Update your account password</span>
          </div>
          <button type="button" className="settings-action-btn" disabled>
            Change password
            <span className="settings-soon-badge">Soon</span>
          </button>
        </div>
      </div>
    </SettingsSection>
  );
}
