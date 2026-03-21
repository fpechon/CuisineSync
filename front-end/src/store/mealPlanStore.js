import { create } from "zustand";
import { toast } from "sonner";
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
    const previous = get().selectedIds;
    set((state) => ({ selectedIds: [...new Set([...state.selectedIds, id])] }));
    try {
      const data = await addRecipeToMealPlan(id);
      set({ selectedIds: data.recipe_ids });
    } catch {
      set({ selectedIds: previous });
      toast.error("Impossible d'ajouter la recette au panier");
    }
  },

  removeRecipe: async (id) => {
    const previous = get().selectedIds;
    set((state) => ({ selectedIds: state.selectedIds.filter((r) => r !== id) }));
    try {
      const data = await removeRecipeFromMealPlan(id);
      set({ selectedIds: data.recipe_ids });
    } catch {
      set({ selectedIds: previous });
      toast.error("Impossible de retirer la recette du panier");
    }
  },

  clear: async () => {
    const previous = get().selectedIds;
    set({ selectedIds: [] });
    try {
      const data = await clearMealPlan();
      set({ selectedIds: data.recipe_ids });
    } catch {
      set({ selectedIds: previous });
      toast.error("Impossible de vider le panier");
    }
  },

  isSelected: (id) => get().selectedIds.includes(id),

  resetStore: () => set({ selectedIds: [] }),
}));

export default useMealPlanStore;
