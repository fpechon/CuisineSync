import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// Mock react-router-dom useParams — MemoryRouter handles the rest
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => ({ id: undefined }),
  };
});

// Mock services to avoid real network calls
vi.mock('../services/units', () => ({
  fetchUnits: vi.fn().mockResolvedValue([]),
  fetchIngredientNames: vi.fn().mockResolvedValue([]),
}));

vi.mock('../services/recipes', () => ({
  fetchRecipe: vi.fn(),
  createRecipe: vi.fn(),
  updateRecipe: vi.fn(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import RecipeForm from './RecipeForm';

function renderRecipeForm() {
  return render(
    <MemoryRouter>
      <RecipeForm />
    </MemoryRouter>
  );
}

describe('RecipeForm (mode creation)', () => {
  it('affiche initialement 1 ligne d ingredient', async () => {
    renderRecipeForm();
    // Wait for the async effects (fetchUnits / fetchIngredientNames) to resolve
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Ingrédient')).toHaveLength(1);
    });
  });

  it('ajoute une ligne d ingredient au clic sur + Ingredient', async () => {
    const user = userEvent.setup();
    renderRecipeForm();

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Ingrédient')).toHaveLength(1);
    });

    await user.click(screen.getByRole('button', { name: /\+ ingrédient/i }));

    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Ingrédient')).toHaveLength(2);
    });
  });
});
