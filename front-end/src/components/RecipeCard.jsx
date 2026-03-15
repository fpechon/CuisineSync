import { Link } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";

function RecipeCard({ recipe }) {
  const { isSelected, addRecipe, removeRecipe } = useMealPlanStore();
  const selected = isSelected(recipe.id);

  function handleToggle(e) {
    e.preventDefault();
    selected ? removeRecipe(recipe.id) : addRecipe(recipe.id);
  }

  return (
    <Link to={`/recettes/${recipe.id}`} className={`recipe-card ${selected ? "selected" : ""}`}>
      <div className="recipe-card-body">
        <h2 className="recipe-card-title">{recipe.name}</h2>
        <p className="recipe-card-description">{recipe.description}</p>
        <div className="recipe-card-meta">
          <span>⏱ {recipe.prepTime + recipe.cookTime} min</span>
          <span>👥 {recipe.servings} portions</span>
        </div>
      </div>
      <button
        className={`btn-toggle ${selected ? "btn-remove" : "btn-add"}`}
        onClick={handleToggle}
      >
        {selected ? "Retirer du panier" : "Ajouter au panier"}
      </button>
    </Link>
  );
}

export default RecipeCard;
