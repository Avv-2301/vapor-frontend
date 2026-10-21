import Icon from "../common/Icon";

export default function CheckoutProgress({ onNavigate, user }) {
  return (
    <section className="checkout-progress-band">
      <div className="checkout-progress-inner">
        <nav className="checkout-steps" aria-label="Checkout progress">
          <button type="button" onClick={() => onNavigate("/cart")}>
            <span className="checkout-step-number complete"><Icon name="check" size={13} /></span>
            <strong>1. Shopping Cart</strong>
          </button>
          <span className="checkout-step-chevron" aria-hidden="true">›</span>
          <span className="checkout-step-current" aria-current="step">
            <span className="checkout-step-number">2</span>
            <strong>2. Payment &amp; Billing</strong>
          </span>
          <span className="checkout-step-chevron" aria-hidden="true">›</span>
          <span className="checkout-step-upcoming">
            <span className="checkout-step-number">3</span>
            <span>3. Review &amp; Complete</span>
          </span>
        </nav>
        <div className="checkout-account-strip">
          <span className="checkout-encrypted"><Icon name="lock" size={14} /> 256-BIT SSL ENCRYPTED</span>
          {user && <span className="checkout-account-name">Account: <strong>{user.name}</strong></span>}
          <span className="checkout-currency">INR (₹)</span>
        </div>
      </div>
    </section>
  );
}
