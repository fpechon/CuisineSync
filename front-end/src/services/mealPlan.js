const API = import.meta.env.VITE_API_URL;

function getCsrfToken() {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : null;
}

export async function getMealPlan() {
  const response = await fetch(`${API}/meal-plan/`, { credentials: "include" });
  if (!response.ok) throw new Error("Erreur lors du chargement du panier");
  return response.json();
}

export async function addRecipeToMealPlan(id) {
  const response = await fetch(`${API}/meal-plan/recipes/${id}/`, {
    method: "POST",
    credentials: "include",
    headers: { "X-CSRFToken": getCsrfToken() ?? "" },
  });
  if (!response.ok) throw new Error("Erreur lors de l'ajout au panier");
  return response.json();
}

export async function removeRecipeFromMealPlan(id) {
  const response = await fetch(`${API}/meal-plan/recipes/${id}/`, {
    method: "DELETE",
    credentials: "include",
    headers: { "X-CSRFToken": getCsrfToken() ?? "" },
  });
  if (!response.ok) throw new Error("Erreur lors du retrait du panier");
  return response.json();
}

export async function clearMealPlan() {
  const response = await fetch(`${API}/meal-plan/`, {
    method: "DELETE",
    credentials: "include",
    headers: { "X-CSRFToken": getCsrfToken() ?? "" },
  });
  if (!response.ok) throw new Error("Erreur lors du vidage du panier");
  return response.json();
}
