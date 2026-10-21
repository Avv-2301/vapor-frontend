import { getJson, putJson } from "./apiClient";

export async function getProfile() {
  const result = await getJson("/profiles/me");
  return result.data;
}

export async function updateProfile(updates) {
  const result = await putJson("/profiles/me", updates);
  return result.data;
}

export async function getBillingAddress() {
  const result = await getJson("/users/me/billing");
  return result.data;
}

export async function saveBillingAddress(address) {
  const result = await putJson("/users/me/billing", address);
  return result.data;
}
