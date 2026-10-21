import { useAppStore } from "../stores/appStore";

export function getCartIds() {
  return useAppStore.getState().cartIds;
}

function saveCartIds(ids) {
  const uniqueIds = [...new Set(ids)];
  useAppStore.getState().replaceCartIds(uniqueIds);
  return uniqueIds;
}

export function addCartItem(gameId) {
  useAppStore.getState().addCartId(gameId);
  return getCartIds();
}

export function removeCartItem(gameId) {
  useAppStore.getState().removeCartId(gameId);
  return getCartIds();
}

export function emptyCart() {
  useAppStore.getState().clearCartIds();
  return [];
}

export function replaceCartIds(ids) {
  return saveCartIds(ids.filter((id) => typeof id === "string"));
}
