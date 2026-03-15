import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipe } from "../services/recipes";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSelected, addRecipe, removeRecipe } = useMealPlanStore();

  useEffect(() => {
    fetchRecipe(id)
      .then(setRecipe)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><p>Chargement…</p></div>;
  if (error) return (
    <div className="page">
      <p className="login-error">{error}</p>
      <Link to="/" className="link-back">← Retour aux recettes</Link>
    </div>
  );

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
          <span>⏱ Préparation : {recipe.prep_time} min</span>
          <span>🍳 Cuisson : {recipe.cook_time} min</span>
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
            {recipe.ingredients.map((ing) => (
              <li key={ing.id}>
                <strong>{Number.isInteger(Number(ing.quantity)) ? Number(ing.quantity) : Number(ing.quantity).toFixed(1)} {ing.unit}</strong> {ing.name}
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
