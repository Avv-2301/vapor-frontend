import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import Icon from "../common/Icon";
import { Platforms, Price, SectionHeading } from "./StoreUI";
import { useAppStore } from "../../stores/appStore";

function FeaturedGameSlide({ game, wishlist, onWishlist, onSelect, active }) {
  const [preview, setPreview] = useState(null);

  return (
    <div className="hero">
      <button className="hero-stage" onClick={() => onSelect(game)}>
        <img
          className="hero-art"
          src={preview || game.image}
          alt={game.title}
          loading={active ? "eager" : "lazy"}
          fetchPriority={active ? "high" : "auto"}
          decoding="async"
        />
        <div className="hero-copy">
          <div className="hero-badges">
            <span>FEATURED GAME</span>
            {game.discount > 0 && <span>{game.discount}% OFF</span>}
          </div>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
        </div>
      </button>
      <div className="hero-sidebar">
        <div>
          <div className="hero-sidebar-heading">
            <div>
              <span className="eyebrow">
                {Number(game.discount) > 0 ? `${game.discount}% Off` : "Featured Game"}
              </span>
              <h3>{game.edition}</h3>
            </div>
            <button
              className={`icon-button wishlist-button ${
                wishlist.includes(game.id) ? "saved" : ""
              }`}
              aria-label={
                wishlist.includes(game.id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              aria-pressed={wishlist.includes(game.id)}
              onClick={() => onWishlist(game.id, game)}
            >
              <Icon name="heart" />
            </button>
          </div>
          <div className="preview-grid">
            {game.previews.map((src, previewIndex) => (
              <button
                key={src}
                onMouseEnter={() => setPreview(src)}
                onMouseLeave={() => setPreview(null)}
                onFocus={() => setPreview(src)}
                onBlur={() => setPreview(null)}
                onClick={() => setPreview(src)}
                aria-label={`Preview screenshot ${previewIndex + 1}`}
              >
                <img
                  src={src}
                  alt={`${game.title} gameplay ${previewIndex + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
          <dl className="game-meta">
            <div>
              <dt>Overall Reviews:</dt>
              <dd className="blue">
                {game.reviews} <span>({game.reviewCount})</span>
              </dd>
            </div>
            <div>
              <dt>Release Date:</dt>
              <dd>{game.date}</dd>
            </div>
            <div>
              <dt>Developer:</dt>
              <dd className="blue">{game.developer}</dd>
            </div>
          </dl>
          <div className="hero-tags">
            {game.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <button className="hero-purchase" onClick={() => onSelect(game)}>
          <Platforms mac={game.mac} verified />
          <Price game={game} />
        </button>
      </div>
    </div>
  );
}

export default function FeaturedCarousel({ wishlist, onWishlist, onSelect }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const featuredGames = useAppStore((state) => state.featuredGames);
  const loading = useAppStore((state) => state.homeCatalogLoading || !state.homeCatalogLoaded);
  const loadHomeCatalog = useAppStore((state) => state.loadHomeCatalog);

  useEffect(() => {
    loadHomeCatalog();
  }, [loadHomeCatalog]);

  if (!featuredGames.length) {
    if (!loading) return null;
    return (
      <section id="featured" className="featured section" aria-busy="true" aria-label="Loading featured games">
        <div className="featured-loading" role="status">Loading featured games…</div>
      </section>
    );
  }

  return (
    <section id="featured" className="featured section">
      <SectionHeading title="Featured & Recommended">
        <div className="carousel-controls">
          <button
            className="icon-button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Previous featured game"
          >
            <Icon name="left" />
          </button>
          <div className="carousel-dots">
            {featuredGames.map((game, index) => (
              <button
                key={game.id}
                className={activeIndex === index ? "active" : ""}
                onClick={() => swiperRef.current?.slideToLoop(index)}
                aria-label={`Show featured game ${index + 1}`}
                aria-pressed={activeIndex === index}
              />
            ))}
          </div>
          <button
            className="icon-button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Next featured game"
          >
            <Icon name="right" />
          </button>
        </div>
      </SectionHeading>
      <Swiper
        className="featured-swiper"
        modules={[A11y, Keyboard]}
        slidesPerView={1}
        loop
        keyboard={{ enabled: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        aria-label="Featured games"
      >
        {featuredGames.map((game, index) => (
          <SwiperSlide key={game.id}>
            <FeaturedGameSlide
              game={game}
              wishlist={wishlist}
              onWishlist={onWishlist}
              onSelect={onSelect}
              active={index === activeIndex}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
