import { useState } from "react";
import Icon from "../common/Icon";

export default function WalletRedeemCard({ onRedeem, notice = "" }) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRedeem = async (event) => {
    event?.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (await onRedeem(code)) setCode("");
    } finally {
      setSubmitting(false);
    }
  };

  const updateCode = (value) => {
    const characters = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 34);
    setCode(characters.match(/.{1,5}/g)?.join(" - ") || "");
  };

  return (
    <section className="wallet-redeem-card" id="wallet-redeem" aria-labelledby="wallet-redeem-title">
      <div className="wallet-redeem-heading"><i /><h2 id="wallet-redeem-title">Redeem a Vapor Wallet code or gift card</h2></div>
      <p>Have a physical prepaid card or digital voucher? Enter its code to add funds to your balance.</p>
      <div className="wallet-redeem-form">
        <label className="wallet-code-input">
          <Icon name="card" size={18} />
          <span className="sr-only">Wallet code</span>
          <input
            value={code}
            onChange={(event) => updateCode(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") handleRedeem(event); }}
            placeholder="XXXXX - XXXXX - XXXXX"
            maxLength={52}
            autoComplete="off"
            disabled={submitting}
            required
          />
        </label>
        <button className="wallet-code-submit" type="button" onClick={handleRedeem} disabled={submitting || !code.replace(/[^a-z0-9]/gi, "").length}>
          {submitting ? "Redeeming…" : "Continue"} <Icon name="check" size={15} />
        </button>
      </div>
      {notice && <p className="wallet-redeem-notice" role="status">{notice}</p>}
      <div className="wallet-redeem-foot"><span><Icon name="lock" size={13} /> Secure redemption</span><b>•</b><span>Physical cards available at participating retailers</span></div>
    </section>
  );
}
