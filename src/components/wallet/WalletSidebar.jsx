import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

export default function WalletSidebar({ onAction }) {
  return (
    <aside className="wallet-sidebar">
      <section className="wallet-side-card wallet-about-card">
        <h2><Icon name="info" size={17} /> About Vapor Wallet</h2>
        <ul>
          <li><Icon name="hourglass" size={16} /><span><strong>Funds never expire</strong><small>Your wallet balance remains active with no maintenance or dormancy fees.</small></span></li>
          <li><Icon name="lock" size={16} /><span><strong>Universal eligibility</strong><small>Use funds during store checkouts and for supported in-game purchases.</small></span></li>
          <li><Icon name="sparkles" size={16} /><span><strong>Fast checkout</strong><small>Keep funds ready for the next seasonal sale or new release.</small></span></li>
        </ul>
      </section>

      <section className="wallet-side-card wallet-security-card">
        <h2><span>Security &amp; limits</span><Icon name="shield" size={17} /></h2>
        <div className="wallet-guard-row"><span><Icon name="lock" size={15} /> Vapor Guard Mobile</span><strong>Enabled</strong></div>
        <div className="wallet-spending-label"><span>Daily spending cap used</span><strong>{formatInr(142.5)} / {formatInr(2000)}</strong></div>
        <div className="wallet-spending-track"><i /></div>
        <small>Protects against unauthorized bulk purchases. Resets at 00:00 UTC.</small>
        <button type="button" onClick={() => onAction("Wallet FAQ & support articles")}>Wallet FAQ &amp; support articles <Icon name="right" size={13} /></button>
        <button type="button" onClick={() => onAction("Payment methods")}>Manage payment methods <Icon name="right" size={13} /></button>
      </section>
    </aside>
  );
}
