import { postJson } from "./apiClient";
import { AUTH_ENDPOINTS } from "./endpoints/authEndpoints";

export function loginUser(credentials) {
  return postJson(AUTH_ENDPOINTS.login, credentials);
}

export function registerUser(account) {
  return postJson(AUTH_ENDPOINTS.register, account);
}

export function logoutUser() {
  return postJson(AUTH_ENDPOINTS.logout, {});
}
