const API = import.meta.env.VITE_API_URL;

function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

export async function fetchRecipes() {
  const response = await fetch(`${API}/recipes/`, { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du chargement des recettes");
  return response.json();
}

export async function fetchRecipe(id) {
  const response = await fetch(`${API}/recipes/${id}/`, { credentials: "include" });
  if (response.status === 404) throw new Error("Recette introuvable");
  if (!response.ok) throw new Error("Erreur lors du chargement de la recette");
  return response.json();
}

export async function createRecipe(data) {
  const response = await fetch(`${API}/recipes/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCsrfToken() ?? "",
    },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok) throw json;
  return json;
}
