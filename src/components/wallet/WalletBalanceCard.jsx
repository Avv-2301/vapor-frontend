import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

export default function WalletBalanceCard({ balance, userName, onRedeem }) {
  const balanceLabel = Number.isFinite(balance) ? formatInr(balance) : "—";
  return (
    <section className="wallet-balance-card" aria-label="Wallet balance">
      <div className="wallet-balance-main">
        <div className="wallet-balance-icon"><Icon name="wallet" size={26} /></div>
        <div>
          <div className="wallet-balance-labels">
            <span>Available store funds</span>
            <span className="wallet-active-badge"><i /> Active &amp; ready</span>
          </div>
          <p className="wallet-balance-amount"><span>{balanceLabel}</span><small>INR</small></p>
          <p className="wallet-balance-user"><Icon name="shield" size={13} /> User: {userName} <span>•</span> Pending Funds: <strong>{formatInr(0)}</strong></p>
        </div>
      </div>
      <div className="wallet-balance-side">
        <div className="wallet-market-standing"><span>Market standing</span><strong><Icon name="checkCircle" size={14} /> Unlimited Store Tier</strong></div>
        <button className="wallet-secondary-button" type="button" onClick={onRedeem}><Icon name="card" size={15} /> Redeem Code</button>
      </div>
    </section>
  );
}
