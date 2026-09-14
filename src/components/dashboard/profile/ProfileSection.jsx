export default function ProfileSection({
  children,
  className = '',
  id,
  kicker,
  title,
  subtitle,
  variant = 'default',
}) {
  const variantClass = variant !== 'default' ? ` profile-section--${variant}` : '';

  return (
    <section
      id={id}
      className={`profile-section${variantClass}${className ? ` ${className}` : ''}`}
    >
      {(kicker || title) && (
        <header className="profile-section-head">
          {kicker && <span className="profile-section-kicker">{kicker}</span>}
          {title && <h2 className="profile-section-title">{title}</h2>}
          {subtitle && <p className="profile-section-subtitle">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
