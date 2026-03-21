import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMealPlan,
  addRecipeToMealPlan,
  removeRecipeFromMealPlan,
  clearMealPlan,
  updateRecipeServings,
} from "./mealPlan";

vi.mock("./api", () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from "./api";

const FAKE_ENTRIES = [{ recipe_id: 1, recipe_name: "Pâtes", recipe_base_servings: 4, servings: 6 }];

beforeEach(() => {
  vi.clearAllMocks();
  apiFetch.mockResolvedValue({ entries: FAKE_ENTRIES });
});

describe("getMealPlan", () => {
  it("appelle GET /meal-plan/ et retourne les entries", async () => {
    const result = await getMealPlan();
    expect(apiFetch).toHaveBeenCalledWith("/meal-plan/");
    expect(result.entries).toEqual(FAKE_ENTRIES);
  });
});

describe("addRecipeToMealPlan", () => {
  it("sans servings : envoie POST sans body", async () => {
    await addRecipeToMealPlan(1);
    expect(apiFetch).toHaveBeenCalledWith(
      "/meal-plan/recipes/1/",
      expect.objectContaining({ method: "POST" })
    );
    const options = apiFetch.mock.calls[0][1];
    expect(options.body).toBeUndefined();
    expect(options.headers).toBeUndefined();
  });

  it("avec servings : envoie Content-Type application/json et le body", async () => {
    await addRecipeToMealPlan(1, 6);
    const options = apiFetch.mock.calls[0][1];
    expect(options.method).toBe("POST");
    expect(options.headers?.["Content-Type"]).toBe("application/json");
    expect(JSON.parse(options.body)).toEqual({ servings: 6 });
  });
});

describe("updateRecipeServings", () => {
  it("envoie PATCH avec Content-Type application/json et le body", async () => {
    await updateRecipeServings(1, 8);
    const options = apiFetch.mock.calls[0][1];
    expect(options.method).toBe("PATCH");
    expect(options.headers?.["Content-Type"]).toBe("application/json");
    expect(JSON.parse(options.body)).toEqual({ servings: 8 });
  });
});

describe("removeRecipeFromMealPlan", () => {
  it("envoie DELETE sur /meal-plan/recipes/<id>/", async () => {
    await removeRecipeFromMealPlan(1);
    expect(apiFetch).toHaveBeenCalledWith("/meal-plan/recipes/1/", { method: "DELETE" });
  });
});

describe("clearMealPlan", () => {
  it("envoie DELETE sur /meal-plan/", async () => {
    await clearMealPlan();
    expect(apiFetch).toHaveBeenCalledWith("/meal-plan/", { method: "DELETE" });
  });
});
