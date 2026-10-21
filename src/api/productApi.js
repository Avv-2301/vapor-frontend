import { getJson } from "./apiClient";

export async function getFeaturedProducts() {
  const result = await getJson("/products/featured?limit=1000");
  return Array.isArray(result.data) ? result.data : [];
}

async function getAllProductsFromPage(endpoint) {
  const products = [];
  let page = 1;
  let totalPages = 1;

  do {
    const separator = endpoint.includes("?") ? "&" : "?";
    const result = await getJson(
      `${endpoint}${separator}page=${page}&limit=100`
    );
    const pageProducts = result.data?.products;
    if (!Array.isArray(pageProducts)) return products;
    products.push(...pageProducts);
    totalPages = Number(result.data?.pagination?.totalPages) || 1;
    page += 1;
  } while (page <= totalPages);

  return products;
}

export function getProductsOnSale() {
  return getAllProductsFromPage("/products/on-sale");
}

export function getRecentlyCreatedProducts() {
  return getAllProductsFromPage("/products/recently-created");
}

export async function getAllStoreProducts() {
  const products = await getAllProductsFromPage("/products");
  return products.map(toCatalogGame);
}

const toCatalogGame = (product) => {
  const hasDiscount = product.isDiscountActive === true
    && product.discountPrice != null
    && product.discountPrice < product.price
    && Number(product.discountPercentage) > 0;
  return {
    id: product.slug || product._id,
    cartIdentity: [product.slug, product._id, product.id, product.name].filter(Boolean),
    title: product.name,
    description: product.shortDescription || product.description || "",
    image: product.thumbnail || "",
    previews: (product.screenshots?.length ? product.screenshots : product.images?.length ? product.images : product.thumbnail ? [product.thumbnail] : []).slice(0, 4),
    price: hasDiscount ? product.discountPrice : product.price,
    original: hasDiscount ? product.price : null,
    discount: hasDiscount ? product.discountPercentage : 0,
    date: product.releaseDate ? new Date(product.releaseDate).toLocaleDateString() : "Coming soon",
    reviews: product.averageRating ? `${product.averageRating}/5` : "No reviews yet",
    reviewCount: product.reviewCount || 0,
    tags: product.tags?.length ? product.tags : product.genres || [],
    category: product.category || "",
    categories: product.category ? [product.category] : [],
    mac: product.platform?.includes("Mac") || false,
    edition: product.publisher || product.developer || product.name,
    developer: product.developer || "Unknown",
  };
};

export async function getHomeCatalog() {
  const [featuredProducts, saleProducts, recentProducts] = await Promise.all([
    getFeaturedProducts(),
    getProductsOnSale(),
    getRecentlyCreatedProducts(),
  ]);
  const featuredIds = new Set(featuredProducts.map((product) => String(product.slug || product._id)));
  return {
    featuredGames: featuredProducts.map(toCatalogGame),
    newAndTrendingGames: recentProducts.map(toCatalogGame),
    saleGames: saleProducts.map((product) => ({
      ...toCatalogGame(product),
      label: "Special Offer",
      offer: "Limited-time offer",
    })),
    specialOffers: saleProducts
      .filter((product) => !featuredIds.has(String(product.slug || product._id)))
      .map((product) => ({
        ...toCatalogGame(product),
        label: "Special Offer",
        offer: "Limited-time offer",
      })),
  };
}

export async function searchProducts(search, limit = 8) {
  const params = new URLSearchParams({ search, limit: String(limit) });
  const result = await getJson(`/products?${params.toString()}`);
  return Array.isArray(result.data?.products) ? result.data.products : [];
}

export async function getProductBySlug(slug) {
  const result = await getJson(`/products/slug/${encodeURIComponent(slug)}`);
  return result.data;
}

export async function getProductReviews(productId) {
  const result = await getJson(
    `/reviews/product/${encodeURIComponent(productId)}?limit=10`
  );
  return (
    result.data || {
      reviews: [],
      pagination: { totalReviews: 0 },
      ratingDistribution: [],
    }
  );
}
