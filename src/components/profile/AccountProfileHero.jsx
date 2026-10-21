import { useState } from "react";
import Icon from "../common/Icon";

const memberSince = (value) => {
  const date = value && new Date(value);
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "—";
};

export default function AccountProfileHero({ profile, user, onSave, saving }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => ({
      name: profile?.name || user?.name || "",
      profilePhoto: profile?.profilePhoto || "",
      quote: profile?.quote || "",
      city: profile?.city || "",
      profileType: profile?.profileType || "public",
    }));

  const updateField = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = async (event) => {
    event.preventDefault();
    if (await onSave(form)) setEditing(false);
  };

  return (
    <>
      <section className="profile-hero" aria-label="Player profile summary">
        <div className="profile-identity">
          <div className="profile-avatar-frame">
            {profile?.profilePhoto ? <img src={profile.profilePhoto} alt={(profile.name || user?.name) + " profile avatar"} /> : <span className="profile-avatar-fallback" aria-hidden="true">{(profile?.name || user?.name || "?").slice(0, 1).toUpperCase()}</span>}
            <span><i /> {profile?.profileType === "private" ? "Private" : "Public"}</span>
          </div>
          <div className="profile-identity-copy">
            <div className="profile-name-line"><h1>{profile?.name || user?.name}</h1><span className="profile-handle">Level {profile?.level ?? 1}</span>{profile?.city && <span className="profile-location"><Icon name="location" size={13} /> {profile.city}</span>}</div>
            <p className="profile-tagline">{profile?.quote || "Add a short profile quote to tell players about yourself."}</p>
            <p className="profile-real-name">Member since: <strong>{memberSince(profile?.createdAt)}</strong></p>
          </div>
        </div>
        <div className="profile-hero-actions"><div className="profile-action-buttons"><button type="button" className="profile-edit-button" onClick={() => { if (!editing) setForm({ name: profile?.name || user?.name || "", profilePhoto: profile?.profilePhoto || "", quote: profile?.quote || "", city: profile?.city || "", profileType: profile?.profileType || "public" }); setEditing((open) => !open); }}><Icon name="edit" size={15} /> {editing ? "Close editor" : "Edit Profile"}</button></div></div>
        <div className="profile-stats-strip">
          <div className="profile-stat lime"><span>Level</span><strong>{profile?.level ?? 1}</strong></div>
          <div className="profile-stat cyan"><span>Rank</span><strong>{profile?.rank ?? 1}</strong></div>
          <div className="profile-stat plain"><span>Visibility</span><strong>{profile?.profileType === "private" ? "Private" : "Public"}</strong></div>
        </div>
      </section>
      {editing && <form className="profile-editor" onSubmit={save}>
        <div className="profile-editor-heading"><div><Icon name="edit" size={17} /><h2>Edit profile</h2></div><span>Changes save to your account.</span></div>
        <label>Display name<input name="name" value={form.name || ""} maxLength={100} required onChange={updateField} /></label>
        <label>Profile photo URL<input name="profilePhoto" type="url" value={form.profilePhoto || ""} maxLength={2048} placeholder="https://…" onChange={updateField} /></label>
        <label>Quote<input name="quote" value={form.quote || ""} maxLength={25} placeholder="Up to 25 characters" onChange={updateField} /></label>
        <label>City<input name="city" value={form.city || ""} maxLength={100} onChange={updateField} /></label>
        <label>Visibility<select name="profileType" value={form.profileType || "public"} onChange={updateField}><option value="public">Public</option><option value="private">Private</option></select></label>
        <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
      </form>}
    </>
  );
}
