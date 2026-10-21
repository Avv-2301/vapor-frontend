import { useEffect, useState } from "react";
import StorePageLayout from "../../components/common/StorePageLayout";
import LibraryFeaturedGame from "../../components/library/LibraryFeaturedGame";
import LibraryPlayControls from "../../components/library/LibraryPlayControls";
import LibrarySidebar from "../../components/library/LibrarySidebar";
import { getJson } from "../../api/apiClient";
import useAuthSession from "../../hooks/useAuthSession";
import "./LibraryPage.css";
import { useAppStore } from "../../stores/appStore";

export default function LibraryPage({ onNavigate }) {
  const [user, signOut] = useAuthSession();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [purchasedGames, setPurchasedGames] = useState([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const wishlistCount = useAppStore((state) => state.wishlist.length);

  useEffect(() => {
    let active = true;
    if (!user) { setPurchasedGames([]); setLoading(false); return () => { active = false; }; }
    setLoading(true);
    setLoadError("");
    getJson("/library")
      .then((result) => {
        if (!active) return;
        const owned = (result.data?.games || []).map((entry, index) => {
          const product = entry.gameId && typeof entry.gameId === "object" ? entry.gameId : {};
          const discounted = product.isDiscountActive && product.discountPrice != null && product.discountPrice < product.price;
          return {
            id: product.slug || (product._id ? String(product._id) : `owned-${index}-${entry.gameName}`),
            title: product.name || entry.gameName,
            image: product.thumbnail || "",
            price: Number(discounted ? product.discountPrice : product.price) || 0,
            original: discounted ? Number(product.price) : null,
            discount: discounted ? Number(product.discountPercentage) || 0 : 0,
            edition: product.publisher || product.developer || "Standard Edition",
            developer: product.developer || "",
            purchaseDate: entry.purchaseDate,
            playTime: entry.playTime || 0,
            lastPlayed: entry.lastPlayed,
            tags: [],
          };
        });
        setPurchasedGames(owned);
        setSelectedId((current) => owned.some((game) => game.id === current) ? current : owned[0]?.id || "");
      })
      .catch((error) => { if (active) { setPurchasedGames([]); setLoadError(error.message || "Your library could not be loaded."); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?._id]);

  const visibleGames = purchasedGames.filter((game) =>
    game.title.toLowerCase().includes(query.trim().toLowerCase())
  );
  const selectedGame =
    visibleGames.find((game) => game.id === selectedId) || visibleGames[0];

  const selectGame = (gameId) => {
    setSelectedId(gameId);
    setNotice("");
  };

  const handleAction = (action) =>
    setNotice(`${action} will be available in the Vapor client.`);

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
      <main className="library-page">
        <LibrarySidebar
          games={purchasedGames}
          selectedGameId={selectedGame?.id}
          onSelectGame={selectGame}
        />

        <section className="library-content" aria-label="Purchased games">
          {notice && (
            <div className="library-content-heading">
              <div className="library-notice" role="status">
                {notice}
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {loading ? <div className="library-empty"><h2>Loading your library…</h2></div> : loadError ? <div className="library-empty" role="alert"><h2>Library could not be loaded</h2><p>{loadError}</p></div> : selectedGame ? (
            <>
              <LibraryFeaturedGame game={selectedGame} />
              <LibraryPlayControls
                game={selectedGame}
                stats={{ lastPlayed: selectedGame.lastPlayed ? new Date(selectedGame.lastPlayed).toLocaleDateString() : "Never", playTime: `${selectedGame.playTime} hours`, cloud: "Ready to sync" }}
                onAction={handleAction}
                onStorePage={() =>
                  onNavigate(`/game/${encodeURIComponent(selectedGame.id)}`)
                }
              />
            </>
          ) : (
            <div className="library-empty">
              <h2>{purchasedGames.length ? "No games match your search" : "Your library is empty"}</h2>
              <p>{purchasedGames.length ? "Try another search term." : "Games purchased with Vapor Wallet will appear here."}</p>
              <button
                type="button"
                onClick={() => purchasedGames.length ? setQuery("") : onNavigate("/")}
              >
                {purchasedGames.length ? "Show all purchased games" : "Browse games"}
              </button>
            </div>
          )}
        </section>
      </main>
    </StorePageLayout>
  );
}
