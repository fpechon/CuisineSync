import { Link } from "react-router-dom";
import recipes from "../data/recipes";
import useMealPlanStore from "../store/mealPlanStore";

function aggregateIngredients(selectedRecipes) {
  const map = {};

  for (const recipe of selectedRecipes) {
    for (const ing of recipe.ingredients) {
      const key = `${ing.name}__${ing.unit}`;
      if (map[key]) {
        map[key].quantity += ing.quantity;
      } else {
        map[key] = { name: ing.name, quantity: ing.quantity, unit: ing.unit };
      }
    }
  }

  return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
}

function ShoppingList() {
  const { selectedIds } = useMealPlanStore();
  const selectedRecipes = recipes.filter((r) => selectedIds.includes(r.id));
  const ingredients = aggregateIngredients(selectedRecipes);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Liste de courses</h1>
        <Link to="/panier" className="link-back">← Panier</Link>
      </div>

      {selectedIds.length === 0 ? (
        <div className="empty-state">
          <p>Aucune recette sélectionnée.</p>
          <Link to="/" className="btn-primary">Parcourir les recettes</Link>
        </div>
      ) : (
        <>
          <p className="shopping-subtitle">
            Pour {selectedRecipes.length} recette{selectedRecipes.length > 1 ? "s" : ""} :{" "}
            {selectedRecipes.map((r) => r.name).join(", ")}
          </p>
          <ul className="shopping-list">
            {ingredients.map((ing, i) => (
              <li key={i} className="shopping-item">
                <label>
                  <input type="checkbox" />
                  <span>
                    <strong>
                      {Number.isInteger(ing.quantity)
                        ? ing.quantity
                        : ing.quantity.toFixed(1)}{" "}
                      {ing.unit}
                    </strong>{" "}
                    {ing.name}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ShoppingList;
