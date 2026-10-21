import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

const methods = [
  { id: "stripe", title: "Stripe", description: "Pay securely with Stripe", badge: "STRIPE", icon: "card" },
  { id: "wallet", title: "Vapor Wallet", description: "Use your available store balance", badge: "WALLET", icon: "wallet" },
];

export default function PaymentMethods({ value, onChange, balance, total }) {
  const balanceAfter = balance - total;
  return (
    <section className="checkout-panel payment-panel" aria-labelledby="payment-title">
      <div className="checkout-panel-heading">
        <h2 id="payment-title"><Icon name="card" size={21} /> Select Payment Method</h2>
      <span className="checkout-safe-pay">Secure checkout</span>
      </div>
      <div className="checkout-method-list" role="radiogroup" aria-label="Payment method">
        {methods.map((method) => (
          <div className={`checkout-method${value === method.id ? " selected" : ""}`} key={method.id}>
            <label className="checkout-method-main">
              <input type="radio" name="paymentMethod" value={method.id} checked={value === method.id} onChange={() => onChange(method.id)} />
              <span className="checkout-method-copy"><strong>{method.title}</strong><small>{method.description}</small></span>
              <span className="checkout-method-badge"><Icon name={method.icon} size={17} /> {method.badge}</span>
            </label>
            {value === method.id && method.id === "stripe" && (
              <div className="checkout-method-note">You’ll continue to Stripe’s secure payment page to pay the order total.</div>
            )}
            {value === method.id && method.id === "wallet" && (
              <div className="checkout-wallet-payment">
                <span>Available balance <strong>{formatInr(balance)}</strong></span>
                <span>After purchase <strong className={balanceAfter < 0 ? "shortfall" : "covered"}>{formatInr(balanceAfter)}</strong></span>
                {balanceAfter < 0 && <small>Your wallet balance doesn’t cover this order yet.</small>}
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="checkout-card-security"><Icon name="shield" size={16} /> Your card details are entered securely on Stripe.</p>
    </section>
  );
}
