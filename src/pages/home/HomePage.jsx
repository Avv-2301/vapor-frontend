import { useEffect, useRef, useState } from "react";
import FeaturedCarousel from "../../components/home/FeaturedCarousel";
import Discovery from "../../components/home/Discovery";
import Newsletter from "../../components/home/Newsletter";
import Icon from "../../components/common/Icon";
import StorePageLayout from "../../components/common/StorePageLayout";
import { GameCard, Price, SectionHeading } from "../../components/home/StoreUI";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import { categories, games } from "../../data/store";
import useAuthSession from "../../hooks/useAuthSession";
import { useAppStore } from "../../stores/appStore";
import "./HomePage.css";
const messages = {
  About:
    "Vapor is your destination for extraordinary PC games. Discover new worlds, find great deals, and play your way.",
  Support:
    "Account and purchase support will be available when the store launches.",
  "Install Vapor":
    "The Vapor desktop client will be available for Windows, macOS, and Linux. Downloads are coming soon.",
  Messages: "You’re all caught up. There are no new messages.",
  Notifications: "You’re all caught up. There are no new notifications.",
  Wallet:
    "Your wallet balance is ₹42.50. Payments and wallet top-ups are not enabled in this storefront preview.",
  "Points Shop":
    "Avatar Frames cost 2,000 points, Mini-Profiles cost 1,500 points, and Animated Emotes cost 500 points. Point redemptions are coming soon.",
};
export default function HomePage({ onNavigate }) {
  const [user, signOut] = useAuthSession();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(null);
  const [salesOnly, setSalesOnly] = useState(false);
  const wishlist = useAppStore((state) => state.wishlist);
  const wishlistGames = useAppStore((state) => state.wishlistGames);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const [modal, setModal] = useState(null);
  const categoriesSwiper = useRef(null);
  const specialOffers = useAppStore((state) => state.specialOffers);
  const homeCatalogLoaded = useAppStore((state) => state.homeCatalogLoaded);
  const homeCatalogLoading = useAppStore((state) => state.homeCatalogLoading);
  const homeCatalogError = useAppStore((state) => state.homeCatalogError);
  const loadHomeCatalog = useAppStore((state) => state.loadHomeCatalog);
  const dialog = useRef(null);
  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  useEffect(() => {
    loadHomeCatalog();
  }, [loadHomeCatalog]);
  const selectGame = (game) => onNavigate("/game/" + encodeURIComponent(game.id));
  const handleWishlist = (id, game) => toggleWishlist(id, game).catch((error) => {
    setModal({ title: "Wishlist", message: error.message || "Could not update your wishlist." });
  });
  const action = (title) =>
    setModal({
      title,
      message:
        messages[title] ||
        "This feature will be available when Vapor launches. Explore the store and save your favorite games to your wishlist in the meantime.",
    });
  const scrollDiscovery = () =>
    document
      .getElementById("discovery")
      .scrollIntoView({ behavior: "smooth", block: "start" });
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
      <main className="container">
        <FeaturedCarousel
          wishlist={wishlist}
          onWishlist={handleWishlist}
          onSelect={selectGame}
        />
        <section className="section" id="offers">
          <SectionHeading title="Special Offers" badge="Midweek Madness">
            <button
              className="text-link"
              onClick={() => {
                setSalesOnly(true);
                setCategory(null);
                setQuery("");
                scrollDiscovery();
              }}
            >
              Browse All Sales <Icon name="arrow" size={16} />
            </button>
          </SectionHeading>
          <div className="offers-grid">
            {specialOffers.length > 0 ? specialOffers.map((game) => (
              <GameCard key={game.id} game={game} onSelect={selectGame} />
            )) : homeCatalogLoaded ? (
              <div className="empty-state offers-empty-state" role="status">
                <Icon name="tag" size={28} />
                <h3>No special offer games available</h3>
                <p>Check back later for new deals.</p>
              </div>
            ) : homeCatalogLoading ? (
              <div className="empty-state offers-empty-state" role="status">Loading special offers…</div>
            ) : homeCatalogError ? (
              <div className="empty-state offers-empty-state" role="status">Special offers couldn’t be loaded right now.</div>
            ) : null}
          </div>
        </section>
        <section className="section categories" id="categories">
          <SectionHeading title="Browse by Category">
            <div className="carousel-controls category-controls">
              <button className="icon-button" onClick={() => categoriesSwiper.current?.slidePrev()} aria-label="Previous categories"><Icon name="left" /></button>
              <button className="icon-button" onClick={() => categoriesSwiper.current?.slideNext()} aria-label="Next categories"><Icon name="right" /></button>
            </div>
          </SectionHeading>
          <Swiper
            className="category-carousel"
            modules={[A11y, Keyboard]}
            slidesPerView={3}
            spaceBetween={8}
            loop
            keyboard={{ enabled: true }}
            breakpoints={{
              640: { slidesPerView: 4 },
              900: { slidesPerView: 5 },
              1200: { slidesPerView: 7 },
            }}
            onSwiper={(swiper) => { categoriesSwiper.current = swiper; }}
            aria-label="Browse game categories"
          >
            {categories.map(([title, icon, color]) => (
              <SwiperSlide key={title}>
                <button
                  className={`category-tile ${category === title ? "selected" : ""}`}
                  aria-pressed={category === title}
                  onClick={() => {
                    setCategory(category === title ? null : title);
                    setSalesOnly(false);
                    scrollDiscovery();
                  }}
                >
                  <Icon name={icon} size={24} className={color} />
                  <strong>{title}</strong>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        <Discovery
          query={query}
          category={category}
          salesOnly={salesOnly}
          setSalesOnly={setSalesOnly}
          onClear={() => {
            setQuery("");
            setCategory(null);
            setSalesOnly(false);
          }}
          onSelect={selectGame}
        />
        <Newsletter />
      </main>
      <dialog
        ref={dialog}
        className="store-dialog"
        aria-labelledby="dialog-title"
        onCancel={() => setModal(null)}
        onClick={(event) => {
          if (event.target === dialog.current) setModal(null);
        }}
      >
        <button
          className="icon-button dialog-close"
          aria-label="Close dialog"
          onClick={() => setModal(null)}
        >
          <Icon name="close" />
        </button>
        {modal && (
          <>
            {modal.game && (
              <img
                className="dialog-art"
                src={modal.game.image}
                alt={modal.title}
              />
            )}
            <div className="dialog-content">
              <span className="eyebrow">Vapor Store</span>
              <h2 id="dialog-title">{modal.title}</h2>
              {modal.title === "Wishlist" ? (
                <div className="wishlist-list">
                  {wishlist.length ? (
                    wishlistGames.map((game) => (
                        <button key={game.id} onClick={() => selectGame(game)}>
                          <img src={game.image} alt="" />
                          <span>{game.title}</span>
                          <Price game={game} />
                        </button>
                      ))
                  ) : (
                    <p>
                      Your wishlist is ready for your next adventure. Use the
                      heart on a featured game to save it here.
                    </p>
                  )}
                </div>
              ) : (
                <p>{modal.game?.description || modal.message}</p>
              )}
              {modal.game && (
                <>
                  <div className="dialog-game-info">
                    <span className="blue">{modal.game.reviews}</span>
                    <Price game={modal.game} />
                  </div>
                  <button
                    className="primary-button"
                    onClick={() => handleWishlist(modal.game.id, modal.game)}
                  >
                    <Icon name="heart" size={16} />
                    {wishlist.includes(modal.game.id)
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </button>
                  <small className="dialog-note">
                    Storefront preview · purchases are not enabled.
                  </small>
                </>
              )}
            </div>
          </>
        )}
      </dialog>
    </StorePageLayout>
  );
}
