import Icon from "../common/Icon";

export default function LibraryPlayControls({ stats, onAction, onStorePage }) {
  return (
    <section className="library-play-panel" aria-label="Game controls">
      <div className="library-play-top">
        <button type="button" className="library-play-button" onClick={() => onAction("Launching games")}>
          <Icon name="play" size={19} /> <span>Play</span>
        </button>
        <div className="library-stat"><span>Last Played</span><strong>{stats?.lastPlayed || "Never"}</strong></div>
        <div className="library-stat"><span>Play Time</span><strong>{stats?.playTime || "0 hours"}</strong></div>
        <div className="library-stat library-cloud-stat"><span>Cloud Status</span><strong><Icon name="cloud" size={16} /> {stats?.cloud || "Ready to sync"}</strong></div>
      </div>
      <div className="library-play-bottom">
        <div className="library-tool-actions">
          <button type="button" aria-label="Controller settings" title="Controller settings" onClick={() => onAction("Controller settings")}><Icon name="gamepad" size={17} /></button>
          <button type="button" aria-label="Game settings" title="Game settings" onClick={() => onAction("Game settings")}><Icon name="settings" size={17} /></button>
          <button type="button" aria-label="Game information" title="Game information" onClick={() => onAction("Game information")}><Icon name="info" size={17} /></button>
        </div>
        <span className="library-play-divider" />
        <button type="button" className="library-secondary-action" onClick={onStorePage}>Store Page</button>
        <button type="button" className="library-secondary-action" onClick={() => onAction("Community hub")}>Community Hub</button>
      </div>
    </section>
  );
}
