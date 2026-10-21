import { useState } from "react";
import { Platforms, Price } from "./StoreUI";
import Icon from "../common/Icon";
import { useAppStore } from "../../stores/appStore";
const tabs = ["New & Trending", "Top Sellers", "Popular Upcoming", "Specials"];
export default function Discovery({
  query,
  category,
  onClear,
  onSelect,
  salesOnly,
  setSalesOnly,
}) {
  const [tab, setTab] = useState(tabs[0]);
  const newAndTrendingGames = useAppStore((state) => state.newAndTrendingGames);
  const saleGames = useAppStore((state) => state.saleGames);
  const activeTab = salesOnly ? "Specials" : tab;
  const tabGames = activeTab === "New & Trending"
    ? newAndTrendingGames
    : activeTab === "Specials" ? saleGames : [];
  const filtered = tabGames.filter((game) => {
    const searchText = `${game.title} ${(game.tags || []).join(" ")}`.toLowerCase();
    const matchesQuery = !query || searchText.includes(query.toLowerCase());
    const matchesCategory = !category || game.category === category
      || (game.categories || []).includes(category)
      || (game.tags || []).includes(category);
    return matchesQuery && matchesCategory;
  });
  const visible = filtered;
  return (
    <section className="section discovery" id="discovery">
      <div
        className="discovery-tabs"
        role="tablist"
        aria-label="Discover games"
      >
        {tabs.map((item) => (
          <button
            role="tab"
            aria-selected={activeTab === item}
            aria-controls="discovery-results"
            id={`discovery-tab-${tabs.indexOf(item)}`}
            key={item}
            className={activeTab === item ? "active" : ""}
            onClick={() => {
              setTab(item);
              setSalesOnly(false);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      {(query || category || salesOnly) && (
        <div className="filter-summary">
          <span>
            {query && `Search: “${query}”`}
            {category && ` · ${category}`}
            {salesOnly && "All special offers"}
          </span>
          <button onClick={onClear}>
            Clear filters <Icon name="close" size={12} />
          </button>
        </div>
      )}
      <div
        className="game-list"
        role="tabpanel"
        id="discovery-results"
        aria-labelledby={`discovery-tab-${tabs.indexOf(activeTab)}`}
      >
        {visible.map((game) => (
          <button
            className="game-row"
            key={game.id}
            onClick={() => onSelect(game)}
          >
            <img src={game.image} alt={game.title} loading="lazy" />
            <div className="row-details">
              <h3>{game.title}</h3>
              <div className="row-platforms">
                <Platforms mac={game.mac} />
                <span>• {game.date}</span>
              </div>
              <div className="tags">
                {game.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="row-reviews">
              <strong>{game.reviews}</strong>
              <span>{game.reviewCount} reviews</span>
            </div>
            <Price game={game} />
          </button>
        ))}
        {!visible.length && !["Top Sellers", "Popular Upcoming"].includes(activeTab) && (
          <div className="empty-state">
            <Icon name="search" size={28} />
            <h3>
              {activeTab === "Specials"
                ? "No games are currently on sale"
                : query || category ? "No games found" : "No games were added in the last 15 days"}
            </h3>
            {(query || category) && <p>Try a different search or explore another category.</p>}
          </div>
        )}
      </div>
      {!(["Top Sellers", "Popular Upcoming"].includes(activeTab)) && (
        <div className="discovery-bottom">
          <span>Showing {visible.length} {visible.length === 1 ? "game" : "games"}</span>
        </div>
      )}
    </section>
  );
}
