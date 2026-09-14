export default function SettingsSection({
  children,
  className = '',
  id,
  kicker,
  title,
  description,
  icon,
  variant = 'default',
}) {
  const variantClass = variant !== 'default' ? ` settings-section--${variant}` : '';

  return (
    <section
      id={id}
      className={`settings-section${variantClass}${className ? ` ${className}` : ''}`}
    >
      <header className="settings-section-head">
        {icon && (
          <span className="settings-section-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="settings-section-titles">
          {kicker && <span className="settings-section-kicker">{kicker}</span>}
          {title && <h2 className="settings-section-title">{title}</h2>}
          {description && <p className="settings-section-desc">{description}</p>}
        </div>
      </header>
      <div className="settings-section-body">
        {children}
      </div>
    </section>
  );
}
