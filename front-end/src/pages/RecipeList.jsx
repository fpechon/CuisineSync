import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";
import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipes } from "../services/recipes";

function RecipeList() {
  const { selectedIds } = useMealPlanStore();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return (
    <div className="page">
      <p className="login-error">{error}</p>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Mes recettes</h1>
        <div className="page-header-actions">
          <Link to="/recettes/nouvelle" className="btn-secondary">+ Nouvelle recette</Link>
          {selectedIds.length > 0 && (
            <Link to="/panier" className="btn-primary">
              Voir le panier ({selectedIds.length})
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="recipe-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <RecipeCardSkeleton key={i} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "3rem" }}>🍳</span>
          <p>Aucune recette pour l'instant.</p>
          <Link to="/recettes/nouvelle" className="btn-primary">+ Ajouter une recette</Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipeList;
