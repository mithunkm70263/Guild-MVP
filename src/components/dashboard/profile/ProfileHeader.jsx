import { useState } from 'react';
import { saveSelectedAvatar } from '../../../lib/profileData.js';

export default function ProfileHeader({ profile, extended, onAvatarChange }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { identity, avatar, track, statLine } = extended;

  const handleAvatarSelect = (avatarId) => {
    const selected = saveSelectedAvatar(avatarId);
    onAvatarChange?.(selected);
    setPickerOpen(false);
  };

  const avatarSrc = profile.avatarUrl || avatar.src;

  return (
    <header className="profile-header" aria-labelledby="dashboard-profile-title">
      <div className="profile-header-banner" aria-hidden="true" />

      <div className="profile-header-body">
        <div className="profile-header-top">
          <button
            type="button"
            className="profile-header-avatar-btn"
            onClick={() => setPickerOpen((open) => !open)}
            aria-expanded={pickerOpen}
            aria-label="Choose avatar"
          >
            <img
              src={avatarSrc}
              alt=""
              className="profile-header-avatar"
            />
            <span className="profile-header-avatar-edit">Change</span>
          </button>

          <button
            type="button"
            className="profile-header-edit-btn"
            onClick={() => setPickerOpen((open) => !open)}
          >
            Edit Profile
            <span className="profile-edit-soon">Soon</span>
          </button>
        </div>

        <div className="profile-header-identity">
          <h1 id="dashboard-profile-title" className="profile-header-name">
            {identity.name}
          </h1>
          <p className="profile-header-handle">{identity.username}</p>
          <p className="profile-header-bio">{identity.bio}</p>

          <div className="profile-header-meta">
            {identity.location && (
              <span className="profile-header-meta-item">
                <span aria-hidden="true">📍</span> {identity.location}
              </span>
            )}
            {identity.joinedLabel && (
              <span className="profile-header-meta-item">
                <span aria-hidden="true">📅</span> Joined {identity.joinedLabel}
              </span>
            )}
            {track?.label && (
              <span className="profile-header-track-pill">{track.label}</span>
            )}
          </div>

          <p className="profile-header-stats">{statLine}</p>
        </div>
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
    </header>
  );
}
