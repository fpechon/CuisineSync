import { create } from "zustand";
import { toast } from "sonner";
import {
  addRecipeToMealPlan,
  clearMealPlan,
  getMealPlan,
  removeRecipeFromMealPlan,
  updateRecipeServings,
} from "../services/mealPlan";

function entriesToServingsMap(entries) {
  const map = {};
  for (const entry of entries) {
    map[entry.recipe_id] = entry.servings ?? 1;
  }
  return map;
}

function servingsMapToSelectedIds(servingsMap) {
  return Object.keys(servingsMap).map(Number);
}

function applyEntries(entries) {
  const servingsMap = entriesToServingsMap(entries);
  return { entries, servingsMap, selectedIds: servingsMapToSelectedIds(servingsMap) };
}

const useMealPlanStore = create((set, get) => ({
  selectedIds: [],
  servingsMap: {},
  entries: [],

  fetchMealPlan: async () => {
    const { entries } = await getMealPlan();
    set(applyEntries(entries));
  },

  addRecipe: async (id, servings = 1) => {
    const previous = { servingsMap: get().servingsMap, selectedIds: get().selectedIds, entries: get().entries };
    const newServingsMap = { ...previous.servingsMap, [id]: servings };
    // Optimistic: update servingsMap/selectedIds but not entries (no recipe_name known yet)
    set({ servingsMap: newServingsMap, selectedIds: servingsMapToSelectedIds(newServingsMap) });
    try {
      const { entries } = await addRecipeToMealPlan(id, servings);
      set(applyEntries(entries));
    } catch {
      set(previous);
      toast.error("Impossible d'ajouter la recette au panier");
    }
  },

  removeRecipe: async (id) => {
    const previous = { servingsMap: get().servingsMap, selectedIds: get().selectedIds, entries: get().entries };
    const newServingsMap = { ...previous.servingsMap };
    delete newServingsMap[id];
    set({
      servingsMap: newServingsMap,
      selectedIds: servingsMapToSelectedIds(newServingsMap),
      entries: previous.entries.filter((e) => e.recipe_id !== id),
    });
    try {
      const { entries } = await removeRecipeFromMealPlan(id);
      set(applyEntries(entries));
    } catch {
      set(previous);
      toast.error("Impossible de retirer la recette du panier");
    }
  },

  updateServings: async (id, servings) => {
    const previous = { servingsMap: get().servingsMap, selectedIds: get().selectedIds, entries: get().entries };
    const newServingsMap = { ...previous.servingsMap, [id]: servings };
    const newEntries = previous.entries.map((e) =>
      e.recipe_id === id ? { ...e, servings } : e
    );
    set({ servingsMap: newServingsMap, selectedIds: servingsMapToSelectedIds(newServingsMap), entries: newEntries });
    try {
      const { entries } = await updateRecipeServings(id, servings);
      set(applyEntries(entries));
    } catch {
      set(previous);
      toast.error("Impossible de mettre à jour les couverts");
    }
  },

  clear: async () => {
    const previous = { servingsMap: get().servingsMap, selectedIds: get().selectedIds, entries: get().entries };
    set({ servingsMap: {}, selectedIds: [], entries: [] });
    try {
      const { entries } = await clearMealPlan();
      set(applyEntries(entries));
    } catch {
      set(previous);
      toast.error("Impossible de vider le panier");
    }
  },

  isSelected: (id) => get().selectedIds.includes(id),

  getServings: (id) => get().servingsMap[id] ?? 1,

  resetStore: () => set({ selectedIds: [], servingsMap: {}, entries: [] }),
}));

export default useMealPlanStore;
