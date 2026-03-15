import { create } from "zustand";
import { fetchMe, login as apiLogin, logout as apiLogout } from "../services/auth";
import useMealPlanStore from "./mealPlanStore";

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  init: async () => {
    try {
      const user = await fetchMe();
      set({ user, loading: false });
      await useMealPlanStore.getState().fetchMealPlan();
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (username, password) => {
    const user = await apiLogin(username, password);
    set({ user });
    await useMealPlanStore.getState().fetchMealPlan();
    return user;
  },

  logout: async () => {
    await apiLogout();
    useMealPlanStore.getState().resetStore();
    set({ user: null });
  },
}));

export default useAuthStore;
