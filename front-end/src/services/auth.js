const API = import.meta.env.VITE_API_URL;

function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

export async function fetchMe() {
  const response = await fetch(`${API}/auth/me/`, { credentials: "include" });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Erreur réseau");
  return response.json();
}

export async function login(username, password) {
  const response = await fetch(`${API}/auth/login/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCsrfToken() ?? "",
    },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message ?? "Erreur de connexion");
  return data;
}

export async function logout() {
  await fetch(`${API}/auth/logout/`, {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRFToken": getCsrfToken() ?? "" },
  });
}
