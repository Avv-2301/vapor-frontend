import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/common/Icon";
import StorePageLayout from "../../components/common/StorePageLayout";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import CartRecommendations from "../../components/cart/CartRecommendations";
import { games } from "../../data/store";
import { getAllStoreProducts } from "../../api/productApi";
import useAuthSession from "../../hooks/useAuthSession";
import useCart from "../../hooks/useCart";
import useWallet from "../../hooks/useWallet";
import { addCartItem, emptyCart, getCartIds, removeCartItem, replaceCartIds } from "../../utils/cartStorage";
import { addCartProduct, clearRemoteCart, getCart as getRemoteCart, removeCartProduct } from "../../api/cartApi";
import { useAppStore } from "../../stores/appStore";
import "./CartPage.css";

const productToGame = (product) => {
  const onSale = product.discountPrice != null && Number(product.discountPrice) < Number(product.price);
  return {
    id: product.slug || product._id,
    cartIdentity: [product.slug, product._id, product.id, product.name].filter(Boolean),
    title: product.name,
    image: product.thumbnail || "",
    price: Number(onSale ? product.discountPrice : product.price) || 0,
    original: onSale ? Number(product.price) : null,
    discount: onSale ? Number(product.discountPercentage) || Math.round((1 - Number(product.discountPrice) / Number(product.price)) * 100) : 0,
    date: product.releaseDate,
    tags: product.tags?.length ? product.tags : product.genres || [],
    edition: product.publisher || product.developer,
    developer: product.developer,
  };
};

