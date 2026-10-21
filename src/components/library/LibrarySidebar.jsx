import Icon from "../common/Icon";

export default function LibrarySidebar({
  games,
  selectedGameId,
  onSelectGame,
}) {
  return (
    <aside className="library-sidebar" aria-label="Purchased games">

      <div className="library-sidebar-section library-collections">
        <div className="library-section-label">Purchased Games</div>
        {games.map((game) => (
          <button key={game.id} type="button" className={`library-sidebar-item library-owned-game ${selectedGameId === game.id ? "selected" : ""}`} onClick={() => onSelectGame(game.id)}>
            <img src={game.image} alt="" loading="lazy" />
            <span>{game.title}</span>
            <Icon name="checkCircle" size={13} />
          </button>
        ))}
      </div>

      <div className="library-storage">
        <div className="library-storage-heading"><strong>Vapor Library</strong><span>Account library</span></div>
        <div className="library-storage-track"><span /></div>
        <small>{games.length} purchased {games.length === 1 ? "game" : "games"}</small>
      </div>
    </aside>
  );
}
