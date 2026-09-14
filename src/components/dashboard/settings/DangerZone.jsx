import { useState } from 'react';
import SettingsSection from './SettingsSection.jsx';

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function DangerZone({ account }) {
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <SettingsSection
      id="settings-danger"
      kicker="Irreversible"
      title="Danger zone"
      description="Actions here cannot be undone"
      icon={<AlertIcon />}
      variant="danger"
    >
      <div className="settings-danger-actions">
        <div className="settings-danger-row">
          <div className="settings-danger-copy">
            <span className="settings-danger-label">Leave current pod</span>
            <p>Exit {account.currentPod}. You can rejoin another pod next cycle.</p>
          </div>
          {confirmLeave ? (
            <div className="settings-danger-confirm">
              <button type="button" className="settings-danger-btn settings-danger-btn--warn">
                Confirm leave
              </button>
              <button
                type="button"
                className="settings-danger-btn settings-danger-btn--cancel"
                onClick={() => setConfirmLeave(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="settings-danger-btn settings-danger-btn--warn"
              onClick={() => setConfirmLeave(true)}
            >
              Leave pod
            </button>
          )}
        </div>

        <div className="settings-divider settings-divider--danger" aria-hidden="true" />

        <div className="settings-danger-row">
          <div className="settings-danger-copy">
            <span className="settings-danger-label">Delete account</span>
            <p>Permanently remove your Guild account and all data.</p>
          </div>
          {confirmDelete ? (
            <div className="settings-danger-confirm">
              <button type="button" className="settings-danger-btn settings-danger-btn--danger">
                Confirm delete
              </button>
              <button
                type="button"
                className="settings-danger-btn settings-danger-btn--cancel"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="settings-danger-btn settings-danger-btn--danger"
              onClick={() => setConfirmDelete(true)}
            >
              Delete account
            </button>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}