export default function CartPage({ onNavigate }) {
  const [user, signOut] = useAuthSession();
  const userId = user?._id;
  const { wallet } = useWallet(user);
  const cartIds = useCart();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [remoteCartLoaded, setRemoteCartLoaded] = useState(!userId);
  const [recommendationGames, setRecommendationGames] = useState([]);
  const [recommendationGamesLoaded, setRecommendationGamesLoaded] = useState(false);
  const wishlistCount = useAppStore((state) => state.wishlist.length);
  const addWishlistId = useAppStore((state) => state.addWishlistId);
  const [remoteGames, setRemoteGames] = useState([]);
  const localGames = useMemo(() => cartIds.map((id) => games.find((game) => game.id === id)).filter(Boolean), [cartIds]);
  const cartGames = useMemo(() => {
    const byId = new Map(localGames.map((game) => [game.id, game]));
    remoteGames.forEach((game) => byId.set(game.id, game));
    return [...byId.values()];
  }, [localGames, remoteGames]);
  const subtotal = cartGames.reduce((sum, game) => sum + game.price, 0);
  const savings = cartGames.reduce((sum, game) => sum + Math.max(0, (game.original || game.price) - game.price), 0);
  const cartIdentity = useMemo(() => {
    const ids = new Set(cartIds.filter(Boolean).map((id) => String(id).toLowerCase()));
    const titles = new Set();
    cartGames.forEach((game) => {
      [game.id, ...(game.cartIdentity || [])].filter(Boolean).forEach((id) => ids.add(String(id).toLowerCase()));
      if (game.title) titles.add(game.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, " "));
    });
    return { ids, titles };
  }, [cartIds, cartGames]);
  const recommendations = recommendationGames.filter((game) => {
    const title = game.title?.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
    const ids = [game.id, ...(game.cartIdentity || [])].filter(Boolean).map((id) => String(id).toLowerCase());
    return !ids.some((id) => cartIdentity.ids.has(id)) && !cartIdentity.titles.has(title);
  }).slice(0, 3);

  useEffect(() => {
    let active = true;
    getAllStoreProducts()
      .then((products) => { if (active) setRecommendationGames(products); })
      .catch(() => { if (active) setRecommendationGames([]); })
      .finally(() => { if (active) setRecommendationGamesLoaded(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!userId) {
      setRemoteCartLoaded(true);
      return undefined;
    }
    let active = true;
    setRemoteCartLoaded(false);
    getRemoteCart()
      .then(async (products) => {
        if (!active) return;
        const serverIds = new Set(products.map((product) => product.slug || product._id));
        const pendingIds = getCartIds().filter((id) => !serverIds.has(id));
        await Promise.allSettled(pendingIds.map((id) => addCartProduct(id)));
        if (!active) return;
        const syncedProducts = await getRemoteCart().catch(() => products);
        const remote = syncedProducts.map(productToGame);
        setRemoteGames(remote);
        replaceCartIds([...getCartIds(), ...remote.map((game) => game.id)]);
      })
      .catch(() => {})
      .finally(() => { if (active) setRemoteCartLoaded(true); });
    return () => { active = false; };
  }, [userId]);

  const removeItem = (id) => {
    removeCartItem(id);
    setRemoteGames((current) => current.filter((game) => game.id !== id));
    if (user) removeCartProduct(id).catch((error) => setNotice(error.message));
  };

  const clearCart = () => {
    emptyCart();
    setRemoteGames([]);
    if (user) clearRemoteCart().catch((error) => setNotice(error.message));
  };

  const moveToWishlist = async (game) => {
    try {
      await addWishlistId(game.id, game);
      removeItem(game.id);
    } catch (error) {
      setNotice(error.message || "Could not move this game to your wishlist.");
    }
  };

  const onAction = (action) => setNotice(`${action} is a frontend preview. Checkout is not connected.`);
  const onAddRecommendation = async (game) => {
    try {
      if (user) await addCartProduct(game.id);
      addCartItem(game.id);
    } catch (error) {
      setNotice(error.message || "The game could not be added to your cart.");
    }
  };

  return (
    <StorePageLayout query={query} onSearch={setQuery} onAction={onAction} wishlistCount={wishlistCount} user={user} onNavigate={onNavigate} onSignOut={signOut}>
      <main className="cart-page container">
        <div className="cart-page-heading">
          <div>
            <div className="cart-breadcrumb"><button type="button" onClick={() => onNavigate("/")}>Store</button><span>/</span><strong>Shopping Cart</strong></div>
            <h1>Your Shopping Cart <span>{cartGames.length} {cartGames.length === 1 ? "item" : "items"}</span></h1>
            <p><Icon name="info" size={14} /> Items in your cart are not reserved until checkout is completed.</p>
          </div>
          <div className="cart-secure-label"><Icon name="shield" size={16} /> Secure Vapor Checkout</div>
        </div>
        {notice && <div className="cart-notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}

        {cartGames.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-main-column">
              <section className="cart-items" aria-label="Cart items">
                {cartGames.map((game) => <CartItem key={game.id} game={game} onRemove={removeItem} onWishlist={moveToWishlist} onOpen={(item) => onNavigate(`/game/${encodeURIComponent(item.id)}`)} />)}
              </section>
              <div className="cart-list-actions"><button type="button" onClick={() => onNavigate("/")}><Icon name="left" size={15} /> Continue shopping</button><button type="button" onClick={clearCart}><Icon name="trash" size={14} /> Remove all items</button></div>
              <section className="cart-benefits"><div><Icon name="receipt" size={18} /><span><strong>14-day refunds</strong><small>Eligible purchases follow Vapor’s refund policy.</small></span></div><div><Icon name="cloud" size={18} /><span><strong>Instant Vapor sync</strong><small>Games appear in your library after checkout.</small></span></div><div><Icon name="sparkles" size={18} /><span><strong>Rewards</strong><small>Earn points on eligible purchases.</small></span></div></section>
            </div>
            <CartSummary count={cartGames.length} subtotal={subtotal} savings={savings} balance={wallet?.balance ?? 0} onCheckout={() => onNavigate("/checkout")} onGift={() => onAction("Gift checkout")} />
          </div>
        ) : (
          <section className="cart-empty"><div><Icon name="cart" size={34} /></div><h2>Your cart is empty</h2><p>Find your next favorite game and add it to your cart.</p><button type="button" onClick={() => onNavigate("/")}>Explore the store</button></section>
        )}

        {remoteCartLoaded && recommendationGamesLoaded && recommendations.length > 0 && <CartRecommendations games={recommendations} onAdd={onAddRecommendation} onOpen={(game) => onNavigate(`/game/${encodeURIComponent(game.id)}`)} />}
      </main>
    </StorePageLayout>
  );
}
