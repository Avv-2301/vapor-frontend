import Icon from "../common/Icon";

export default function LibraryGameGrid({ games, selectedGameId, gameStats, onSelect }) {
  return (
    <section className="library-games-section">
      <div className="library-games-heading">
        <div><span className="library-eyebrow">Purchased titles</span><h2>Your Games</h2></div>
        <span>{games.length} titles</span>
      </div>
      <div className="library-game-grid">
        {games.map((game) => (
          <button key={game.id} type="button" className={`library-game-tile ${selectedGameId === game.id ? "active" : ""}`} onClick={() => onSelect(game.id)}>
            <img src={game.image} alt="" loading="lazy" />
            <span className="library-tile-details">
              <strong>{game.title}</strong>
              <small><Icon name="checkCircle" size={12} /> Purchased <span>{gameStats[game.id]?.playTime || "0 hours"}</span></small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
