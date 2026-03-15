import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipe } from "../services/recipes";

function aggregateIngredients(recipes) {
  const map = {};

  for (const recipe of recipes) {
    for (const ing of recipe.ingredients) {
      const key = `${ing.name}__${ing.unit}`;
      if (map[key]) {
        map[key].quantity += parseFloat(ing.quantity);
      } else {
        map[key] = { name: ing.name, quantity: parseFloat(ing.quantity), unit: ing.unit };
      }
    }
  }

  return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
}

function ShoppingList() {
  const { selectedIds } = useMealPlanStore();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }
    Promise.all(selectedIds.map(fetchRecipe))
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, [selectedIds.join(",")]);

  if (loading) return <div className="page"><p>Chargement…</p></div>;

  const ingredients = aggregateIngredients(recipes);

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
            Pour {recipes.length} recette{recipes.length > 1 ? "s" : ""} :{" "}
            {recipes.map((r) => r.name).join(", ")}
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
