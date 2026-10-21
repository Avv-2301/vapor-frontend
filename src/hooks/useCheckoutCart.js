import { useEffect, useMemo, useState } from "react";
import { getCart as getRemoteCart, addCartProduct } from "../api/cartApi";
import { games as sampleGames } from "../data/store";
import { useAppStore } from "../stores/appStore";
import { getCartIds, replaceCartIds } from "../utils/cartStorage";

function toCheckoutGame(product) {
  if (!product) return null;
  const isStoreGame = Boolean(product.id && product.title);
  const id = product.id || product.slug || product._id;
  if (!id) return null;

  const price = Number(isStoreGame ? product.price : product.discountPrice ?? product.price) || 0;
  const originalPrice = Number(isStoreGame ? product.original ?? product.price : product.price) || price;
  const discounted = originalPrice > price;
  return {
    ...product,
    id,
    title: product.title || product.name || "Game",
    image: product.image || product.thumbnail || product.previews?.[0] || "",
    price,
    original: discounted ? originalPrice : null,
    discount: Number(product.discount) || (discounted ? Number(product.discountPercentage) || Math.round((1 - price / originalPrice) * 100) : 0),
    edition: product.edition || product.publisher || product.developer || "Standard Edition",
    tags: product.tags?.length ? product.tags : product.genres || [],
  };
}

export default function useCheckoutCart(userId) {
  const cartIds = useAppStore((state) => state.cartIds);
  const featuredGames = useAppStore((state) => state.featuredGames);
  const newGames = useAppStore((state) => state.newAndTrendingGames);
  const saleGames = useAppStore((state) => state.saleGames);
  const specialOffers = useAppStore((state) => state.specialOffers);
  const gameDetails = useAppStore((state) => state.gameDetails);
  const loadHomeCatalog = useAppStore((state) => state.loadHomeCatalog);
  const [remoteGames, setRemoteGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadHomeCatalog(); }, [loadHomeCatalog]);

  useEffect(() => {
    if (!userId) {
      setRemoteGames([]);
      setLoading(false);
      setError("");
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError("");
    getRemoteCart()
      .then(async (products) => {
        const remoteIds = new Set(products.map((product) => product.slug || product._id));
        const pendingIds = getCartIds().filter((id) => !remoteIds.has(id));
        await Promise.allSettled(pendingIds.map((id) => addCartProduct(id)));
        const syncedProducts = await getRemoteCart().catch(() => products);
        if (!active) return;
        setRemoteGames(syncedProducts.map(toCheckoutGame).filter(Boolean));
        replaceCartIds([...getCartIds(), ...syncedProducts.map((product) => product.slug || product._id).filter(Boolean)]);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Your saved cart couldn’t be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [userId]);

  const games = useMemo(() => {
    const detailGames = Object.values(gameDetails).map((detail) => detail?.game).filter(Boolean);
    const knownGames = [
      ...sampleGames,
      ...featuredGames,
      ...newGames,
      ...saleGames,
      ...specialOffers,
      ...detailGames,
      ...remoteGames,
    ].map(toCheckoutGame).filter(Boolean);
    const byId = new Map(knownGames.map((game) => [String(game.id), game]));
    return cartIds.map((id) => byId.get(String(id))).filter(Boolean);
  }, [cartIds, featuredGames, newGames, saleGames, specialOffers, gameDetails, remoteGames]);

  return { games, loading, error };
}
