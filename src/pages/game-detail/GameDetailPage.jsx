import { useRef, useState } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Icon from "../../components/common/Icon";
import { formatInr } from "../../utils/currency";
import "./GameDetailPage.css";

const shots = [1, 2, 3, 4].map((n) => ({
  src: "/images/cyber-preview-" + n + ".jpg",
  label: ["Neo-Kyoto skyline", "Street-level exploration", "Combat in the city", "Night district"][n - 1],
}));
const featureCards = [
  ["140+ Neural Augmentations", "Shape combat, movement, and dialogue with cybernetic enhancements."],
  ["Full Path Tracing", "Explore a rain-soaked city lit by neon and volumetric light."],
  ["Dynamic District Politics", "Your choices shift alliances across Neo-Kyoto."],
  ["Engineered for Steam Deck", "Controller support and portable play with scalable PC settings."],
];
const reviews = [
  ["Kuro_Glitch", "A city worth getting lost in", "Neo-Kyoto is staggering. The combat is snappy, and the side stories make every district feel lived in.", "412 people found this review helpful"],
  ["SymapsePilot", "An incredible soundtrack and atmosphere", "The synth-heavy score sets the tone from the first mission. Responsive combat and flexible augmentations make for a memorable RPG.", "230 people found this review helpful"],
];

function Heading({ children, action }) {
  return <div className="detail-heading"><h2>{children}</h2>{action}</div>;
}

function PurchaseOption({ game, onAddToCart }) {
  const current = game.price;
  const original = game.original || game.price;
  const percent = game.discount || 0;
  return <section className="purchase-option">
    <div className="purchase-description"><strong>Buy {game.title}</strong><span>Special promotion ends in 4 days</span></div>
    <div className="purchase-action"><div className="purchase-price">{percent > 0 && <span className="discount">-{percent}%</span>}<span className="price-value"><del>{formatInr(original)}</del><strong>{formatInr(current)}</strong></span></div><button onClick={() => onAddToCart(game)}>Add to Cart</button></div>
  </section>;
}

