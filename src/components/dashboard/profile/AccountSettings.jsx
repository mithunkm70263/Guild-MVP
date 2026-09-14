import { useState } from 'react';
import ProfileSection from './ProfileSection.jsx';
import { saveProfileSettings } from '../../../lib/profileData.js';

const CONNECTED_ACCOUNTS = [
  { key: 'github', label: 'GitHub', icon: '⌘' },
  { key: 'twitter', label: 'Twitter / X', icon: '𝕏' },
];

export default function AccountSettings({ extended, onSettingsChange }) {
  const [settings, setSettings] = useState(extended.settings);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { account } = extended;

  const handleConnectToggle = (key) => {
    const next = saveProfileSettings({
      connectedAccounts: {
        ...settings.connectedAccounts,
        [key]: !settings.connectedAccounts[key],
      },
    });
    setSettings(next);
    onSettingsChange?.(next);
  };

  return (
    <ProfileSection
      id="profile-account"
      kicker="Account"
      title="Account settings"
      className="profile-account"
      variant="default"
    >
      <div className="profile-account-grid">
        <div className="profile-account-field">
          <span className="profile-settings-label">Email</span>
          <p className="profile-account-value">
            {account.email || 'Not signed in'}
          </p>
        </div>

        <div className="profile-account-field">
          <span className="profile-settings-label">Password</span>
          <button type="button" className="profile-account-action" disabled>
            Change password
            <span className="profile-edit-soon">Soon</span>
          </button>
        </div>

        <div className="profile-account-field profile-account-field--full">
          <span className="profile-settings-label">Connected accounts</span>
          <div className="profile-connected-list">
            {CONNECTED_ACCOUNTS.map((acct) => (
              <div key={acct.key} className="profile-connected-row">
                <div className="profile-connected-copy">
                  <span className="profile-connected-icon" aria-hidden="true">{acct.icon}</span>
                  <span className="profile-connected-label">{acct.label}</span>
                  <span className={`profile-connected-status${settings.connectedAccounts[acct.key] ? ' is-connected' : ''}`}>
                    {settings.connectedAccounts[acct.key] ? 'Connected' : 'Not connected'}
                  </span>
                </div>
                <button
                  type="button"
                  className="profile-connected-btn"
                  onClick={() => handleConnectToggle(acct.key)}
                >
                  {settings.connectedAccounts[acct.key] ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-danger-zone profile-account-field--full">
          <h3 className="profile-danger-title">Danger zone</h3>
          <div className="profile-danger-actions">
            <div className="profile-danger-row">
              <div className="profile-danger-copy">
                <span className="profile-danger-label">Leave current pod</span>
                <p>Exit {account.currentPod}. You can rejoin another pod next cycle.</p>
              </div>
              {confirmLeave ? (
                <div className="profile-danger-confirm">
                  <button type="button" className="profile-danger-btn profile-danger-btn--warn">
                    Confirm leave
                  </button>
                  <button
                    type="button"
                    className="profile-danger-btn profile-danger-btn--cancel"
                    onClick={() => setConfirmLeave(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="profile-danger-btn profile-danger-btn--warn"
                  onClick={() => setConfirmLeave(true)}
                >
                  Leave pod
                </button>
              )}
            </div>

            <div className="profile-danger-row">
              <div className="profile-danger-copy">
                <span className="profile-danger-label">Delete account</span>
                <p>Permanently remove your Guild account and all data.</p>
              </div>
              {confirmDelete ? (
                <div className="profile-danger-confirm">
                  <button type="button" className="profile-danger-btn profile-danger-btn--danger">
                    Confirm delete
                  </button>
                  <button
                    type="button"
                    className="profile-danger-btn profile-danger-btn--cancel"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="profile-danger-btn profile-danger-btn--danger"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProfileSection>
  );
}
