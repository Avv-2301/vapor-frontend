import { create } from "zustand";
import { getJson } from "../api/apiClient";
import { getWallet } from "../api/walletApi";
import { addWishlistProduct, getWishlist, removeWishlistProduct } from "../api/wishlistApi";
import { getHomeCatalog, getProductBySlug, getProductReviews } from "../api/productApi";

const toWishlistGame = (product) => {
  const saleActive = product?.isDiscountActive === true && product.discountPrice != null && Number(product.discountPrice) < Number(product.price);
  return {
    ...product,
    id: product?.slug || product?._id || product?.id,
    title: product?.name || product?.title || "Game",
    image: product?.thumbnail || product?.image || "",
    price: Number(saleActive ? product.discountPrice : product?.price) || 0,
    original: saleActive ? Number(product.price) : null,
    discount: saleActive ? Number(product.discountPercentage) || 0 : 0,
    date: product?.releaseDate || product?.date || "",
    tags: product?.tags?.length ? product.tags : product?.genres || [],
    reviews: product?.averageRating ? `${product.averageRating}/5` : "No reviews yet",
    reviewCount: product?.reviewCount || 0,
  };
};

const withoutWishlistId = (state, id) => ({
  wishlist: state.wishlist.filter((item) => item !== id),
  wishlistGames: state.wishlistGames.filter((game) => game.id !== id),
});

