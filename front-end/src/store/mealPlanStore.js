import { create } from "zustand";
import {
  addRecipeToMealPlan,
  clearMealPlan,
  getMealPlan,
  removeRecipeFromMealPlan,
} from "../services/mealPlan";

const useMealPlanStore = create((set, get) => ({
  selectedIds: [],

  fetchMealPlan: async () => {
    const data = await getMealPlan();
    set({ selectedIds: data.recipe_ids });
  },

  addRecipe: async (id) => {
    set((state) => ({ selectedIds: [...new Set([...state.selectedIds, id])] }));
    const data = await addRecipeToMealPlan(id);
    set({ selectedIds: data.recipe_ids });
  },

  removeRecipe: async (id) => {
    set((state) => ({ selectedIds: state.selectedIds.filter((r) => r !== id) }));
    const data = await removeRecipeFromMealPlan(id);
    set({ selectedIds: data.recipe_ids });
  },

  clear: async () => {
    set({ selectedIds: [] });
    const data = await clearMealPlan();
    set({ selectedIds: data.recipe_ids });
  },

  isSelected: (id) => get().selectedIds.includes(id),

  resetStore: () => set({ selectedIds: [] }),
}));

export default useMealPlanStore;
