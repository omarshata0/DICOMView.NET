import { refreshToken, logout } from "../services/apiAuth.js";

export async function authenticatedFetch(url, options = {}) {
  let accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("No authenticated user");
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  let response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Access token expired --> try refreshing
    try {
      await refreshToken();
      // Update access token and RETRY
      accessToken = localStorage.getItem("accessToken");
      headers.Authorization = `Bearer ${accessToken}`;
      response = await fetch(url, { ...options, headers });
    } catch (refreshError) {
      console.log("Token refresh failed:", refreshError.message);
      await logout();
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!response.ok) {
    try {
      const data = await response.json();
      throw new Error(data.message || "API request failed");
    } catch {
      throw new Error("API request failed");
    }
  }

  return response;
}
