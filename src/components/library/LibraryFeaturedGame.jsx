import Icon from "../common/Icon";

export default function LibraryFeaturedGame({ game }) {
  return (
    <article className="library-featured-game" style={{ "--library-art": `url("${game.image}")` }}>
      <div className="library-featured-copy">
        <div className="library-game-tags">
          {(game.categories || []).slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}
          <span className="library-ready-tag"><Icon name="checkCircle" size={13} /> Ready to play</span>
        </div>
        <h2>{game.title}</h2>
      </div>
    </article>
  );
}
