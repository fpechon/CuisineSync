import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ShoppingList from "./ShoppingList";

vi.mock("../store/mealPlanStore");
vi.mock("../services/recipes");
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipe } from "../services/recipes";
import { toast } from "sonner";

const FAKE_RECIPE = {
  id: 1,
  name: "Pâtes bolognaise",
  servings: 4,
  ingredients: [
    { name: "pâtes", quantity: "400", unit: "g" },
    { name: "viande hachée", quantity: "300", unit: "g" },
  ],
};

function renderShoppingList() {
  return render(
    <MemoryRouter>
      <ShoppingList />
    </MemoryRouter>
  );
}

describe("ShoppingList — bouton copier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useMealPlanStore.mockReturnValue({
      selectedIds: [1],
      servingsMap: { 1: 4 },
    });
    fetchRecipe.mockResolvedValue(FAKE_RECIPE);
  });

  it("appelle clipboard.writeText quand l'API clipboard est disponible", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    renderShoppingList();
    await waitFor(() => expect(screen.getByText(/copier la liste/i)).toBeInTheDocument());

    await user.click(screen.getByText(/copier la liste/i));

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain("pâtes");
    expect(toast.success).toHaveBeenCalled();
  });

  it("affiche un toast d'erreur quand clipboard.writeText rejette", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("Permission denied"));
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    renderShoppingList();
    await waitFor(() => expect(screen.getByText(/copier la liste/i)).toBeInTheDocument());

    await user.click(screen.getByText(/copier la liste/i));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("affiche un toast d'erreur quand l'API clipboard est indisponible (HTTP)", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });

    renderShoppingList();
    await waitFor(() => expect(screen.getByText(/copier la liste/i)).toBeInTheDocument());

    await user.click(screen.getByText(/copier la liste/i));

    expect(toast.error).toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
