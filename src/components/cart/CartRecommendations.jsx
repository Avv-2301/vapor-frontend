import Icon from "../common/Icon";
import { Price, Platforms } from "../home/StoreUI";

export default function CartRecommendations({ games, onAdd, onOpen }) {
  return (
    <section className="cart-recommendations">
      <div className="cart-recommendations-heading"><div><span>Complete your experience</span><h2>Recommended for your cart</h2></div><p>Picked from the Vapor store</p></div>
      <div className="cart-recommendation-grid">
        {games.map((game) => (
          <article className="cart-recommendation-card" key={game.id}>
            <button type="button" className="cart-recommendation-art" onClick={() => onOpen(game)}><img src={game.image} alt={game.title} /><span>{game.label || game.categories?.[0]}</span></button>
            <div className="cart-recommendation-content">
              <button className="cart-recommendation-title" type="button" onClick={() => onOpen(game)}>{game.title}</button>
              <p>{game.description}</p>
              <div className="cart-recommendation-bottom"><Platforms mac={game.mac} /><Price game={game} /><button type="button" onClick={() => onAdd(game)}><Icon name="cart" size={14} /> Add</button></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
