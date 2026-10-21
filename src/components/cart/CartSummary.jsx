import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

export default function CartSummary({ count, subtotal, savings, balance, onCheckout, onGift }) {
  const balanceAfter = balance - subtotal;
  return (
    <aside className="cart-summary">
      <div className="cart-summary-heading"><h2>Order summary</h2><span>INR</span></div>
      <div className="cart-summary-line"><span>Subtotal ({count} {count === 1 ? "item" : "items"})</span><strong>{formatInr(subtotal)}</strong></div>
      <div className="cart-summary-line savings"><span><Icon name="tag" size={14} /> Sale savings</span><strong>−{formatInr(savings)}</strong></div>
      <div className="cart-summary-line"><span>Taxes</span><strong>Included</strong></div>
      <div className="cart-total"><span>Estimated total</span><strong>{formatInr(subtotal)}</strong></div>
      <button className="cart-checkout-button" type="button" disabled={count === 0} onClick={onCheckout}><Icon name="lock" size={16} /> Purchase for myself</button>
      <button className="cart-gift-button" type="button" disabled={count === 0} onClick={onGift}><Icon name="gift" size={16} /> Purchase as a gift</button>
      <div className="cart-wallet-balance">
        <div><span><Icon name="wallet" size={15} /> Vapor Wallet</span><strong>{formatInr(balance)}</strong></div>
        <div><span>Balance after purchase</span><strong className={balanceAfter < 0 ? "insufficient" : "sufficient"}>{formatInr(balanceAfter)}</strong></div>
        <p className={balanceAfter < 0 ? "insufficient" : "sufficient"}><Icon name={balanceAfter < 0 ? "info" : "checkCircle"} size={13} />{balanceAfter < 0 ? "Add funds to cover this purchase" : "Covered by your current wallet balance"}</p>
      </div>
      <p className="cart-checkout-note">Review your billing details and payment options at checkout.</p>
    </aside>
  );
}
