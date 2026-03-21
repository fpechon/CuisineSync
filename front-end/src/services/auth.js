import { apiFetch } from "./api";

export async function fetchMe() {
  try {
    return await apiFetch("/auth/me/");
  } catch (err) {
    if (err?._status === 401) return null;
    throw new Error("Erreur réseau");
  }
}

export async function login(username, password) {
  try {
    return await apiFetch("/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch (err) {
    throw new Error(err?.error?.message ?? "Erreur de connexion");
  }
}

export async function logout() {
  await apiFetch("/auth/logout/", { method: "POST" });
}

export async function register(username, password, passwordConfirm) {
  try {
    return await apiFetch("/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, password_confirm: passwordConfirm }),
    });
  } catch (err) {
    // Relancer le dict champ→erreurs pour affichage par champ dans Register.jsx
    throw err?.error?.message ?? err;
  }
}
