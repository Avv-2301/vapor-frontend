import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/common/Icon";
import StorePageLayout from "../../components/common/StorePageLayout";
import BillingInformation from "../../components/checkout/BillingInformation";
import CheckoutProgress from "../../components/checkout/CheckoutProgress";
import PaymentMethods from "../../components/checkout/PaymentMethods";
import PurchaseSummary from "../../components/checkout/PurchaseSummary";
import useAuthSession from "../../hooks/useAuthSession";
import useWallet from "../../hooks/useWallet";
import useCheckoutCart from "../../hooks/useCheckoutCart";
import { useAppStore } from "../../stores/appStore";
import { getBillingAddress, saveBillingAddress } from "../../api/profileApi";
import { confirmStripeCheckout, createStripeCheckout, purchaseWithWallet } from "../../api/walletApi";
import { emptyCart } from "../../utils/cartStorage";
import "./CheckoutPage.css";

export default function CheckoutPage({ onNavigate }) {
  const [user, signOut] = useAuthSession();
  const [query, setQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notice, setNotice] = useState("");
  const [billingAddress, setBillingAddress] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const wishlistCount = useAppStore((state) => state.wishlist.length);
  const loadWallet = useAppStore((state) => state.loadWallet);
  const { wallet, refresh: refreshWallet } = useWallet(user);
  const { games, loading, error } = useCheckoutCart(user?._id);
  const balance = Number(wallet?.balance) || 0;
  const subtotal = useMemo(() => games.reduce((sum, game) => sum + (game.original || game.price), 0), [games]);
  const savings = useMemo(() => games.reduce((sum, game) => sum + Math.max(0, (game.original || game.price) - game.price), 0), [games]);
  const total = useMemo(() => games.reduce((sum, game) => sum + game.price, 0), [games]);

  useEffect(() => {
    let active = true;
    if (!user?._id) { setBillingAddress(null); return () => { active = false; }; }
    getBillingAddress().then((address) => { if (active) setBillingAddress(address); })
      .catch(() => { if (active) setBillingAddress(null); });
    return () => { active = false; };
  }, [user?._id]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("stripe_session_id");
    if (!sessionId || !user?._id) return;
    let active = true;
    setSubmitting(true);
    confirmStripeCheckout(sessionId)
      .then(async (result) => {
        if (!active) return;
        if (result.purpose !== "purchase") throw new Error("This checkout was not a game purchase.");
        emptyCart();
        await loadWallet(user._id, true);
        window.history.replaceState({}, "", window.location.pathname);
        onNavigate("/library");
      })
      .catch((error) => {
        if (active) {
          setNotice(error.message || "Stripe payment could not be confirmed. Contact support if you were charged.");
          window.history.replaceState({}, "", window.location.pathname);
        }
      })
      .finally(() => { if (active) setSubmitting(false); });
    return () => { active = false; };
  }, [user?._id, loadWallet]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("payment") === "cancelled") {
      setNotice("Stripe checkout was cancelled. You have not been charged.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleAction = (action) => setNotice(`${action} will be available when Vapor launches.`);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!termsAccepted) { setNotice("Please agree to the Vapor Subscriber Agreement to continue."); return; }
    if (!user) { setNotice("Sign in to complete your purchase."); return; }

    setSubmitting(true);
    setNotice("");
    try {
      const formData = new FormData(event.currentTarget);
      if (formData.get("saveAddress") === "on") {
        const address = Object.fromEntries(["firstName", "lastName", "email", "callingCode", "phone", "street", "unit", "city", "region", "postalCode", "country"].map((key) => [key, String(formData.get(key) || "").trim()]));
        const savedAddress = await saveBillingAddress(address);
        setBillingAddress(savedAddress);
      }
      if (paymentMethod === "stripe") {
        const checkout = await createStripeCheckout("purchase");
        if (!checkout.checkoutUrl) throw new Error("Stripe did not return a checkout link.");
        window.location.assign(checkout.checkoutUrl);
        return;
      }
      await purchaseWithWallet();
      emptyCart();
      await refreshWallet();
      onNavigate("/library");
    } catch (error) {
      setNotice(error.message || "The purchase could not be completed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StorePageLayout
      query={query}
      onSearch={setQuery}
      onAction={handleAction}
      wishlistCount={wishlistCount}
      user={user}
      onNavigate={onNavigate}
      onSignOut={signOut}
    >
      <CheckoutProgress onNavigate={onNavigate} user={user} />
      <main className="checkout-page">
        <form className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-main-column">
            {notice && <div className="checkout-notice" role="status"><Icon name="info" size={16} /> <span>{notice}</span><button type="button" aria-label="Dismiss message" onClick={() => setNotice("")}>×</button></div>}
            {error && <div className="checkout-notice error" role="alert"><Icon name="info" size={16} /> <span>{error}</span></div>}
            {loading && <div className="checkout-loading" role="status">Syncing your cart…</div>}
            {!loading && games.length === 0 ? (
              <section className="checkout-empty">
                <Icon name="cart" size={28} />
                <strong>Your cart is empty</strong>
                <span>Add a game before starting checkout.</span>
                <button type="button" onClick={() => onNavigate("/cart")}>Return to your cart</button>
              </section>
            ) : <BillingInformation key={`${user?._id || "guest"}-${billingAddress?.email || "new"}`} user={user} initialValue={billingAddress} />}
            {games.length > 0 && <PaymentMethods value={paymentMethod} onChange={setPaymentMethod} balance={balance} total={total} />}
          </div>
          <aside className="checkout-side-column">
            {games.length > 0 ? <PurchaseSummary
              games={games}
              subtotal={subtotal}
              savings={savings}
              total={total}
              onNavigate={onNavigate}
              termsAccepted={termsAccepted}
              onTermsChange={setTermsAccepted}
              submitting={submitting}
            /> : <section className="checkout-panel checkout-empty-side"><Icon name="bag" size={24} /><strong>No items to purchase</strong><span>Your purchase summary will appear here when you add a game.</span></section>}
          </aside>
        </form>
      </main>
    </StorePageLayout>
  );
}
