const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export async function getJson(endpoint) {
  let response;

  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: "GET",
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to reach the account service. Please try again.");
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("The account service returned an invalid response.");
  }

  if (!response.ok || (result.meta?.code && result.meta.code >= 400)) {
    throw new Error(result.meta?.message || "The request could not be completed.");
  }

  return result;
}

export async function postJson(endpoint, payload) {
  let response;

  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Unable to reach the account service. Please try again.");
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("The account service returned an invalid response.");
  }

  if (!response.ok || (result.meta?.code && result.meta.code >= 400)) {
    throw new Error(result.meta?.message || "The request could not be completed.");
  }

  return result;
}

export async function putJson(endpoint, payload) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Unable to reach the account service. Please try again.");
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("The account service returned an invalid response.");
  }
  if (!response.ok || (result.meta?.code && result.meta.code >= 400)) {
    throw new Error(result.meta?.message || "The request could not be completed.");
  }
  return result;
}

export async function deleteJson(endpoint) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to reach the account service. Please try again.");
  }
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("The account service returned an invalid response.");
  }
  if (!response.ok || (result.meta?.code && result.meta.code >= 400)) {
    throw new Error(result.meta?.message || "The request could not be completed.");
  }
  return result;
}
