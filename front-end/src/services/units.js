import { apiFetch } from "./api";

export async function fetchUnits() {
  return apiFetch("/recipes/units/");
}

export async function fetchIngredientNames() {
  return apiFetch("/recipes/ingredients/");
}
