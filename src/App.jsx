import { useEffect, useState } from "react";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import GameDetailRoutePage from "./pages/game-detail/GameDetailRoutePage";
import LibraryPage from "./pages/library/LibraryPage";
import WalletPage from "./pages/wallet/WalletPage";
import ProfilePage from "./pages/profile/ProfilePage";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import { games } from "./data/store";
import { useAppStore } from "./stores/appStore";
import { getCart } from "./api/cartApi";

export default function App() {
  const pathname = useAppStore((state) => state.pathname);
  const setPathname = useAppStore((state) => state.setPathname);
  const user = useAppStore((state) => state.user);
  const cartIds = useAppStore((state) => state.cartIds);
  const authReady = useAppStore((state) => state.authReady);
  const initializeAuth = useAppStore((state) => state.initializeAuth);
  const replaceCartIds = useAppStore((state) => state.replaceCartIds);
  const [cartSyncUserId, setCartSyncUserId] = useState(null);

  useEffect(() => {
    initializeAuth();
    const syncPathname = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", syncPathname);
    return () => window.removeEventListener("popstate", syncPathname);
  }, [initializeAuth, setPathname]);

  const isAuthRoute = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!authReady || !user || !isAuthRoute) return;
    window.history.replaceState({}, "", "/");
    setPathname("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [authReady, user, isAuthRoute, setPathname]);

  useEffect(() => {
    if (!authReady) return undefined;
    if (!user?._id) {
      setCartSyncUserId("guest");
      return undefined;
    }

    let active = true;
    setCartSyncUserId(null);
    getCart()
      .then((items) => {
        if (active) {
          const current = useAppStore.getState().cartIds;
          replaceCartIds([...current, ...items.map((item) => item.slug || item._id)]);
        }
      })
      .catch(() => {})
      .finally(() => { if (active) setCartSyncUserId(user._id); });
    return () => { active = false; };
  }, [authReady, user?._id, replaceCartIds]);

  const cartReady = authReady && (user?._id ? cartSyncUserId === user._id : cartSyncUserId === "guest");

  useEffect(() => {
    if (pathname !== "/cart" || !cartReady || cartIds.length > 0) return;
    window.history.replaceState({}, "", "/");
    setPathname("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, cartReady, cartIds.length, setPathname]);

  const navigateTo = (path) => {
    if (path !== window.location.pathname) {
      window.history.pushState({}, "", path);
      setPathname(path);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (user && isAuthRoute) {
    return <HomePage onNavigate={navigateTo} />;
  }

  if (pathname === "/login") {
    return <LoginPage onNavigate={navigateTo} />;
  }

  if (pathname === "/register") {
    return <RegisterPage onNavigate={navigateTo} />;
  }

  if (pathname === "/library") {
    return <LibraryPage onNavigate={navigateTo} />;
  }

  if (pathname === "/wallet") {
    return <WalletPage onNavigate={navigateTo} />;
  }

  if (pathname === "/cart") {
    if (!cartReady || cartIds.length === 0) return <HomePage onNavigate={navigateTo} />;
    return <CartPage onNavigate={navigateTo} />;
  }

  if (pathname === "/checkout") {
    return <CheckoutPage onNavigate={navigateTo} />;
  }

  if (pathname === "/profile") {
    return <ProfilePage onNavigate={navigateTo} />;
  }

  const detailMatch = pathname.match(/^\/game\/([^/]+)\/?$/);
  if (detailMatch) {
    const slug = decodeURIComponent(detailMatch[1]);
    const fallbackGame = games.find((game) => game.id === slug) || null;
    return <GameDetailRoutePage slug={slug} fallbackGame={fallbackGame} onNavigate={navigateTo} />;
  }

  return <HomePage onNavigate={navigateTo} />;
}
