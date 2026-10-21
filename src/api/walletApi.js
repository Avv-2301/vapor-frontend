import { getJson, postJson } from "./apiClient";
import { WALLET_ENDPOINTS } from "./endpoints/walletEndpoints";

export async function getWallet() {
  const result = await getJson(WALLET_ENDPOINTS.me);
  return result.data;
}

export async function redeemGiftCard(code) {
  const result = await postJson(WALLET_ENDPOINTS.redeem, { code });
  return result.data;
}

export async function purchaseWithWallet() {
  const result = await postJson(WALLET_ENDPOINTS.purchase, {});
  return result.data;
}

export async function createStripeCheckout(purpose, amount) {
  const result = await postJson(WALLET_ENDPOINTS.stripeCheckout, { purpose, ...(amount == null ? {} : { amount }) });
  return result.data;
}

export async function confirmStripeCheckout(sessionId) {
  const result = await postJson(WALLET_ENDPOINTS.stripeConfirm, { sessionId });
  return result.data;
}


