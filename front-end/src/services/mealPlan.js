import { apiFetch } from "./api";

export async function getMealPlan() {
  const data = await apiFetch("/meal-plan/");
  return { entries: data.entries ?? [] };
}

export async function addRecipeToMealPlan(id, servings) {
  const body = servings !== undefined ? { servings } : undefined;
  const data = await apiFetch(`/meal-plan/recipes/${id}/`, {
    method: "POST",
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { entries: data.entries ?? [] };
}

export async function removeRecipeFromMealPlan(id) {
  const data = await apiFetch(`/meal-plan/recipes/${id}/`, { method: "DELETE" });
  return { entries: data.entries ?? [] };
}

export async function clearMealPlan() {
  const data = await apiFetch("/meal-plan/", { method: "DELETE" });
  return { entries: data.entries ?? [] };
}

export async function updateRecipeServings(id, servings) {
  const data = await apiFetch(`/meal-plan/recipes/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ servings }),
  });
  return { entries: data.entries ?? [] };
}
