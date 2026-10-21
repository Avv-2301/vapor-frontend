import Icon from "../common/Icon";
import { formatInr } from "../../utils/currency";

const money = (amount) => formatInr(Math.abs(amount));

export default function WalletTransactions({ transactions = [], loading = false }) {
  return (
    <section className="wallet-transactions" id="wallet-transactions" aria-labelledby="wallet-transactions-title">
      <div className="wallet-section-heading">
        <div><i className="wallet-heading-mark" /><h2 id="wallet-transactions-title">Recent wallet transactions &amp; activity</h2></div>
        <span>Latest 10 transactions</span>
      </div>
      <div className="wallet-table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Description / item</th><th>Type</th><th>Amount</th><th>Balance</th></tr></thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td><span className="wallet-transaction-name"><Icon name={transaction.amount > 0 ? "checkCircle" : "gamepad"} size={14} />{transaction.description}</span></td>
                <td><span className={`wallet-transaction-type ${transaction.amount > 0 ? "credit" : ""}`}>{transaction.type.replaceAll("-", " ")}</span></td>
                <td className={transaction.amount > 0 ? "wallet-credit" : "wallet-debit"}>{transaction.amount > 0 ? "+" : "-"}{money(transaction.amount)}</td>
                <td className="wallet-transaction-balance">{money(transaction.balance)}</td>
              </tr>
            ))}
            {!loading && transactions.length === 0 && <tr><td colSpan="5" className="wallet-empty-transactions">No wallet transactions yet.</td></tr>}
            {loading && <tr><td colSpan="5" className="wallet-empty-transactions">Loading wallet activity…</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="wallet-ledger-footer"><span>Showing {transactions.length} of the latest 10 wallet transactions</span></div>
    </section>
  );
}
