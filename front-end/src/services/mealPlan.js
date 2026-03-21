import { apiFetch } from "./api";

export async function getMealPlan() {
  return apiFetch("/meal-plan/");
}

export async function addRecipeToMealPlan(id) {
  return apiFetch(`/meal-plan/recipes/${id}/`, { method: "POST" });
}

export async function removeRecipeFromMealPlan(id) {
  return apiFetch(`/meal-plan/recipes/${id}/`, { method: "DELETE" });
}

export async function clearMealPlan() {
  return apiFetch("/meal-plan/", { method: "DELETE" });
}
