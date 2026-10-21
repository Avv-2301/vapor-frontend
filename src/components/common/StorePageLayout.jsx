import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WishlistDialog from "./WishlistDialog";

export default function StorePageLayout({
  query,
  onSearch,
  onAction,
  wishlistCount,
  user,
  onNavigate,
  onSignOut,
  children,
}) {
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const handleAction = (action) => {
    if (action === "Wishlist") {
      setWishlistOpen(true);
      return;
    }
    onAction?.(action);
  };

  return (
    <>
      <Header
        query={query}
        onSearch={onSearch}
        onAction={handleAction}
        wishlistCount={wishlistCount}
        user={user}
        onNavigate={onNavigate}
        onSignOut={onSignOut}
      />
      <WishlistDialog
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onNavigate={onNavigate}
      />
      {children}
      <Footer onAction={handleAction} />
    </>
  );
}
