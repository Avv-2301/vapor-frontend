import { useEffect, useState } from "react";
import Icon from "./Icon";
import useWallet from "../../hooks/useWallet";
import useCart from "../../hooks/useCart";
import { formatInr } from "../../utils/currency";
import { searchProducts } from "../../api/productApi";
import "./HeaderSearch.css";
export function Brand({ footer = false }) {
  return (
    <a href="/" className="brand" aria-label="Vapor home">
      <img src="/images/logo.jpg" alt="" />
      <span>
        <strong>VAPOR</strong>
        {footer && <small>DIGITAL DISTRIBUTION PLATFORM</small>}
      </span>
    </a>
  );
}
export default function Header({ query, onSearch, onAction, wishlistCount, user, onNavigate, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeSearchResult, setActiveSearchResult] = useState(0);
  const { wallet } = useWallet(user);
  const cartIds = useCart();
  const balanceLabel = wallet ? formatInr(wallet.balance) : "—";
  const searchTerm = query.trim();

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError("");
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(() => {
      setSearchLoading(true);
      setSearchError("");
      searchProducts(searchTerm)
        .then((products) => {
          if (active) {
            setSearchResults(products);
            setActiveSearchResult(0);
          }
        })
        .catch((error) => {
          if (active) {
            setSearchResults([]);
            setSearchError(error.message || "Could not search games.");
          }
        })
        .finally(() => {
          if (active) setSearchLoading(false);
        });
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [searchTerm]);

  const openSearchResult = (product) => {
    const productId = product.slug || product._id;
    if (!productId) return;
    setSearchFocused(false);
    setSearchResults([]);
    onSearch("");
    onNavigate(`/game/${encodeURIComponent(productId)}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setSearchFocused(false);
      return;
    }
    if (event.key === "ArrowDown" && searchResults.length) {
      event.preventDefault();
      setActiveSearchResult((index) => (index + 1) % searchResults.length);
    } else if (event.key === "ArrowUp" && searchResults.length) {
      event.preventDefault();
      setActiveSearchResult((index) => (index - 1 + searchResults.length) % searchResults.length);
    } else if (event.key === "Enter" && searchResults.length) {
      event.preventDefault();
      openSearchResult(searchResults[activeSearchResult]);
    }
  };

  const showSearchResults = searchFocused && searchTerm.length >= 2;
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-main">
          <div className="header-left">
            <Brand />
            <nav
              className={menuOpen ? "primary-nav open" : "primary-nav"}
              aria-label="Main navigation"
            >
              {["Library", "About", "Support"].map((item) => (
                <button
                  key={item}
                  className={item === "Library" ? "active" : ""}
                  onClick={() =>
                    item === "Library"
                      ? onNavigate("/library")
                      : onAction(item)
                  }
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="header-account">
            {user ? (
              <>
                <button className="icon-button account-extra" aria-label="Messages" onClick={() => onAction("Messages")}>
                  <Icon name="chat" />
                </button>
                <button className="icon-button notifications account-extra" aria-label="Notifications" title="Notifications" onClick={() => onAction("Notifications")}>
                  <Icon name="bell" />
                </button>
                {cartIds.length > 0 && (
                  <button className="icon-button cart-button" aria-label="Shopping cart" title="Cart" onClick={() => onNavigate("/cart")}>
                    <Icon name="cart" />
                    <span>{cartIds.length}</span>
                  </button>
                )}
                <button className="wallet" onClick={() => onNavigate("/wallet")}>
                  <small>Wallet</small>
                  <strong>{balanceLabel}</strong>
                </button>
                <div className="profile-wrap">
                  <button
                    className="profile profile-icon-button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label={'Account menu for ' + user.name}
                    aria-expanded={profileOpen}
                  >
                    {user.profilePhoto ? (
                      <img className="profile-avatar" src={user.profilePhoto} alt="" />
                    ) : (
                      <span className="profile-avatar" aria-hidden="true">{user.name.slice(0, 1).toUpperCase()}</span>
                    )}
                    <span className="profile-name"><strong>{user.name}</strong></span>
                    <Icon name="down" size={12} />
                  </button>
                  {profileOpen && (
                    <div className="profile-menu">
                      <strong>{user.name}</strong>
                      <button onClick={() => { onNavigate("/profile"); setProfileOpen(false); }}>Profile</button>
                      <button onClick={() => { onAction("Wishlist"); setProfileOpen(false); }}>Your wishlist ({wishlistCount})</button>
                      <button onClick={() => { onNavigate("/wallet"); setProfileOpen(false); }}>Wallet balance: {balanceLabel}</button>
                      <button onClick={() => { onSignOut(); setProfileOpen(false); }}>Sign out</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {cartIds.length > 0 && (
                  <button className="icon-button cart-button" aria-label="Shopping cart" title="Cart" onClick={() => onNavigate("/cart")}>
                    <Icon name="cart" />
                    <span>{cartIds.length}</span>
                  </button>
                )}
                <div className="auth-actions">
                  <button className="auth-link" onClick={() => onNavigate("/login")}>Log In</button>
                  <button className="auth-link auth-link-primary" onClick={() => onNavigate("/register")}>Register</button>
                </div>
              </>
            )}
            <button
              className="icon-button mobile-menu"
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
        <div className="header-sub">
          <nav aria-label="Store navigation">
            {[
              ["Your Store", "#featured"],
              ["New & Noteworthy", "#discovery"],
              ["Categories", "#categories"],
            ].map(([item, href]) => (
              <a key={item} href={href}>
                {item}
              </a>
            ))}
          </nav>
          <div
            className="header-search-wrap"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setSearchFocused(false);
            }}
          >
            <label className="search">
              <input
                type="search"
                placeholder="Search games..."
                aria-label="Search games"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showSearchResults}
                aria-controls="header-game-search-results"
                value={query}
                onFocus={() => setSearchFocused(true)}
                onChange={(event) => onSearch(event.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              <Icon name="search" size={16} />
            </label>
            {showSearchResults && (
              <div className="header-search-results" id="header-game-search-results" role="listbox" aria-label="Game search results">
                {searchLoading ? (
                  <p className="header-search-state" role="status">Searching games…</p>
                ) : searchError ? (
                  <p className="header-search-state" role="alert">{searchError}</p>
                ) : searchResults.length ? (
                  searchResults.map((product, index) => {
                    const discounted = product.isDiscountActive === true
                      && product.discountPrice != null
                      && Number(product.discountPrice) < Number(product.price);
                    return (
                      <button
                        className={`header-search-result${index === activeSearchResult ? " active" : ""}`}
                        key={product._id || product.slug}
                        type="button"
                        role="option"
                        aria-selected={index === activeSearchResult}
                        onMouseEnter={() => setActiveSearchResult(index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => openSearchResult(product)}
                      >
                        <img src={product.thumbnail || ""} alt="" />
                        <span className="header-search-result-name">{product.name}</span>
                        <span className="header-search-result-price">
                          {discounted && <del>{formatInr(product.price)}</del>}
                          {formatInr(discounted ? product.discountPrice : product.price)}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="header-search-state">No games found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
