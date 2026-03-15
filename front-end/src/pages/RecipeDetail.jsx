import { useParams, Link } from "react-router-dom";
import recipes from "../data/recipes";
import useMealPlanStore from "../store/mealPlanStore";

function RecipeDetail() {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === id);
  const { isSelected, addRecipe, removeRecipe } = useMealPlanStore();

  if (!recipe) {
    return (
      <div className="page">
        <p>Recette introuvable.</p>
        <Link to="/" className="link-back">← Retour aux recettes</Link>
      </div>
    );
  }

  const selected = isSelected(recipe.id);

  function handleToggle() {
    selected ? removeRecipe(recipe.id) : addRecipe(recipe.id);
  }

  return (
    <div className="page">
      <Link to="/" className="link-back">← Retour aux recettes</Link>

      <div className="recipe-detail-header">
        <h1>{recipe.name}</h1>
        <p className="recipe-description">{recipe.description}</p>
        <div className="recipe-meta">
          <span>⏱ Préparation : {recipe.prepTime} min</span>
          <span>🍳 Cuisson : {recipe.cookTime} min</span>
          <span>👥 {recipe.servings} portions</span>
        </div>
        <button
          className={`btn-toggle ${selected ? "btn-remove" : "btn-add"}`}
          onClick={handleToggle}
        >
          {selected ? "✓ Dans le panier — retirer" : "Ajouter au panier"}
        </button>
      </div>

      <div className="recipe-detail-body">
        <section className="recipe-ingredients">
          <h2>Ingrédients</h2>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>
                <strong>{ing.quantity} {ing.unit}</strong> {ing.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="recipe-steps">
          <h2>Préparation</h2>
          <ol>
            {recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default RecipeDetail;
