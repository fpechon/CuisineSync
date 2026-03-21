const API = import.meta.env.VITE_API_URL;

function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : "";
}

/**
 * Wrapper centralisé pour tous les appels API.
 * Gère automatiquement : base URL, credentials, CSRF, et erreurs structurées.
 *
 * @param {string} path - Chemin relatif (ex: "/recipes/")
 * @param {RequestInit} options - Options fetch standard
 * @returns {Promise<any>} - JSON parsé
 * @throws {object|Error} - Erreur structurée (body JSON) ou Error réseau
 */
export async function apiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const needsCsrf = method !== "GET" && method !== "HEAD";

  const headers = {
    ...(needsCsrf ? { "X-CSRFToken": getCsrfToken() } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
    headers,
  });

  // 204 No Content — pas de body
  if (response.status === 204) return null;

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const err = json ?? {};
    // Attacher le status HTTP pour permettre une gestion fine côté appelant
    if (typeof err === "object") err._status = response.status;
    throw err;
  }

  return json;
}
