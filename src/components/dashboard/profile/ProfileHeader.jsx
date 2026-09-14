import { useState } from 'react';
import { saveSelectedAvatar } from '../../../lib/profileData.js';

export default function ProfileHeader({ profile, extended, onAvatarChange }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const { identity, avatar, track } = extended;

  const handleAvatarSelect = (avatarId) => {
    const selected = saveSelectedAvatar(avatarId);
    onAvatarChange?.(selected);
    setPickerOpen(false);
  };

  const avatarSrc = profile.avatarUrl || avatar.src;
  const timezoneDisplay = identity.timezone && identity.timezoneLabel !== 'Not set'
    ? identity.timezoneLabel
    : null;

  return (
    <header className="profile-identity" aria-labelledby="dashboard-profile-title">
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
          <div className="profile-identity-title-row">
            <div className="profile-identity-names">
              <h1 id="dashboard-profile-title" className="profile-identity-name">
                {identity.name}
              </h1>
              <p className="profile-identity-handle">{identity.username}</p>
            </div>
            <button
              type="button"
              className="profile-identity-edit-btn"
              onClick={() => setPickerOpen((open) => !open)}
            >
              Edit Profile
            </button>
          </div>

          <p className="profile-identity-bio">{identity.bio}</p>

          <div className="profile-identity-meta">
            {identity.location && (
              <span className="profile-identity-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {identity.location}
              </span>
            )}
            {timezoneDisplay && (
              <span className="profile-identity-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {timezoneDisplay}
              </span>
            )}
            {track?.label && (
              <span className="profile-identity-track">{track.label}</span>
            )}
          </div>
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
