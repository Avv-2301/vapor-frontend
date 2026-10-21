import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

export function Price({ game }) {
  const hasDiscount = Number(game.discount) > 0;
  return (
    <div className="price">
      {hasDiscount && <span className="discount">-{game.discount}%</span>}
      <span className="price-value">
        {hasDiscount && game.original != null && <del>{formatInr(game.original)}</del>}
        <strong>{formatInr(game.price)}</strong>
      </span>
    </div>
  );
}
export function Platforms({ mac = false, verified = false }) {
  return (
    <span className="platforms">
      <Icon name="monitor" size={15} />
      {mac && <Icon name="laptop" size={15} />}
      {verified && (
        <span className="verified">
          <Icon name="gamepad" size={12} /> VERIFIED
        </span>
      )}
    </span>
  );
}
export function SectionHeading({ title, badge, children }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {badge && <span className="section-badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}
export function GameCard({ game, onSelect }) {
  return (
    <button className="game-card" onClick={() => onSelect(game)}>
      <div className="card-art">
        <img src={game.image} alt={game.title} loading="lazy" />
        <span className={`offer-label ${game.id}`}>{game.label}</span>
      </div>
      <div className="card-content">
        <h3>{game.title}</h3>
        <p>{game.offer}</p>
        <div className="card-bottom">
          <Platforms mac={game.mac} />
          <Price game={game} />
        </div>
      </div>
    </button>
  );
}
