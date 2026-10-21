import { useEffect, useState } from "react";
import Icon from "../../components/common/Icon";
import StorePageLayout from "../../components/common/StorePageLayout";
import WalletBalanceCard from "../../components/wallet/WalletBalanceCard";
import WalletFundOptions from "../../components/wallet/WalletFundOptions";
import WalletRedeemCard from "../../components/wallet/WalletRedeemCard";
import WalletSidebar from "../../components/wallet/WalletSidebar";
import WalletTransactions from "../../components/wallet/WalletTransactions";
import useAuthSession from "../../hooks/useAuthSession";
import useWallet from "../../hooks/useWallet";
import { formatInr } from "../../utils/currency";
import { confirmStripeCheckout, createStripeCheckout, redeemGiftCard } from "../../api/walletApi";
import "./WalletPage.css";
import { useAppStore } from "../../stores/appStore";

export default function WalletPage({ onNavigate }) {
  const [user, signOut] = useAuthSession();
  const { wallet, loading: walletLoading, error: walletError, refresh: refreshWallet } = useWallet(user);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [redeemNotice, setRedeemNotice] = useState("");
  const wishlistCount = useAppStore((state) => state.wishlist.length);
  const loadWallet = useAppStore((state) => state.loadWallet);

  const onAction = (action) => setNotice(`${action} is not connected to a wallet service yet.`);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("stripe_session_id");
    if (!user?._id) return;
    if (!sessionId) {
      if (params.get("payment") === "cancelled") {
        setNotice("Stripe checkout was cancelled. You have not been charged.");
        window.history.replaceState({}, "", window.location.pathname);
      }
      return;
    }
    let active = true;
    setNotice("Confirming your Stripe payment…");
    confirmStripeCheckout(sessionId)
      .then(async (result) => {
        if (!active) return;
        if (result.purpose !== "top-up") throw new Error("This checkout was not a wallet top-up.");
        await loadWallet(user._id, true);
        setNotice(`${formatInr(result.amount || 0)} was added to your Vapor Wallet.`);
        window.history.replaceState({}, "", window.location.pathname);
      })
      .catch((error) => {
        if (active) {
          setNotice(error.message || "Stripe payment could not be confirmed. Contact support if you were charged.");
          window.history.replaceState({}, "", window.location.pathname);
        }
      });
    return () => { active = false; };
  }, [user?._id, loadWallet]);

  const addFunds = async (amount) => {
    setNotice("");
    try {
      const checkout = await createStripeCheckout("top-up", amount);
      if (!checkout.checkoutUrl) throw new Error("Stripe did not return a checkout link.");
      window.location.assign(checkout.checkoutUrl);
    } catch (error) {
      setNotice(error.message || "Could not start Stripe checkout.");
    }
  };
  const redeemCode = async (code) => {
    const normalizedCode = code.replace(/[^a-z0-9]/gi, "").toUpperCase();
    if (!normalizedCode) {
      setRedeemNotice("Enter a valid gift card code.");
      return false;
    }

    setRedeemNotice("Checking gift card…");
    try {
      const redemption = await redeemGiftCard(normalizedCode);
      await refreshWallet();
      setRedeemNotice(`${formatInr(redemption.amount)} has been added to your wallet.`);
      return true;
    } catch (error) {
      setRedeemNotice(error.message || "Gift card redemption failed.");
      return false;
    }
  };
  const focusRedeem = () => {
    document.getElementById("wallet-redeem")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <StorePageLayout
      query={query}
      onSearch={setQuery}
      onAction={onAction}
      wishlistCount={wishlistCount}
      user={user}
      onNavigate={onNavigate}
      onSignOut={signOut}
    >
      <main className="wallet-page container">
        <div className="wallet-breadcrumbs" aria-label="Breadcrumb">
          <button type="button" onClick={() => onNavigate("/")}>Home</button><span>/</span>
          <span>Account Details</span><span>/</span><strong>Vapor Wallet &amp; Balance</strong>
        </div>
        {!user ? (
          <section className="wallet-login-prompt">
            <Icon name="wallet" size={30} />
            <h1>Sign in to view your wallet</h1>
            <p>Your wallet balance and account activity are available after signing in.</p>
            <button type="button" onClick={() => onNavigate("/login")}>Sign in</button>
          </section>
        ) : (
          <>
            <div className="wallet-page-heading">
              <div>
                <h1>Vapor Wallet</h1>
                <p>Add funds to your Vapor Wallet to purchase games, expansions, in-game cosmetics, and Community Market trading cards.</p>
              </div>
              <a href="#wallet-transactions"><Icon name="receipt" size={15} /> View complete account ledger</a>
            </div>

            {notice && <div className="wallet-notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}

            {walletError && <div className="wallet-notice" role="alert">{walletError}</div>}
            <WalletBalanceCard balance={wallet?.balance} userName={user.name} onRedeem={focusRedeem} />

            <div className="wallet-content-grid">
              <div className="wallet-main-column">
                <WalletFundOptions onAddFunds={addFunds} />
                <WalletRedeemCard onRedeem={redeemCode} notice={redeemNotice} />
                <section className="wallet-payment-methods" aria-label="Accepted payment channels">
                  <h2>Accepted payment channels</h2>
                  <div>{["Razorpay", "Stripe"].map((method) => <span key={method}>{method}</span>)}</div>
                  <p>Stripe opens a secure checkout page for wallet top-ups. Funds are credited after Stripe confirms payment.</p>
                </section>
              </div>
              <WalletSidebar onAction={onAction} />
            </div>

            <WalletTransactions transactions={wallet?.transactions || []} loading={walletLoading} />
          </>
        )}
      </main>
    </StorePageLayout>
  );
}
