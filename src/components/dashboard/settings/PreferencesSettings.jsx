import SettingsSection from './SettingsSection.jsx';

function PreferencesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const FEEDBACK_HINTS = {
  Direct: 'Straight to the point — no fluff',
  Balanced: 'Honest feedback with context',
  Encouraging: 'Supportive tone, still actionable',
};

export default function PreferencesSettings({ settings, preferences, onPersist }) {
  const handleFeedbackStyle = (style) => {
    onPersist({ feedbackStyle: style });
  };

  const handleWorkingHours = (e) => {
    onPersist({ workingHours: e.target.value });
  };

  const handleFuturePods = (e) => {
    onPersist({ futurePodTypes: e.target.value });
  };

  return (
    <SettingsSection
      id="settings-preferences"
      kicker="Workflow"
      title="Preferences"
      description="Tune how Guild fits your builder rhythm"
      icon={<PreferencesIcon />}
    >
      <div className="settings-fields">
        <label className="settings-field" htmlFor="settings-working-hours">
          <span className="settings-field-label">Preferred working hours</span>
          <span className="settings-field-hint">When you&apos;re most available for pod syncs</span>
          <textarea
            id="settings-working-hours"
            className="settings-textarea"
            rows={2}
            placeholder="e.g. Mon–Fri 9am–1pm, evenings after 7pm"
            value={settings.workingHours || preferences.workingHours}
            onChange={handleWorkingHours}
          />
        </label>

        <div className="settings-field">
          <span className="settings-field-label">Feedback style</span>
          <span className="settings-field-hint">How your pod should deliver critique</span>
          <div className="settings-feedback-pills" role="tablist" aria-label="Feedback style">
            {preferences.feedbackStyles.map((style) => (
              <button
                key={style}
                type="button"
                role="tab"
                aria-selected={settings.feedbackStyle === style}
                className={`settings-feedback-pill${settings.feedbackStyle === style ? ' is-active' : ''}`}
                onClick={() => handleFeedbackStyle(style)}
              >
                <span className="settings-feedback-pill-label">{style}</span>
                <span className="settings-feedback-pill-hint">{FEEDBACK_HINTS[style]}</span>
              </button>
            ))}
          </div>
        </div>

        <label className="settings-field" htmlFor="settings-future-pods">
          <span className="settings-field-label">Future pod preferences</span>
          <span className="settings-field-hint">What you&apos;re looking for in your next trio</span>
          <textarea
            id="settings-future-pods"
            className="settings-textarea"
            rows={2}
            placeholder="e.g. AI SaaS founders, async-heavy, same timezone"
            value={settings.futurePodTypes || ''}
            onChange={handleFuturePods}
          />
        </label>
      </div>
    </SettingsSection>
  );
}
