import { Link } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";

const CARD_COLORS = [
  "#C4451A", // paprika
  "#8B5E3C", // caramel chaud
  "#2D6A4F", // olive
  "#A33815", // paprika foncé
  "#5C7A3E", // sauge
  "#6B4E2A", // brun épicé
];

function getCardColor(name) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_COLORS[hash % CARD_COLORS.length];
}

function RecipeCard({ recipe }) {
  const { isSelected, addRecipe, removeRecipe } = useMealPlanStore();
  const selected = isSelected(recipe.id);
  const color = getCardColor(recipe.name);
  const totalTime = recipe.prep_time + recipe.cook_time;

  function handleToggle(e) {
    e.preventDefault();
    selected ? removeRecipe(recipe.id) : addRecipe(recipe.id);
  }

  return (
    <Link to={`/recettes/${recipe.id}`} className={`recipe-card ${selected ? "selected" : ""}`}>
      <div className="recipe-card-banner" style={{ background: color }}>
        <span className="recipe-card-banner-icon">🍳</span>
        {selected && <span className="recipe-card-selected-badge">✓ Dans le panier</span>}
      </div>
      <div className="recipe-card-body">
        <h2 className="recipe-card-title">{recipe.name}</h2>
        <p className="recipe-card-description">{recipe.description}</p>
        <div className="recipe-card-meta">
          {totalTime > 0 && <span>⏱ {totalTime} min</span>}
          <span>👥 {recipe.servings} portions</span>
        </div>
      </div>
      <button
        className={`btn-toggle btn-card-full ${selected ? "btn-remove" : "btn-add"}`}
        onClick={handleToggle}
      >
        {selected ? "Retirer du panier" : "+ Ajouter au panier"}
      </button>
    </Link>
  );
}

export default RecipeCard;
