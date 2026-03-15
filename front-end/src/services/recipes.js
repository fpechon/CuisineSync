const API = import.meta.env.VITE_API_URL;

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
