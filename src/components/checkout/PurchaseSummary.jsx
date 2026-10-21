import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

export default function PurchaseSummary({ games, subtotal, savings, total, onNavigate, termsAccepted, onTermsChange, submitting }) {
  return (
    <>
      <section className="checkout-panel checkout-summary" aria-labelledby="purchase-summary-title">
        <div className="checkout-summary-heading">
          <h2 id="purchase-summary-title"><Icon name="bag" size={21} /> Purchase Summary</h2>
          <span>{games.length} {games.length === 1 ? "item" : "items"}</span>
        </div>
        <div className="checkout-summary-items">
          {games.map((game) => (
            <article className="checkout-summary-item" key={game.id}>
              <img src={game.image || game.previews?.[0] || ""} alt="" />
              <div className="checkout-summary-game">
                <strong>{game.title}</strong>
                <span>{game.edition || "Standard Edition"}{game.discount ? <i> · −{game.discount}%</i> : ""}</span>
              </div>
              <div className="checkout-summary-price">
                {game.original > game.price && <del>{formatInr(game.original)}</del>}
                <strong>{formatInr(game.price)}</strong>
              </div>
            </article>
          ))}
        </div>
        <div className="checkout-totals">
          <div><span>Subtotal</span><strong>{formatInr(subtotal)}</strong></div>
          <div className="checkout-discount"><span>Promotional discounts</span><strong>−{formatInr(savings)}</strong></div>
          <div><span>Estimated tax</span><strong>{formatInr(0)} <small>(included)</small></strong></div>
          <div className="checkout-grand-total"><span>Total to pay</span><strong>{formatInr(total)}</strong></div>
        </div>
        <label className="checkout-terms">
          <input type="checkbox" required checked={termsAccepted} onChange={(event) => onTermsChange(event.target.checked)} />
          <span>I agree to the terms of the <strong>Vapor Subscriber Agreement</strong>. Digital content is made available after purchase.</span>
        </label>
        <button className="checkout-authorize-button" type="submit" disabled={submitting || games.length === 0}>
          <Icon name="lock" size={18} /> {submitting ? "Preparing checkout…" : `Authorize & Pay ${formatInr(total)}`}
        </button>
        <button className="checkout-return-link" type="button" onClick={() => onNavigate("/cart")}><Icon name="left" size={14} /> Return to Shopping Cart</button>
      </section>
      <section className="checkout-trust-panel" aria-label="Purchase benefits">
        <div><Icon name="clock" size={17} /><span><strong>14-Day Refund Policy</strong><small>Eligible purchases follow our refund policy.</small></span></div>
        <div><Icon name="bolt" size={17} /><span><strong>Instant Library Delivery</strong><small>Digital purchases appear in your Vapor library.</small></span></div>
        <div><Icon name="badge" size={17} /><span><strong>Vapor Deck Ready</strong><small>Compatible with Linux and handheld play.</small></span></div>
      </section>
    </>
  );
}
