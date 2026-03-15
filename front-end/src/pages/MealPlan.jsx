import { Link } from "react-router-dom";
import recipes from "../data/recipes";
import useMealPlanStore from "../store/mealPlanStore";

function MealPlan() {
  const { selectedIds, removeRecipe, clear } = useMealPlanStore();
  const selectedRecipes = recipes.filter((r) => selectedIds.includes(r.id));

  return (
    <div className="page">
      <div className="page-header">
        <h1>Panier de la semaine</h1>
        <div className="page-header-actions">
          <Link to="/" className="link-back">← Recettes</Link>
          {selectedRecipes.length > 0 && (
            <Link to="/liste-de-courses" className="btn-primary">
              Voir la liste de courses
            </Link>
          )}
        </div>
      </div>

      {selectedRecipes.length === 0 ? (
        <div className="empty-state">
          <p>Aucune recette dans le panier.</p>
          <Link to="/" className="btn-primary">Parcourir les recettes</Link>
        </div>
      ) : (
        <>
          <ul className="meal-plan-list">
            {selectedRecipes.map((recipe) => (
              <li key={recipe.id} className="meal-plan-item">
                <Link to={`/recettes/${recipe.id}`} className="meal-plan-name">
                  {recipe.name}
                </Link>
                <div className="meal-plan-meta">
                  <span>⏱ {recipe.prepTime + recipe.cookTime} min</span>
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
