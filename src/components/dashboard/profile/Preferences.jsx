import { useState } from 'react';
import ProfileSection from './ProfileSection.jsx';
import { saveProfileSettings } from '../../../lib/profileData.js';

const NOTIFICATION_TOGGLES = [
  { key: 'podReminders', label: 'Pod session reminders', description: 'Before your trio sync' },
  { key: 'sessionAlerts', label: 'Live session alerts', description: 'When a pod member goes live' },
  { key: 'weeklyDigest', label: 'Weekly digest', description: 'Sunday summary of pod activity' },
  { key: 'artifactNudges', label: 'Artifact nudges', description: 'Reminders to post your weekly ship' },
  { key: 'emailDigest', label: 'Email digest', description: 'Weekly email roundup' },
  { key: 'pushUpdates', label: 'Push notifications', description: 'Browser push for urgent updates' },
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

export default function Preferences({ extended, onSettingsChange }) {
  const [settings, setSettings] = useState(extended.settings);
  const [saved, setSaved] = useState(false);
  const { preferences } = extended;

  const persist = (updates) => {
    const next = saveProfileSettings(updates);
    setSettings(next);
    onSettingsChange?.(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleFeedbackStyle = (style) => {
    persist({ feedbackStyle: style });
  };

  const handleWorkingHours = (e) => {
    persist({ workingHours: e.target.value });
  };

  const handleFuturePods = (e) => {
    persist({ futurePodTypes: e.target.value });
  };

  const handleNotificationToggle = (key, value) => {
    persist({ notifications: { ...settings.notifications, [key]: value } });
  };

  return (
    <ProfileSection
      id="profile-preferences"
      kicker="Workflow"
      title="Preferences"
      className="profile-preferences"
    >
      <div className="profile-prefs-grid">
        <div className="profile-prefs-group">
          <label className="profile-settings-field" htmlFor="profile-working-hours">
            <span className="profile-settings-label">Preferred working hours</span>
            <textarea
              id="profile-working-hours"
              className="profile-settings-textarea"
              rows={2}
              placeholder="e.g. Mon–Fri 9am–1pm, evenings after 7pm"
              value={settings.workingHours || preferences.workingHours}
              onChange={handleWorkingHours}
            />
          </label>

          <div className="profile-settings-field">
            <span className="profile-settings-label">Feedback style</span>
            <div className="profile-feedback-tabs" role="tablist" aria-label="Feedback style">
              {preferences.feedbackStyles.map((style) => (
                <button
                  key={style}
                  type="button"
                  role="tab"
                  aria-selected={settings.feedbackStyle === style}
                  className={`profile-feedback-tab${settings.feedbackStyle === style ? ' is-active' : ''}`}
                  onClick={() => handleFeedbackStyle(style)}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <label className="profile-settings-field" htmlFor="profile-future-pods">
            <span className="profile-settings-label">Future pod preferences</span>
            <textarea
              id="profile-future-pods"
              className="profile-settings-textarea"
              rows={2}
              placeholder="e.g. AI SaaS founders, async-heavy, same timezone"
              value={settings.futurePodTypes || ''}
              onChange={handleFuturePods}
            />
          </label>
        </div>

        <div className="profile-prefs-group">
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
      </div>

      {saved && (
        <p className="profile-settings-saved" role="status">Preferences saved</p>
      )}
    </ProfileSection>
  );
}
