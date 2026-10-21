import { useState } from "react";
import Icon from "../common/Icon";
import { profileStats } from "../../data/profile";

export default function ProfileHero({ user, onAction }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.name || "Valkyrie_X");
  const [savedName, setSavedName] = useState(displayName);

  const saveProfile = (event) => {
    event.preventDefault();
    setSavedName(displayName.trim() || user.name || "Valkyrie_X");
    setEditing(false);
    onAction("Profile edits are a local preview and are not saved to your account.");
  };

  return (
    <>
      <section className="profile-hero" aria-label="Player profile summary">
        <div className="profile-identity">
          <div className="profile-avatar-frame">
            <img src="/images/avatar.jpg" alt={`${savedName} profile avatar`} />
            <span><i /> Online</span>
          </div>
          <div className="profile-identity-copy">
            <div className="profile-name-line"><h1>{savedName}</h1><span className="profile-handle">NEXUS_VIPER</span><span className="profile-location"><Icon name="location" size={13} /> Tokyo, Japan / Neo-Kyoto</span></div>
            <p className="profile-tagline">“Climbing leaderboards, benchmarking path tracing rigs, and hunting rare achievements across the neon grid. Cyberpunk &amp; Tactical RPG enthusiast.”</p>
            <p className="profile-real-name">Real Name: <strong>Elena “Viper” Vance</strong><i>•</i> Member since: <strong>October 2018</strong></p>
          </div>
        </div>
        <div className="profile-hero-actions">
          <div className="profile-action-buttons">
            <button type="button" className="profile-edit-button" onClick={() => setEditing(!editing)}><Icon name="edit" size={15} /> Edit Profile</button>
            <button type="button" className="profile-inventory-button" onClick={() => onAction("Inventory") }><Icon name="inventory" size={15} /> Inventory</button>
            <button type="button" className="profile-more-button" aria-label="More profile options" onClick={() => onAction("Profile options")}>•••</button>
          </div>
        </div>
        <div className="profile-stats-strip">
          {profileStats.map((stat) => (
            <a className={`profile-stat ${stat.tone}`} href={`#${stat.target}`} key={stat.label}>
              <span>{stat.label}</span><strong>{stat.value}</strong>
            </a>
          ))}
        </div>
      </section>
      {editing && (
        <form className="profile-editor" onSubmit={saveProfile}>
          <div className="profile-editor-heading"><div><Icon name="edit" size={17} /><h2>Quick profile customizer</h2></div><button type="button" aria-label="Close profile editor" onClick={() => setEditing(false)}>×</button></div>
          <label>Display name<input value={displayName} maxLength={100} onChange={(event) => setDisplayName(event.target.value)} /></label>
          <label>Profile theme<select defaultValue="Neo-Kyoto Midnight"><option>Neo-Kyoto Midnight</option><option>Cyberpunk Neon Cyan</option><option>Sub-Zero Slate</option><option>Obsidian Vault</option></select></label>
          <label>Primary showcase<select defaultValue="Favorite Game Showcase"><option>Favorite Game Showcase</option><option>Rarest Achievement Spotlight</option><option>Badge Collector Display</option></select></label>
          <button type="submit">Save preferences</button>
        </form>
      )}
    </>
  );
}
