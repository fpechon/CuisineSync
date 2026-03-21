import { apiFetch } from "./api";

export async function fetchRecipes() {
  return apiFetch("/recipes/");
}

export async function fetchRecipe(id) {
  try {
    return await apiFetch(`/recipes/${id}/`);
  } catch (err) {
    if (err?._status === 404) throw new Error("Recette introuvable");
    throw new Error("Erreur lors du chargement de la recette");
  }
}

export async function createRecipe(data) {
  return apiFetch("/recipes/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateRecipe(id, data) {
  return apiFetch(`/recipes/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteRecipe(id) {
  return apiFetch(`/recipes/${id}/`, { method: "DELETE" });
}
