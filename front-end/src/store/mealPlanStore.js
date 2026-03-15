import { create } from "zustand";
import { persist } from "zustand/middleware";

const useMealPlanStore = create(
  persist(
    (set, get) => ({
      selectedIds: [],

      addRecipe: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds
            : [...state.selectedIds, id],
        })),

      removeRecipe: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.filter((r) => r !== id),
        })),

      isSelected: (id) => get().selectedIds.includes(id),

      clear: () => set({ selectedIds: [] }),
    }),
    { name: "cuisinesync-meal-plan" }
  )
);

export default useMealPlanStore;
