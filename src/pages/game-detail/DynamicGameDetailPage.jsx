import { useRef, useState } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Icon from "../../components/common/Icon";
import useCart from "../../hooks/useCart";
import { formatInr } from "../../utils/currency";
import "./GameDetailPage.css";

const formatDate = (value) => {
  if (!value) return "Coming soon";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Coming soon" : date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};
const asList = (value) => Array.isArray(value) ? value : [];
const requirementLabels = { os: "OS", processor: "Processor", memory: "Memory", graphics: "Graphics", directX: "DirectX", storage: "Storage" };
const getVideoDisplay = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  if (value.startsWith("data:video/")) return { type: "file", src: value };
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") return { type: "embed", src: "https://www.youtube-nocookie.com/embed/" + url.pathname.slice(1) };
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      const id = url.searchParams.get("v") || url.pathname.match(/\/(?:embed|shorts)\/([^/]+)/)?.[1];
      if (id) return { type: "embed", src: "https://www.youtube-nocookie.com/embed/" + id };
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname.match(/\d+/)?.[0];
      if (id) return { type: "embed", src: "https://player.vimeo.com/video/" + id };
    }
    if (/\.(mp4|webm|ogg|mov)(?:$|\?)/i.test(url.pathname + url.search)) return { type: "file", src: value };
  } catch {
    return null;
  }
  return null;
};