export const useAppStore = create((set, get) => ({
  pathname: window.location.pathname,
  setPathname: (pathname) => set({ pathname }),

  featuredGames: [],
  newAndTrendingGames: [],
  saleGames: [],
  specialOffers: [],
  homeCatalogLoaded: false,
  homeCatalogLoading: false,
  loadHomeCatalog: async () => {
    const state = get();
    if (state.homeCatalogLoaded || state.homeCatalogLoading) return;
    set({ homeCatalogLoading: true });
    try {
      const catalog = await getHomeCatalog();
      set({ ...catalog, homeCatalogLoaded: true, homeCatalogLoading: false });
    } catch (error) {
      set({ homeCatalogLoading: false, homeCatalogError: error.message || "Could not load the game catalog." });
    }
  },
  gameDetails: {},
  loadGameDetail: async (slug) => {
    if (!slug) return;
    const current = get().gameDetails[slug];
    if (current?.loading || current?.loaded) return;
    set((state) => ({ gameDetails: { ...state.gameDetails, [slug]: { ...current, loading: true, error: "" } } }));
    try {
      const game = await getProductBySlug(slug);
      let reviews = null;
      if (game?._id) {
        try {
          reviews = await getProductReviews(game._id);
        } catch {
          reviews = null;
        }
      }
      set((state) => ({ gameDetails: { ...state.gameDetails, [slug]: { game, reviews, loading: false, loaded: true, error: "" } } }));
    } catch (error) {
      set((state) => ({ gameDetails: { ...state.gameDetails, [slug]: { loading: false, loaded: true, error: error.message || "This game could not be loaded." } } }));
    }
  },

  user: null,
  authReady: false,
  authLoading: false,
  authRequestId: 0,
  setUser: (user) => set((state) => {
    const previousUserId = state.user?._id;
    const nextUserId = user?._id;
    const switchingAccounts = previousUserId && previousUserId !== nextUserId;
    return {
      user,
      authReady: true,
      authLoading: false,
      authRequestId: state.authRequestId + 1,
      wishlist: switchingAccounts ? [] : state.wishlist,
      wishlistGames: switchingAccounts ? [] : state.wishlistGames,
      wishlistUserId: switchingAccounts ? null : state.wishlistUserId,
      wishlistLoadedUserId: null,
      wishlistLoadingUserId: null,
      wishlistLoading: false,
      wishlistPendingIds: switchingAccounts ? [] : state.wishlistPendingIds,
    };
  }),
  updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
  clearUser: () => set((state) => ({ user: null, cartIds: [], wishlist: [], wishlistGames: [], wishlistUserId: null, wishlistLoadedUserId: null, wishlistLoadingUserId: null, wishlistLoading: false, wishlistPendingIds: [], wishlistError: "", wallet: null, walletUserId: null, walletLoading: false, authReady: true, authLoading: false, authRequestId: state.authRequestId + 1 })),
  initializeAuth: async () => {
    if (get().authReady || get().authLoading) return;
    const requestId = get().authRequestId + 1;
    set({ authLoading: true, authRequestId: requestId });
    try {
      const result = await getJson("/users/me");
      if (get().authRequestId === requestId) {
        set({ user: result.data || null, authReady: true, authLoading: false });
        if (result.data?._id) await get().loadWishlist(result.data._id);
      }
    } catch {
      if (get().authRequestId === requestId) set({ user: null, authReady: true, authLoading: false });
    }
  },

  wallet: null,
  walletUserId: null,
  walletLoading: false,
  walletError: "",
  loadWallet: async (userId, force = false) => {
    if (!userId) return;
    const state = get();
    if (!force && state.walletUserId === userId && (state.walletLoading || state.wallet)) return;
    set({ walletUserId: userId, walletLoading: true, walletError: "" });
    try {
      const wallet = await getWallet();
      if (get().walletUserId === userId) set({ wallet, walletLoading: false, walletError: "" });
    } catch (error) {
      if (get().walletUserId === userId) set({ wallet: null, walletLoading: false, walletError: error.message || "Could not load the wallet." });
    }
  },

  cartIds: [],
  addCartId: (id) => set((state) => ({ cartIds: state.cartIds.includes(id) ? state.cartIds : [...state.cartIds, id] })),
  removeCartId: (id) => set((state) => ({ cartIds: state.cartIds.filter((item) => item !== id) })),
  clearCartIds: () => set({ cartIds: [] }),
  replaceCartIds: (ids) => set({ cartIds: [...new Set(ids.filter((id) => typeof id === "string"))] }),

  wishlist: [],
  wishlistGames: [],
  wishlistUserId: null,
  wishlistLoadedUserId: null,
  wishlistLoadingUserId: null,
  wishlistLoading: false,
  wishlistError: "",
  wishlistPendingIds: [],
  loadWishlist: async (userId) => {
    const current = get();
    if (!userId || current.wishlistLoadedUserId === userId || current.wishlistLoadingUserId === userId) return;
    const guestIds = current.wishlistUserId ? [] : [...current.wishlist];
    set({ wishlistLoadingUserId: userId, wishlistUserId: userId, wishlistLoading: true, wishlistError: "" });
    try {
      let products = await getWishlist();
      const serverIds = new Set(products.map((product) => product.slug || product._id));
      const guestIdsToSync = guestIds.filter((id) => !serverIds.has(id));
      if (guestIdsToSync.length) {
        const synced = await Promise.allSettled(guestIdsToSync.map((id) => addWishlistProduct(id)));
        const addedProducts = synced.filter((result) => result.status === "fulfilled" && result.value).map((result) => result.value);
        products = [...products, ...addedProducts];
      }
      if (get().wishlistLoadingUserId !== userId || get().user?._id !== userId) return;
      const wishlistGames = products.map(toWishlistGame).filter((game) => game.id).sort((left, right) => new Date(right.addedAt || 0) - new Date(left.addedAt || 0));
      set({ wishlist: wishlistGames.map((game) => game.id), wishlistGames, wishlistUserId: userId, wishlistLoadedUserId: userId, wishlistLoadingUserId: null, wishlistLoading: false });
    } catch (error) {
      if (get().wishlistLoadingUserId === userId) set({ wishlistLoadedUserId: null, wishlistLoadingUserId: null, wishlistLoading: false, wishlistError: error.message || "Could not load your wishlist." });
    }
  },
  toggleWishlist: async (id, game) => {
    if (typeof id !== "string" || !id) return;
    const state = get();
    const userId = state.user?._id;
    if (userId && state.wishlistLoadedUserId !== userId) {
      await get().loadWishlist(userId);
      if (get().wishlistLoadedUserId === userId) return get().toggleWishlist(id, game);
    }

    const current = get();
    const pending = current.wishlistPendingIds || [];
    if (pending.includes(id)) return;
    const isSaved = current.wishlist.includes(id);
    const priorWishlist = current.wishlist;
    const priorGames = current.wishlistGames;
    const next = isSaved ? withoutWishlistId(current, id) : {
      wishlist: [...current.wishlist, id],
      wishlistGames: [...current.wishlistGames.filter((item) => item.id !== id), ...(game ? [toWishlistGame(game)] : [])],
    };
    set({ ...next, wishlistPendingIds: [...pending, id], wishlistError: "" });

    try {
      if (userId) {
        if (isSaved) {
          await removeWishlistProduct(id);
        } else {
          const product = await addWishlistProduct(id);
          if (product && get().user?._id === userId) {
            const normalized = toWishlistGame(product);
            set((latest) => ({
              wishlist: latest.wishlist.map((item) => item === id ? normalized.id : item),
              wishlistGames: [{ ...normalized, addedAt: new Date().toISOString() }, ...latest.wishlistGames.filter((item) => item.id !== id && item.id !== normalized.id)],
            }));
          }
        }
      }
    } catch (error) {
      if (get().user?._id === userId) set({ wishlist: priorWishlist, wishlistGames: priorGames, wishlistError: error.message || "Could not update your wishlist." });
      throw error;
    } finally {
      set((latest) => ({ wishlistPendingIds: (latest.wishlistPendingIds || []).filter((item) => item !== id) }));
    }
  },
  addWishlistId: async (id, game) => {
    const userId = get().user?._id;
    if (userId && get().wishlistLoadedUserId !== userId) await get().loadWishlist(userId);
    if (get().wishlist.includes(id)) return;
    return get().toggleWishlist(id, game);
  },

  newsletterEmail: "",
  subscribeNewsletter: (email) => set({ newsletterEmail: email }),
}));
