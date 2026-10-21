import { deleteJson, getJson, postJson } from "./apiClient";

export async function getCart() {
  const result = await getJson("/cart");
  return Array.isArray(result.data?.items) ? result.data.items : [];
}

export async function addCartProduct(productId) {
  return postJson("/cart/items", { productId });
}

export async function removeCartProduct(productId) {
  return deleteJson(`/cart/items/${encodeURIComponent(productId)}`);
}

export async function clearRemoteCart() {
  return deleteJson("/cart");
}
