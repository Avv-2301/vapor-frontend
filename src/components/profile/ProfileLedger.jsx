import { useMemo, useState } from "react";
import { profileTransactions } from "../../data/profile";
import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

const filters = ["All Activity", "Store Games", "Community Market", "Wallet Top-Ups"];
const amountLabel = (amount) => `${amount > 0 ? "+" : "−"}${formatInr(Math.abs(amount))}`;

export default function ProfileLedger({ onAction }) {
  const [filter, setFilter] = useState(filters[0]);
  const transactions = useMemo(
    () => filter === filters[0] ? profileTransactions : profileTransactions.filter((entry) => entry.type === filter),
    [filter],
  );

  return (
    <section className="profile-panel profile-ledger" id="profile-ledger">
      <div className="profile-panel-heading profile-ledger-heading"><div><Icon name="receipt" size={17} /><h2>Recent Purchases &amp; Wallet Ledger</h2></div><div><button type="button" aria-label="Download invoices" onClick={() => onAction("Download invoices")}><Icon name="download" size={16} /></button><button type="button" aria-label="Print ledger" onClick={() => onAction("Print ledger")}><Icon name="printer" size={16} /></button></div></div>
      <div className="profile-ledger-tabs" role="tablist" aria-label="Filter transactions">
        {filters.map((item) => <button type="button" role="tab" aria-selected={filter === item} className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}
      </div>
      <div className="profile-transaction-list">
        {transactions.length ? transactions.map((transaction) => (
          <article className="profile-transaction" key={transaction.title}>
            <div className="profile-transaction-icon"><Icon name={transaction.icon} size={18} /></div>
            <div className="profile-transaction-copy"><strong>{transaction.title}</strong><span>{transaction.date} · {transaction.detail}</span></div>
            <div className="profile-transaction-result"><strong className={transaction.amount > 0 ? "credit" : "debit"}>{amountLabel(transaction.amount)}</strong><span>Balance: {formatInr(transaction.balance)}</span></div>
            <span className="profile-transaction-status">{transaction.status}</span>
          </article>
        )) : <p className="profile-no-transactions">No transactions in this category.</p>}
      </div>
      <div className="profile-ledger-footer"><span>Showing {transactions.length} of 64 total transactions this year</span><button type="button" onClick={() => onAction("Complete wallet ledger")}>View complete ledger &amp; official receipts <Icon name="right" size={14} /></button></div>
    </section>
  );
}
