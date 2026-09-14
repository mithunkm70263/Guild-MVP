import { useState } from 'react';
import ProfileSection from './ProfileSection.jsx';
import { saveProfileSettings, formatTimezone } from '../../../lib/profileData.js';

const TIMEZONE_OPTIONS = [
  { value: 'IST', label: 'IST – India (UTC+5:30)' },
  { value: 'PST', label: 'PST – Pacific (UTC−8)' },
  { value: 'MST', label: 'MST – Mountain (UTC−7)' },
  { value: 'CST', label: 'CST – Central (UTC−6)' },
  { value: 'EST', label: 'EST – Eastern (UTC−5)' },
  { value: 'GMT', label: 'GMT – London (UTC+0)' },
  { value: 'CET', label: 'CET – Europe (UTC+1)' },
  { value: 'JST', label: 'JST – Japan (UTC+9)' },
  { value: 'KST', label: 'KST – Korea (UTC+9)' },
  { value: 'AEST', label: 'AEST – Australia (UTC+10)' },
  { value: 'Other', label: 'Other' },
];

const NOTIFICATION_TOGGLES = [
  { key: 'podReminders', label: 'Pod session reminders', description: 'Get notified before your trio sync' },
  { key: 'sessionAlerts', label: 'Live session alerts', description: 'Alerts when a pod member goes live' },
  { key: 'weeklyDigest', label: 'Weekly digest', description: 'Summary of pod activity each Sunday' },
  { key: 'artifactNudges', label: 'Artifact nudges', description: 'Gentle reminders to post your weekly ship' },
];

function Toggle({ id, checked, onChange, label, description }) {
  return (
    <label className="profile-toggle" htmlFor={id}>
      <div className="profile-toggle-copy">
        <span className="profile-toggle-label">{label}</span>
        {description && <span className="profile-toggle-desc">{description}</span>}
      </div>
      <div className="profile-toggle-control">
        <input
          id={id}
          type="checkbox"
          className="profile-toggle-input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="profile-toggle-track" aria-hidden="true">
          <span className="profile-toggle-thumb" />
        </span>
      </div>
    </label>
  );
}

export default function ProfileSettings({ extended, onSettingsChange }) {
  const [settings, setSettings] = useState(extended.settings);
  const [saved, setSaved] = useState(false);
  const [trackRequestSent, setTrackRequestSent] = useState(settings.trackChangeRequested);

  const persist = (updates) => {
    const next = saveProfileSettings(updates);
    setSettings(next);
    onSettingsChange?.(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleTimezoneChange = (e) => {
    persist({ timezone: e.target.value });
  };

  const handleAvailabilityChange = (e) => {
    persist({ availability: e.target.value });
  };

  const handleNotificationToggle = (key, value) => {
    persist({
      notifications: { ...settings.notifications, [key]: value },
    });
  };

  const handleTrackChangeRequest = () => {
    persist({ trackChangeRequested: true });
    setTrackRequestSent(true);
  };

  return (
    <ProfileSection
      id="profile-settings"
      kicker="Preferences"
      title="Settings"
      subtitle="Availability, notifications, and cycle requests."
      className="profile-settings"
      hoverable={false}
    >
      <div className="profile-settings-grid">
        <div className="profile-settings-group">
          <h3 className="profile-settings-group-title">Availability</h3>

          <label className="profile-settings-field" htmlFor="profile-timezone">
            <span className="profile-settings-label">Timezone</span>
            <select
              id="profile-timezone"
              className="profile-settings-select"
              value={settings.timezone || extended.timezone || ''}
              onChange={handleTimezoneChange}
            >
              <option value="">Select timezone</option>
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </label>

          <label className="profile-settings-field" htmlFor="profile-availability">
            <span className="profile-settings-label">Live session windows</span>
            <textarea
              id="profile-availability"
              className="profile-settings-textarea"
              rows={3}
              placeholder="e.g. Tue/Thu 6–8pm IST, Sat morning"
              value={settings.availability || extended.liveSessionWindows || ''}
              onChange={handleAvailabilityChange}
            />
          </label>

          {settings.timezone && (
            <p className="profile-settings-hint">
              Current: {formatTimezone(settings.timezone)}
            </p>
          )}
        </div>

        <div className="profile-settings-group">
          <h3 className="profile-settings-group-title">Notifications</h3>
          <div className="profile-toggle-list">
            {NOTIFICATION_TOGGLES.map((toggle) => (
              <Toggle
                key={toggle.key}
                id={`profile-notif-${toggle.key}`}
                label={toggle.label}
                description={toggle.description}
                checked={settings.notifications[toggle.key]}
                onChange={(value) => handleNotificationToggle(toggle.key, value)}
              />
            ))}
          </div>
        </div>

        <div className="profile-settings-group profile-settings-group--full">
          <h3 className="profile-settings-group-title">Track & niche</h3>
          <div className="profile-track-change">
            <div className="profile-track-change-copy">
              <span className="profile-track-change-current">{extended.track.label}</span>
              <p>Track changes are reviewed between cycles. Your current focus stays locked until the cycle ends.</p>
            </div>
            <button
              type="button"
              className="profile-track-change-btn"
              onClick={handleTrackChangeRequest}
              disabled={trackRequestSent}
            >
              {trackRequestSent ? 'Request submitted' : 'Request track change'}
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <p className="profile-settings-saved" role="status">Settings saved</p>
      )}
    </ProfileSection>
  );
}
