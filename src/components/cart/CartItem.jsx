import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

export default function CartItem({ game, onRemove, onWishlist, onOpen }) {
  const savings = Math.max(0, (game.original || game.price) - game.price);
  const discount = game.discount || (savings > 0 ? Math.round((savings / game.original) * 100) : 0);

  return (
    <article className="cart-item">
      <button className="cart-item-art" type="button" onClick={() => onOpen(game)} aria-label={`View ${game.title}`}>
        <img src={game.image} alt={game.title} />
        {game.label && <span>{game.label}</span>}
      </button>
      <div className="cart-item-content">
        <button className="cart-item-title" type="button" onClick={() => onOpen(game)}>{game.title}</button>
        <p>{game.edition || "Standard Edition"} · {game.tags?.slice(0, 2).join(" · ")}</p>
        <div className="cart-item-tags">{game.tags?.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="cart-item-bottom">
          <div className="cart-item-actions">
            <button type="button" onClick={() => onRemove(game.id)}><Icon name="trash" size={14} /> Remove</button>
            <button type="button" onClick={() => onWishlist(game)}><Icon name="bookmark" size={14} /> Move to wishlist</button>
          </div>
          <div className="cart-item-price">
            {savings > 0 && <span className="cart-discount">-{discount}%</span>}
            {savings > 0 && <del>{formatInr(game.original)}</del>}
            <strong>{formatInr(game.price)}</strong>
          </div>
        </div>
      </div>
    </article>
  );
}
