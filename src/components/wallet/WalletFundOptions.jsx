import { useState } from "react";
import { fundOptions } from "../../data/wallet";
import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

const formatAmount = formatInr;

export default function WalletFundOptions({ onAddFunds }) {
  const [customAmount, setCustomAmount] = useState("150.00");

  const submitCustomAmount = (event) => {
    event.preventDefault();
    const amount = Number(customAmount);
    if (Number.isFinite(amount) && amount >= 100 && amount <= 500) {
      onAddFunds(amount);
    }
  };

  return (
    <section className="wallet-funds-section" aria-labelledby="wallet-funds-title">
      <div className="wallet-section-heading">
        <div><i className="wallet-heading-mark" /><h2 id="wallet-funds-title">Add funds to your Vapor Wallet</h2></div>
        <span>Instant digital delivery</span>
      </div>
      <div className="wallet-fund-list">
        {fundOptions.map((option) => (
          <article className={`wallet-fund-option ${option.amount === 250 ? "popular" : ""}`} key={option.amount}>
            <div className="wallet-fund-icon">{formatInr(option.amount).replace(/\.00$/, "")}</div>
            <div className="wallet-fund-copy">
              <strong>{option.label} {option.badge && <small className={option.amount === 250 ? "popular-badge" : "tier-badge"}>{option.badge}</small>}</strong>
              <span>{option.description}</span>
            </div>
            <strong className="wallet-fund-price">{formatAmount(option.amount)}</strong>
            <button type="button" className="wallet-add-button" onClick={() => onAddFunds(option.amount)}>
              Add funds <Icon name="right" size={14} />
            </button>
          </article>
        ))}
      </div>
      <form className="wallet-custom-fund" onSubmit={submitCustomAmount}>
        <div className="wallet-fund-icon custom"><Icon name="edit" size={20} /></div>
        <div className="wallet-fund-copy">
          <strong>Enter custom amount</strong>
          <span>Minimum reload: {formatInr(100)} · Maximum reload: {formatInr(500)}</span>
        </div>
        <label className="wallet-custom-input">
          <span className="sr-only">Custom amount in Indian rupees</span>
          <span>₹</span>
          <input type="number" min="100" max="500" step="0.01" value={customAmount} onChange={(event) => setCustomAmount(event.target.value)} required />
        </label>
        <button className="wallet-custom-button" type="submit">Add custom</button>
      </form>
    </section>
  );
}