function MediaView({ item, title }) {
  if (item.type === "video") {
    const display = getVideoDisplay(item.src);
    if (display?.type === "embed") return <iframe className="media-video" src={display.src} title={title + " trailer"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />;
    if (display?.type === "file") return <video className="media-video" controls playsInline preload="metadata" poster={item.poster} src={display.src} aria-label={title + " trailer"} />;
  }
  return <img src={item.src} alt={title + ": " + item.label} loading="lazy" decoding="async" />;
}

export default function DynamicGameDetailPage({ game, reviewsData, wishlist, onWishlist, onAction, onAddToCart, isOwned, ownershipLoading }) {
  const swiper = useRef(null);
  const [active, setActive] = useState(0);
  const cartIds = useCart();
  const isSaved = wishlist.includes(game.slug || game._id);
  const videos = asList(game.videos).map((src, i) => ({ type: "video", src, label: "Trailer " + (i + 1), poster: game.thumbnail } )).filter((item) => ["embed", "file"].includes(getVideoDisplay(item.src)?.type));
  const rawImages = [...asList(game.screenshots), ...asList(game.images)];
  const imageUrls = [...new Set(rawImages.length ? rawImages : [game.thumbnail].filter(Boolean))];
  const images = imageUrls.map((src, i) => ({ type: "image", src, label: "Screenshot " + (i + 1) }));
  const media = videos.length ? [...videos, ...images] : images;
  const requirements = game.systemRequirements || {};
  const languages = asList(game.languageSupport);
  const ratings = asList(reviewsData?.ratingDistribution);
  const reviewCount = reviewsData?.pagination?.totalReviews ?? game.reviewCount ?? 0;
  const tags = asList(game.tags).length ? game.tags : asList(game.genres);
  const price = Number(game.discountPrice ?? game.price ?? 0);
  const originalPrice = Number(game.discountPrice != null && game.discountPrice < game.price ? game.price : price);
  const discount = Number(game.discountPrice != null && game.discountPrice < game.price ? game.discountPercentage || Math.round((1 - price / (originalPrice || 1)) * 100) : 0);
  const id = game.slug || game._id;
  const isInCart = cartIds.includes(id);
  const reviews = asList(reviewsData?.reviews);

  return <main className="game-detail container">
    <nav className="detail-breadcrumb" aria-label="Breadcrumb"><a href="/">All Games</a><span>›</span><a href="/">{game.category || tags[0] || "PC Games"}</a><span>›</span><span aria-current="page">{game.name}</span></nav>
    <div className="detail-titlebar"><div><div className="detail-badges"><span>{game.ageRating || "PC GAME"}</span>{game.matureContentDescription && <span>MATURE CONTENT</span>}</div><h1>{game.name}</h1></div><div className="detail-title-tags">{tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div></div>

    <section className="detail-hero" aria-label="Game media and summary">
      <div className="media-column">
        {media.length ? <>
          <div className="media-stage"><Swiper modules={[A11y, Keyboard]} slidesPerView={1} loop={media.length > 1} keyboard={{ enabled: true }} onSwiper={(instance) => { swiper.current = instance; }} onSlideChange={(instance) => setActive(instance.realIndex)} aria-label={game.name + " media"}>
            {media.map((item, index) => <SwiperSlide key={item.type + item.src}><div className="media-slide"><MediaView item={item} title={game.name} /><span className="media-caption"><i /> {item.label}</span><span className="media-counter">{String(index + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</span></div></SwiperSlide>)}
          </Swiper><div className="media-controls"><button aria-label="Previous media" onClick={() => swiper.current?.slidePrev()}><Icon name="left" size={15} /></button><span className="media-progress"><i style={{ width: ((active + 1) / media.length) * 100 + "%" }} /></span><button aria-label="Next media" onClick={() => swiper.current?.slideNext()}><Icon name="right" size={15} /></button></div></div>
          <div className="media-thumbs" aria-label="Choose game media">{media.map((item, index) => <button className={active === index ? "active" : ""} key={item.type + item.src} onClick={() => swiper.current?.slideToLoop(index)} aria-label={"Show " + item.label} aria-pressed={active === index}><img src={item.type === "video" ? item.poster || imageUrls[0] : item.src} alt="" loading="lazy" />{item.type === "video" && <span><Icon name="play" size={13} /></span>}</button>)}</div>
        </> : <div className="media-empty">No screenshots or videos are available for this game yet.</div>}
      </div>
      <aside className="detail-summary">{game.thumbnail && <img className="detail-capsule" src={game.thumbnail} alt={game.name + " cover art"} loading="lazy" />}<p className="detail-synopsis">{game.shortDescription || game.description || "No game description is available yet."}</p>
        <dl className="detail-metadata"><div><dt>Reviews:</dt><dd className="positive">{game.averageRating ? Number(game.averageRating).toFixed(1) + " / 5" : "No reviews yet"} <span>({reviewCount})</span></dd></div><div><dt>Release Date:</dt><dd>{formatDate(game.releaseDate)}</dd></div><div><dt>Developer:</dt><dd className="blue">{game.developer || "—"}</dd></div><div><dt>Publisher:</dt><dd className="blue">{game.publisher || "—"}</dd></div>{game.metascore != null && <div><dt>Metascore:</dt><dd>{game.metascore}</dd></div>}</dl>
        {tags.length > 0 && <div className="popular-tags"><span>Popular tags:</span>{tags.slice(0, 5).map((tag) => <button key={tag}>{tag}</button>)}</div>}
      </aside>
    </section>

    <div className="detail-community-actions"><button className={isSaved ? "is-selected" : ""} onClick={() => onWishlist(id, { ...game, id, title: game.name, image: game.thumbnail })}><Icon name="heart" size={15} /> {isSaved ? "On your Wishlist" : "Add to your Wishlist"}</button><div className="detail-share"><span>Share via:</span><button onClick={() => onAction("Share")}>↗ Share</button></div></div>
    <section className="purchase-list"><div className="purchase-option"><div className="purchase-description"><strong>{isOwned ? "In your library" : `Buy ${game.name}`}</strong><span>{isOwned ? "Already owned by this account" : discount > 0 ? "Special offer" : "Available now"}</span></div><div className="purchase-action"><div className="purchase-price">{discount > 0 && <span className="discount">-{discount}%</span>}<span className="price-value">{discount > 0 && <del>{formatInr(originalPrice)}</del>}<strong>{formatInr(price)}</strong></span></div><button type="button" disabled={isOwned || ownershipLoading || isInCart} aria-label={isOwned ? game.name + " is already in your library" : isInCart ? game.name + " is already in your cart" : "Add " + game.name + " to cart"} onClick={() => onAddToCart({ id, title: game.name })}>{isOwned ? "Already in Library" : ownershipLoading ? "Checking Library…" : isInCart ? "In Cart" : "Add to Cart"}</button></div></div></section>

    <div className="detail-columns"><div className="detail-main-column">
      <section className="detail-section about-section"><div className="detail-heading"><h2>About This Game</h2></div><p className="about-copy">{game.description || game.shortDescription || "No description is available yet."}</p>{game.featureHighlights?.length > 0 && <div className="feature-grid">{game.featureHighlights.map((feature, index) => <article key={feature.title || index} className={"feature-card feature-tone-" + index % 4}><h4>{feature.title}</h4><p>{feature.description}</p></article>)}</div>}{game.matureContentDescription && <div className="mature-note"><strong>Mature Content Description</strong><p>{game.matureContentDescription}</p></div>}</section>
      {(requirements.minimum || requirements.recommended) && <section className="detail-section requirements-section"><div className="detail-heading"><h2>System Requirements</h2></div><div className="requirements-grid">{["minimum", "recommended"].filter((key) => requirements[key]).map((key) => <article key={key}><h3>{key === "minimum" ? "Minimum" : "Recommended"}</h3>{Object.entries(requirements[key]).filter(([, value]) => value).map(([field, value]) => <p key={field}>{requirementLabels[field] || field}: {value}</p>)}</article>)}</div></section>}
      <section className="detail-section reviews-section" id="reviews"><div className="detail-heading"><h2>Customer Reviews</h2></div><div className="review-overview"><div><span>Average Rating</span><strong>{game.averageRating ? Number(game.averageRating).toFixed(1) + " / 5" : "No ratings yet"}</strong><small>({reviewCount} reviews)</small></div><div className="review-bars">{[5, 4, 3, 2, 1].map((rating) => { const amount = ratings.find((item) => item._id === rating)?.count || 0; const percentage = reviewCount ? amount / reviewCount * 100 : 0; return <span key={rating}>{rating} ★ — {amount}<i><b style={{ width: percentage + "%" }} /></i></span>; })}</div></div>{reviews.length ? reviews.map((review) => <article className="review-card" key={review._id}><div className="review-user"><span className="review-avatar">{(review.userId?.name || "P").slice(0, 1).toUpperCase()}</span><div><strong>{review.userId?.name || "Vapor player"}</strong><span>{review.isVerifiedPurchase ? "Verified purchase" : "Community review"}</span></div><b>{review.rating}/5</b></div>{review.title && <h3>{review.title}</h3>}<p>{review.comment}</p><div className="review-meta"><span>{formatDate(review.createdAt)}</span><span>{review.helpfulCount || 0} found this helpful</span></div></article>) : <p className="about-copy">There are no approved reviews for this game yet.</p>}</section>
    </div><aside className="detail-sidebar">
      {game.metascore != null && <section className="sidebar-panel metascore-panel"><div><span>Metascore</span></div><strong>{game.metascore}</strong></section>}
      {asList(game.supportedFeatures).length > 0 && <section className="sidebar-panel compatibility-panel">{game.supportedFeatures.map((feature) => <div key={feature}><Icon name="check" size={13} /> {feature}</div>)}</section>}
      {game.achievementCount > 0 && <section className="sidebar-panel achievements-panel"><div><h3>Achievements</h3><strong>{game.achievementCount}</strong></div></section>}
      {languages.length > 0 && <section className="sidebar-panel language-panel"><h3>Languages Supported</h3><table><thead><tr><th>Language</th><th>UI</th><th>Audio</th><th>Subs</th></tr></thead><tbody>{languages.map((language) => <tr key={language.language}><td>{language.language}</td><td>{language.interface ? "✓" : "–"}</td><td>{language.audio ? "✓" : "–"}</td><td>{language.subtitles ? "✓" : "–"}</td></tr>)}</tbody></table></section>}
    </aside></div>
  </main>;
}
