import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../../lib/authRouting.js';
import SettingsSection from './SettingsSection.jsx';

function LogOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function LogoutSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err?.message || 'Could not sign out. Please try again.');
      setLoading(false);
    }
  };

  return (
    <SettingsSection
      id="settings-logout"
      kicker="Session"
      title="Sign out"
      description="End your current session on this device"
      icon={<LogOutIcon />}
    >
      <div className="settings-logout-row">
        <p className="settings-logout-copy">
          You&apos;ll need to sign in again to access your dashboard.
        </p>
        <button
          type="button"
          className="settings-logout-btn"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? 'Signing out…' : 'Log out'}
        </button>
      </div>
      {error && (
        <p className="settings-logout-error" role="alert">
          {error}
        </p>
      )}
    </SettingsSection>
  );
}
