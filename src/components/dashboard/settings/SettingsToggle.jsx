export default function SettingsToggle({ id, checked, onChange, label, description }) {
  return (
    <label className="settings-toggle" htmlFor={id}>
      <div className="settings-toggle-copy">
        <span className="settings-toggle-label">{label}</span>
        {description && <span className="settings-toggle-desc">{description}</span>}
      </div>
      <div className="settings-toggle-control">
        <input
          id={id}
          type="checkbox"
          className="settings-toggle-input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="settings-toggle-track" aria-hidden="true">
          <span className="settings-toggle-thumb" />
        </span>
      </div>
    </label>
  );
}
