import { deleteJson, getJson, postJson } from "./apiClient";

export async function getWishlist() {
  const result = await getJson("/wishlist");
  return Array.isArray(result.data?.items) ? result.data.items : [];
}

export async function addWishlistProduct(productId) {
  const result = await postJson("/wishlist/items", { productId });
  return result.data?.item;
}

export async function removeWishlistProduct(productId) {
  return deleteJson(`/wishlist/items/${encodeURIComponent(productId)}`);
}
