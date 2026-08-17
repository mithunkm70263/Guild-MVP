const PALETTES = [
  ['#00ddff', '#8b5cf6'],
  ['#f6b13b', '#ff6b35'],
  ['#47f58b', '#00b894'],
  ['#ff6b9d', '#c44569'],
  ['#69efff', '#0984e3'],
];

function hashName(name) {
  return name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

export default function Avatar({ name, size = 52, className = '', online = false }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const [from, to] = PALETTES[hashName(name) % PALETTES.length];

  return (
    <div
      className={`dash-avatar ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      aria-hidden={className.includes('decorative')}
    >
      <span style={{ fontSize: size * 0.34 }}>{initials}</span>
      {online && <i className="dash-avatar-dot" aria-label="Online" />}
    </div>
  );
}
