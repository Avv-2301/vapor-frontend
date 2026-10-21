import Icon from "../common/Icon";

export default function FavoriteGameShowcase({ game, onNavigate }) {
  return (
    <section className="profile-showcase profile-panel" id="profile-showcase">
      <div className="profile-panel-heading"><div><Icon name="star" size={17} /><h2>Favorite Game Showcase</h2></div><span>Featured selection</span></div>
      <div className="favorite-game-art" style={{ backgroundImage: `linear-gradient(0deg, #101820f2 0%, #1018209c 31%, transparent 76%), url("${game.image}")` }}>
        <div className="favorite-game-meta"><div><span className="profile-game-tag">RPG / Cyberpunk</span><small>Released: 2023</small></div><h3>{game.title}</h3></div>
        <button type="button" onClick={() => onNavigate(`/game/${encodeURIComponent(game.id)}`)}>Store Page <Icon name="right" size={14} /></button>
      </div>
      <div className="favorite-game-stats">
        <div><span>Time on record</span><strong>84.6 <small>hours total</small></strong><em>12.4 hrs last two weeks</em></div>
        <div><span>Achievements <b>70%</b></span><strong>38 <small>/ 54 unlocked</small></strong><i className="profile-achievement-progress"><b /></i></div>
        <div><span>Game badges</span><strong className="profile-game-level">Level 5 <small>Foil craft</small></strong><em>+500 XP earned</em></div>
      </div>
    </section>
  );
}
