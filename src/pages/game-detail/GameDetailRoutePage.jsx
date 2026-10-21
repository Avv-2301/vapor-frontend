import { useEffect, useRef, useState } from "react";
import DynamicGameDetailPage from "./DynamicGameDetailPage";
import StorePageLayout from "../../components/common/StorePageLayout";
import Icon from "../../components/common/Icon";
import useAuthSession from "../../hooks/useAuthSession";
import { addCartItem, removeCartItem } from "../../utils/cartStorage";
import { addCartProduct, removeCartProduct } from "../../api/cartApi";
import { getJson } from "../../api/apiClient";
import { useAppStore } from "../../stores/appStore";

const adaptFallback = (game) => ({
  slug: game.id,
  name: game.title,
  shortDescription: game.description,
  description: game.description,
  thumbnail: game.image,
  screenshots: game.previews || [],
  price: game.original || game.price,
  discountPrice: game.original && game.price < game.original ? game.price : null,
  discountPercentage: game.discount || 0,
  releaseDate: game.date,
  developer: game.developer,
  publisher: game.publisher,
  genres: game.tags || [],
  platform: game.platform || [],
  averageRating: null,
  reviewCount: 0,
});

export default function GameDetailRoutePage({ slug, fallbackGame, onNavigate }) {
  const detail = useAppStore((state) => state.gameDetails[slug]);
  const loadGameDetail = useAppStore((state) => state.loadGameDetail);
  const [user, signOut] = useAuthSession();
  const [query, setQuery] = useState("");
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const [notice, setNotice] = useState("");
  const [isOwned, setIsOwned] = useState(false);
  const [ownershipLoading, setOwnershipLoading] = useState(Boolean(user));
  const dialog = useRef(null);

  useEffect(() => {
    loadGameDetail(slug);
  }, [slug, loadGameDetail]);

  useEffect(() => {
    let active = true;
    if (!user?._id) {
      setIsOwned(false);
      setOwnershipLoading(false);
      return () => { active = false; };
    }
    setOwnershipLoading(true);
    getJson(`/library/ownership/${encodeURIComponent(slug)}`)
      .then((result) => {
        if (!active) return;
        const owned = Boolean(result.data?.owned);
        setIsOwned(owned);
        if (owned) {
          removeCartItem(slug);
          removeCartProduct(slug).catch(() => {});
        }
      })
      .catch(() => { if (active) setIsOwned(false); })
      .finally(() => { if (active) setOwnershipLoading(false); });
    return () => { active = false; };
  }, [slug, user?._id]);

  const game = detail?.game || (detail?.error && fallbackGame ? adaptFallback(fallbackGame) : null);
  const reviewsData = detail?.reviews;

  useEffect(() => {
    if (notice) dialog.current?.showModal();
    else dialog.current?.close();
  }, [notice]);

  const action = (title) => setNotice(title);
  const handleWishlist = (id, item) => toggleWishlist(id, item).catch((error) => setNotice(error.message || "Could not update your wishlist."));
  const addToCart = async (item) => {
    if (isOwned) return;
    try {
      if (user) await addCartProduct(item.id);
      addCartItem(item.id);
    } catch (error) {
      setNotice(error.message || "The cart could not sync with your account.");
    }
  };
  return (
    <StorePageLayout
      query={query}
      onSearch={setQuery}
      onAction={action}
      wishlistCount={wishlist.length}
      user={user}
      onNavigate={onNavigate}
      onSignOut={signOut}
    >
      {!detail?.loaded ? <main className="game-detail container"><p className="detail-load-state" role="status">Loading game details…</p></main> : game ? <DynamicGameDetailPage
          game={game}
          reviewsData={reviewsData}
          wishlist={wishlist}
          onWishlist={handleWishlist}
          onAction={action}
          onAddToCart={addToCart}
          isOwned={isOwned}
          ownershipLoading={ownershipLoading}
        /> : <main className="game-detail container"><p className="detail-load-state" role="alert">{detail?.error || "This game could not be loaded."}</p><button type="button" onClick={() => onNavigate("/")}>Back to store</button></main>}
      <dialog
        ref={dialog}
        className="store-dialog"
        aria-labelledby="detail-dialog-title"
        onCancel={() => setNotice("")}
        onClick={(event) => {
          if (event.target === dialog.current) setNotice("");
        }}
      >
        <button
          className="icon-button dialog-close"
          aria-label="Close dialog"
          onClick={() => setNotice("")}
        >
          <Icon name="close" />
        </button>
        <div className="dialog-content">
          <span className="eyebrow">Vapor Store</span>
          <h2 id="detail-dialog-title">{notice}</h2>
          <p>This feature will be available when Vapor launches.</p>
        </div>
      </dialog>
    </StorePageLayout>
  );
}
