import { useEffect, useRef } from "react";
import { useAppStore } from "../../stores/appStore";
import { Price } from "../home/StoreUI";
import Icon from "./Icon";
import "./WishlistDialog.css";

export default function WishlistDialog({ open, onClose, onNavigate }) {
  const dialog = useRef(null);
  const wishlist = useAppStore((state) => state.wishlist);
  const wishlistGames = useAppStore((state) => state.wishlistGames);
  const wishlistLoading = useAppStore((state) => state.wishlistLoading);
  const wishlistError = useAppStore((state) => state.wishlistError);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  const openGame = (game) => {
    onClose();
    onNavigate(`/game/${encodeURIComponent(game.id)}`);
  };

  return (
    <dialog
      ref={dialog}
      className="wishlist-dialog"
      aria-labelledby="wishlist-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <button className="icon-button wishlist-dialog-close" type="button" aria-label="Close wishlist" onClick={onClose}>
        <Icon name="close" />
      </button>
      <div className="wishlist-dialog-content">
        <span className="eyebrow">Vapor Store</span>
        <h2 id="wishlist-dialog-title">Your Wishlist</h2>
        {wishlistLoading && wishlistGames.length === 0 ? (
          <p className="wishlist-dialog-state" role="status">Loading your saved games…</p>
        ) : wishlistGames.length > 0 ? (
          <div className="wishlist-dialog-list">
            {wishlistGames.map((game) => (
              <button className="wishlist-dialog-game" key={game.id} type="button" onClick={() => openGame(game)}>
                <img src={game.image} alt="" />
                <span>{game.title}</span>
                <Price game={game} />
              </button>
            ))}
          </div>
        ) : wishlist.length > 0 ? (
          <p className="wishlist-dialog-state" role="status">Your saved games are being refreshed. Please reopen the wishlist in a moment.</p>
        ) : (
          <p className="wishlist-dialog-state">Your wishlist is empty. Use the heart on a game to save it here.</p>
        )}
        {wishlistError && <p className="wishlist-dialog-error" role="alert">{wishlistError}</p>}
      </div>
    </dialog>
  );
}
