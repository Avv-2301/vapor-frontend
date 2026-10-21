import { profileBadges } from "../../data/profile";
import Icon from "../common/Icon";

export default function ProfileBadges({ onAction }) {
  return (
    <section className="profile-panel profile-badges" id="profile-badges">
      <div className="profile-panel-heading"><div><Icon name="shield" size={18} /><h2>Badges &amp; Recognition</h2></div><button type="button" onClick={() => onAction("All profile badges")}>View all (48)</button></div>
      <div className="profile-badge-grid">
        {profileBadges.map((badge) => (
          <article className={`profile-badge ${badge.tone}`} key={badge.title}>
            <div><Icon name={badge.icon} size={25} /></div>
            <span><strong>{badge.title}</strong><small>{badge.detail}</small><em>{badge.note}</em></span>
          </article>
        ))}
      </div>
    </section>
  );
}
