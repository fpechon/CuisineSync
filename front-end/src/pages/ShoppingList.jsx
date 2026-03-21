import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipe } from "../services/recipes";

const CHECKED_KEY = "cs_shopping_checked";
const BASKET_KEY = "cs_shopping_basket_key";

function aggregateIngredients(recipes, servingsMap) {
  const map = {};
  for (const recipe of recipes) {
    const baseServings = recipe.servings || 1;
    const targetServings = servingsMap[recipe.id] ?? 1;
    const ratio = targetServings / baseServings;
    for (const ing of recipe.ingredients) {
      const key = `${ing.name}__${ing.unit}`;
      const scaledQty = parseFloat(ing.quantity) * ratio;
      if (map[key]) {
        map[key].quantity += scaledQty;
      } else {
        map[key] = { name: ing.name, quantity: scaledQty, unit: ing.unit };
      }
    }
  }
  return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
}

function ShoppingList() {
  const { selectedIds, servingsMap } = useMealPlanStore();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const basketKey = selectedIds
    .map((id) => `${id}:${servingsMap[id] ?? 1}`)
    .join(",");

  // Lazy init: reads localStorage once at mount, avoids race condition
  const [checked, setChecked] = useState(() => {
    try {
      const storedKey = localStorage.getItem(BASKET_KEY);
      if (storedKey !== basketKey) return {};
      const stored = localStorage.getItem(CHECKED_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

  // Persist checked on each change
  useEffect(() => {
    localStorage.setItem(CHECKED_KEY, JSON.stringify(checked));
  }, [checked]);

  // Reset if basket changes after mount
  useEffect(() => {
    const storedKey = localStorage.getItem(BASKET_KEY);
    if (storedKey !== basketKey) {
      setChecked({});
      localStorage.setItem(BASKET_KEY, basketKey);
      localStorage.removeItem(CHECKED_KEY);
    }
  }, [basketKey]);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.allSettled(selectedIds.map(fetchRecipe))
      .then((results) => {
        setRecipes(results.filter((r) => r.status === "fulfilled").map((r) => r.value));
      })
      .finally(() => setLoading(false));
  }, [basketKey]);

  function toggleItem(key) {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  if (loading) return (
    <div className="spinner-wrapper">
      <div className="spinner" />
    </div>
  );

  const ingredients = aggregateIngredients(recipes, servingsMap);
  const checkedCount = ingredients.filter((ing) => checked[`${ing.name}__${ing.unit}`]).length;

  function copyList() {
    const header = `Liste de courses — CuisineSync\n${recipes.map((r) => r.name).join(", ")}\n\n`;
    const lines = ingredients.map((ing) => {
      const qty = Number.isInteger(ing.quantity) ? ing.quantity : ing.quantity.toFixed(1);
      const key = `${ing.name}__${ing.unit}`;
      const check = checked[key] ? "✓" : "☐";
      return `${check} ${qty} ${ing.unit} ${ing.name}`;
    }).join("\n");
    navigator.clipboard.writeText(header + lines).then(() => {
      toast.success("Liste copiée dans le presse-papier !");
    });
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Liste de courses</h1>
        <Link to="/panier" className="link-back">← Panier</Link>
      </div>

      {selectedIds.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "3rem" }}>🛒</span>
          <p>Aucune recette sélectionnée.</p>
          <Link to="/" className="btn-primary">Parcourir les recettes</Link>
        </div>
      ) : (
        <>
          <div className="shopping-header">
            <p className="shopping-subtitle">
              {recipes.length} recette{recipes.length > 1 ? "s" : ""} · {ingredients.length} ingrédient{ingredients.length > 1 ? "s" : ""}
              {checkedCount > 0 && ` · ${checkedCount}/${ingredients.length} cochés`}
            </p>
            <button className="btn-secondary" onClick={copyList}>
              📋 Copier la liste
            </button>
          </div>

          <ul className="shopping-list">
            {ingredients.map((ing) => {
              const key = `${ing.name}__${ing.unit}`;
              const isChecked = !!checked[key];
              const qty = Number.isInteger(ing.quantity) ? ing.quantity : ing.quantity.toFixed(1);
              return (
                <li key={key} className={`shopping-item ${isChecked ? "checked" : ""}`}>
                  <label className="shopping-label">
                    <input
                      type="checkbox"
                      className="shopping-checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(key)}
                    />
                    <span className="shopping-item-text">
                      <strong>{qty} {ing.unit}</strong> {ing.name}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default ShoppingList;
