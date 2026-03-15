import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipe } from "../services/recipes";

function MealPlan() {
  const { selectedIds, removeRecipe, clear } = useMealPlanStore();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.allSettled(selectedIds.map(fetchRecipe))
      .then((results) => {
        results.forEach((r, i) => { if (r.status === "rejected") removeRecipe(selectedIds[i]); });
        setRecipes(results.filter((r) => r.status === "fulfilled").map((r) => r.value));
      })
      .finally(() => setLoading(false));
  }, [selectedIds.join(",")]);

  if (loading) return <div className="page"><p>Chargement…</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Panier de la semaine</h1>
        <div className="page-header-actions">
          <Link to="/" className="link-back">← Recettes</Link>
          {selectedIds.length > 0 && (
            <Link to="/liste-de-courses" className="btn-primary">
              Voir la liste de courses
            </Link>
          )}
        </div>
      </div>

      {selectedIds.length === 0 ? (
        <div className="empty-state">
          <p>Aucune recette dans le panier.</p>
          <Link to="/" className="btn-primary">Parcourir les recettes</Link>
        </div>
      ) : (
        <>
          <ul className="meal-plan-list">
            {recipes.map((recipe) => (
              <li key={recipe.id} className="meal-plan-item">
                <Link to={`/recettes/${recipe.id}`} className="meal-plan-name">
                  {recipe.name}
                </Link>
                <div className="meal-plan-meta">
                  <span>⏱ {recipe.prep_time + recipe.cook_time} min</span>
                  <span>👥 {recipe.servings} portions</span>
                </div>
                <button
                  className="btn-remove btn-small"
                  onClick={() => removeRecipe(recipe.id)}
                >
                  Retirer
                </button>
              </li>
            ))}
          </ul>
          <button className="btn-secondary" onClick={clear}>
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}

export default MealPlan;