export default function GameDetailPage({ game, wishlist, onWishlist, onAction, onAddToCart }) {
  const swiper = useRef(null);
  const [active, setActive] = useState(0);
  const [platform, setPlatform] = useState("Windows");
  const [follow, setFollow] = useState(false);
  const [ignore, setIgnore] = useState(false);
  const isSaved = wishlist.includes(game.id);
  const media = [
    ...(game.trailerUrl ? [{ type: "video", src: game.trailerUrl, label: "Gameplay trailer" }] : []),
    ...shots.map((shot) => ({ ...shot, type: "image" })),
  ];
  const count = game.reviewCount || "18,940";
  const description = game.id === "cyberpunk"
    ? "The year is 2088. Following the collapse of orbital tether communications, the hyper-densified megapolis of Neo-Kyoto operates by none-too-subtle corporate law. You awaken as Kestrel, an exiled covert operative rebuilt with forbidden prototype wetware."
    : game.description;

  return <main className="game-detail container">
    <nav className="detail-breadcrumb" aria-label="Breadcrumb"><a href="/">All Games</a><span>›</span><a href="/">{game.categories?.[0] || "PC Games"}</a><span>›</span><span aria-current="page">{game.title}</span></nav>
    <div className="detail-titlebar"><div><div className="detail-badges"><span>EA PREMIERE</span><span>RAY TRACING OVERDRIVE</span></div><h1>{game.title}</h1></div><div className="detail-title-tags">{(game.tags || []).slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div></div>

    <section className="detail-hero" aria-label="Game media and summary">
      <div className="media-column">
        <div className="media-stage"><Swiper modules={[A11y, Keyboard]} slidesPerView={1} loop keyboard={{ enabled: true }} onSwiper={(instance) => { swiper.current = instance; }} onSlideChange={(instance) => setActive(instance.realIndex)} aria-label={game.title + " media"}>
          {media.map((item, index) => <SwiperSlide key={item.type === "video" ? "trailer" : item.src}><div className="media-slide">
            {item.type === "video" ? <video className="media-video" controls playsInline preload="metadata" poster={shots[0].src} src={item.src} aria-label={game.title + " trailer"} /> : <img src={item.src} alt={game.title + ": " + item.label} />}
            <span className="media-caption"><i /> {item.label}</span><span className="media-counter">{String(index + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</span>
          </div></SwiperSlide>)}
        </Swiper><div className="media-controls"><button aria-label="Previous media" onClick={() => swiper.current?.slidePrev()}><Icon name="left" size={15} /></button><span className="media-progress"><i style={{ width: ((active + 1) / media.length) * 100 + "%" }} /></span><button aria-label="Next media" onClick={() => swiper.current?.slideNext()}><Icon name="right" size={15} /></button></div></div>
        <div className="media-thumbs" aria-label="Choose game media">{media.map((item, index) => <button className={active === index ? "active" : ""} key={item.type === "video" ? "trailer" : item.src} onClick={() => swiper.current?.slideToLoop(index)} aria-label={"Show " + item.label} aria-pressed={active === index}><img src={item.type === "video" ? shots[0].src : item.src} alt="" />{item.type === "video" && <span><Icon name="play" size={13} /></span>}</button>)}</div>
      </div>
      <aside className="detail-summary"><img className="detail-capsule" src={game.image} alt={game.title + " cover art"} /><p className="detail-synopsis">{game.description}</p>
        <dl className="detail-metadata"><div><dt>Recent Reviews:</dt><dd className="positive">Very Positive <span>(2,410)</span></dd></div><div><dt>All Reviews:</dt><dd className="positive">{game.reviews || "Overwhelmingly Positive"} <span>({count})</span></dd></div><div><dt>Release Date:</dt><dd>{game.date || "May 14, 2024"}</dd></div><div><dt>Developer:</dt><dd className="blue">{game.developer || "Vertex Shift Studio"}</dd></div><div><dt>Publisher:</dt><dd className="blue">Vapor Dynamics Interactive</dd></div></dl>
        <div className="popular-tags"><span>Popular user-defined tags for this product:</span>{(game.tags || []).slice(0, 5).map((tag) => <button key={tag}>{tag}</button>)}</div>
      </aside>
    </section>

    <div className="detail-community-actions"><button className={isSaved ? "is-selected" : ""} onClick={() => onWishlist(game.id)}><Icon name="heart" size={15} /> {isSaved ? "On your Wishlist" : "Add to your Wishlist"}</button><button className={follow ? "is-selected" : ""} onClick={() => setFollow(!follow)}><Icon name="bell" size={14} /> {follow ? "Following" : "Follow"}</button><button className={ignore ? "is-selected" : ""} onClick={() => setIgnore(!ignore)}><Icon name="close" size={14} /> {ignore ? "Ignored" : "Ignore"}</button><div className="detail-share"><span>Share via:</span><button onClick={() => onAction("Share")}>↗ Share</button><button onClick={() => onAction("Embed")}>‹› Embed</button></div></div>
    <div className="purchase-list"><PurchaseOption game={game} onAddToCart={onAddToCart} /></div>

    <div className="detail-columns"><div className="detail-main-column">
      <section className="detail-section about-section"><Heading>About This Game</Heading><p className="about-copy">{description} You can approach each contract through stealth, direct combat, or a clever mix of both. Every decision leaves a mark on the city and the people who call it home.</p><img className="about-art" src="/images/cyber-preview-2.jpg" alt="A neon-lit street in Neo-Kyoto" /><h3 className="feature-title">⌘ Next-Generation Immersive Sim</h3><p className="feature-copy">Every corporate skyscraper, back-alley market enclave, and flooded subway artery is fully realized with seamless zero-load exploration. Approach contracts through tactical infiltration, hyper-kinetic combat, or high-tier neural intrusion.</p><div className="feature-grid">{featureCards.map(([title, text], index) => <article key={title} className={"feature-card feature-tone-" + index}><h4>{title}</h4><p>{text}</p></article>)}</div><div className="mature-note"><strong>⚠ Mature Content Description</strong><p>Stylized combat violence, blood splatters, strong language, cybernetic augmentation surgery, and mature themes involving corporate espionage and corruption.</p></div></section>
      <section className="detail-section requirements-section"><Heading>System Requirements</Heading><div className="requirements-tabs">{["Windows", "SteamOS + Linux", "macOS (Apple Silicon)"].map((tab) => <button key={tab} className={platform === tab ? "active" : ""} onClick={() => setPlatform(tab)}>{tab}</button>)}</div><div className="requirements-grid"><article><h3>Minimum (1080p @ 30 FPS, Low Settings)</h3><p>OS: {platform === "Windows" ? "Windows 10 64-bit" : platform}</p><p>Processor: AMD Ryzen 5 3600 or Intel Core i5-10400F</p><p>Memory: 16 GB RAM</p><p>Graphics: NVIDIA GeForce RTX 2060 or AMD Radeon RX 5700 XT</p><p>DirectX: Version 12</p><p>Storage: 110 GB available (NVMe SSD required)</p></article><article><h3>Recommended (1440p @ 60 FPS / Path Tracing)</h3><p>OS: {platform === "Windows" ? "Windows 11 64-bit" : platform}</p><p>Processor: AMD Ryzen 7 7800X3D or Intel Core i7-14700F</p><p>Memory: 32 GB RAM</p><p>Graphics: NVIDIA GeForce RTX 4070 Ti Super or AMD Radeon RX 7900 XT</p><p>DirectX: Version 12 Ultimate</p><p>Storage: 110 GB available (PCIe 4.0 NVMe SSD)</p></article></div></section>
      <section className="detail-section reviews-section" id="reviews"><Heading action={<a href="#reviews">Read all reviews</a>}>Customer Reviews</Heading><div className="review-overview"><div><span>Overall Review Score</span><strong>{game.reviews || "Overwhelmingly Positive"}</strong><small>({count} reviews)</small></div><div className="review-bars"><span>92% Positive</span><span>8% Negative</span><i><b /></i></div></div><div className="review-filters"><div><button className="active">Summary (All)</button><button>Positive (17,234)</button><button>Steam Purchasers</button></div><span>Language: Your Language (12,180)</span></div>{reviews.map(([name, title, body, helpful], index) => <article className="review-card" key={name}><div className="review-user"><span className={"review-avatar avatar-" + index}>{name.slice(0, 1)}</span><div><strong>{name}</strong><span>2,410 hrs on record</span></div><b>Recommended</b></div><h3>{title}</h3><p>{body}</p><div className="review-meta"><span>Posted recently · Updated: 1 day ago</span><span>{helpful}</span><button>Yes</button><button>No</button></div></article>)}</section>
    </div><aside className="detail-sidebar">
      <section className="sidebar-panel metascore-panel"><div><span>Metascore</span><small>Read Critic Reviews</small></div><strong>91</strong></section>
      <section className="sidebar-panel compatibility-panel">{["Single-player", "Full controller support", "Steam Cloud", "Steam Trading Cards", "Remote Play on TV / Tablet"].map((feature) => <div key={feature}><Icon name="check" size={13} /> {feature}</div>)}</section>
      <section className="sidebar-panel achievements-panel"><div><h3>Steam Achievements</h3><button onClick={() => onAction("Steam Achievements")}>View all 54</button></div><div className="achievement-grid">{shots.map((shot) => <img key={shot.src} src={shot.src} alt="Achievement preview" />)}</div></section>
      <section className="sidebar-panel language-panel"><h3>Languages Supported</h3><table><thead><tr><th>Language</th><th>UI</th><th>Audio</th><th>Subtitles</th></tr></thead><tbody>{[["English", 1, 1, 1], ["Japanese", 1, 1, 1], ["German", 1, 0, 1], ["French", 1, 0, 1], ["Spanish - Latam", 1, 0, 1]].map(([language, ui, audio, subs]) => <tr key={language}><td>{language}</td><td>{ui ? "✓" : "–"}</td><td>{audio ? "✓" : "–"}</td><td>{subs ? "✓" : "–"}</td></tr>)}</tbody></table><button className="language-more" onClick={() => onAction("Supported Languages")}>See all 14 supported languages</button></section>
    </aside></div>
  </main>;
}
