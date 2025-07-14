export async function signup({ username, email, password }) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to sign up");
  }

  return data;
}

export async function login({ username, password }) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to log in");
  }

  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return true;
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to refresh token");
  }

  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return data;
}

export async function getCurrentUser() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    return null;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/user`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user");
  }

  return data || null;
}

export async function logout() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/auth/logout`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  console.log(localStorage.getItem("accessToken"));
  console.log(localStorage.getItem("refreshToken"));

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to log out");
  }
}
