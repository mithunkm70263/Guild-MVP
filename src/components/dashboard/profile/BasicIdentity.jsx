import { useState } from 'react';
import { saveSelectedAvatar } from '../../../lib/profileData.js';

export default function BasicIdentity({ profile, extended, onAvatarChange }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { identity, avatar } = extended;

  const handleAvatarSelect = (avatarId) => {
    const selected = saveSelectedAvatar(avatarId);
    onAvatarChange?.(selected);
    setPickerOpen(false);
  };

  const avatarSrc = profile.avatarUrl || avatar.src;

  return (
    <section className="profile-identity" aria-labelledby="dashboard-profile-title">
      <div className="profile-identity-main">
        <button
          type="button"
          className="profile-identity-avatar-btn"
          onClick={() => setPickerOpen((open) => !open)}
          aria-expanded={pickerOpen}
          aria-label="Choose avatar"
        >
          <img
            src={avatarSrc}
            alt=""
            className="profile-identity-avatar"
          />
          <span className="profile-identity-avatar-edit">Change</span>
        </button>

        <div className="profile-identity-copy">
          <h1 id="dashboard-profile-title" className="profile-identity-name">
            {identity.name}
          </h1>
          <p className="profile-identity-handle">{identity.username}</p>
          <p className="profile-identity-bio">{identity.bio}</p>
          <div className="profile-identity-meta">
            {identity.location && (
              <span className="profile-identity-meta-item">
                <span aria-hidden="true">📍</span> {identity.location}
              </span>
            )}
            {identity.timezoneLabel && identity.timezoneLabel !== 'Not set' && (
              <span className="profile-identity-meta-item">
                <span aria-hidden="true">🌐</span> {identity.timezoneLabel}
              </span>
            )}
            {identity.memberSince && (
              <span className="profile-identity-meta-item">
                Member since {identity.memberSince}
              </span>
            )}
          </div>
        </div>

        <button type="button" className="profile-identity-edit-btn" disabled>
          Edit Profile
          <span className="profile-edit-soon">Soon</span>
        </button>
      </div>

      {pickerOpen && (
        <div className="profile-avatar-picker" role="listbox" aria-label="Choose your avatar">
          <p className="profile-avatar-picker-label">Pick your builder character</p>
          <div className="profile-avatar-picker-grid">
            {extended.avatarOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={option.id === avatar.id}
                className={`profile-avatar-option${option.id === avatar.id ? ' is-selected' : ''}`}
                onClick={() => handleAvatarSelect(option.id)}
                title={option.label}
              >
                <img src={option.src} alt={option.label} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
