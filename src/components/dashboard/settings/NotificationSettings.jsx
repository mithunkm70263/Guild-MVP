import SettingsSection from './SettingsSection.jsx';
import SettingsToggle from './SettingsToggle.jsx';

const NOTIFICATION_TOGGLES = [
  { key: 'podReminders', label: 'Pod session reminders', description: 'Before your trio sync' },
  { key: 'sessionAlerts', label: 'Live session alerts', description: 'When a pod member goes live' },
  { key: 'weeklyDigest', label: 'Weekly digest', description: 'Sunday summary of pod activity' },
  { key: 'artifactNudges', label: 'Artifact nudges', description: 'Reminders to post your weekly ship' },
  { key: 'emailDigest', label: 'Email digest', description: 'Weekly email roundup' },
  { key: 'pushUpdates', label: 'Push notifications', description: 'Browser push for urgent updates' },
];

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function NotificationSettings({ settings, onPersist }) {
  const handleNotificationToggle = (key, value) => {
    onPersist({ notifications: { ...settings.notifications, [key]: value } });
  };

  return (
    <SettingsSection
      id="settings-notifications"
      kicker="Alerts"
      title="Notifications"
      description="Choose what reaches you and when"
      icon={<BellIcon />}
    >
      <div className="settings-toggle-list">
        {NOTIFICATION_TOGGLES.map((toggle, index) => (
          <div key={toggle.key} className="settings-toggle-row">
            {index > 0 && <div className="settings-divider" aria-hidden="true" />}
            <SettingsToggle
              id={`settings-notif-${toggle.key}`}
              label={toggle.label}
              description={toggle.description}
              checked={settings.notifications[toggle.key]}
              onChange={(value) => handleNotificationToggle(toggle.key, value)}
            />
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}
