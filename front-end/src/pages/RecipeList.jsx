import recipes from "../data/recipes";
import RecipeCard from "../components/RecipeCard";
import useMealPlanStore from "../store/mealPlanStore";
import { Link } from "react-router-dom";

function RecipeList() {
  const { selectedIds } = useMealPlanStore();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mes recettes</h1>
        {selectedIds.length > 0 && (
          <Link to="/panier" className="btn-primary">
            Voir le panier ({selectedIds.length})
          </Link>
        )}
      </div>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
