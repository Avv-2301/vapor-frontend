import { profileAchievements } from "../../data/profile";
import Icon from "../common/Icon";

export default function AchievementShowcase() {
  return (
    <section className="profile-panel profile-achievements" id="profile-achievements">
      <div className="profile-panel-heading"><div><Icon name="trophy" size={18} /><h2>Rarest Achievement Showcase</h2></div><span>6 of 42 displayed</span></div>
      <div className="profile-achievement-grid">
        {profileAchievements.map((achievement) => (
          <article className={`profile-achievement ${achievement.tone}`} key={achievement.name}>
            <div><Icon name={achievement.icon} size={25} /></div>
            <strong title={achievement.name}>{achievement.name}</strong>
            <span>{achievement.rarity}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
