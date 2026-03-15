import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipe } from "../services/recipes";

const CARD_COLORS = [
  "#C4451A", "#8B5E3C", "#2D6A4F",
  "#A33815", "#5C7A3E", "#6B4E2A",
];

function getCardColor(name) {
  const hash = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return CARD_COLORS[hash % CARD_COLORS.length];
}

function formatQty(qty) {
  const n = Number(qty);
  return Number.isInteger(n) ? n : n.toFixed(1);
}

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());
  const { isSelected, addRecipe, removeRecipe } = useMealPlanStore();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setError(null);
    fetchRecipe(id)
      .then(setRecipe)
      .catch((err) => {
        if (err.message === "Recette introuvable") setNotFound(true);
        else setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function toggleIngredient(ingId) {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(ingId) ? next.delete(ingId) : next.add(ingId);
      return next;
    });
  }

  if (loading) return (
    <div className="spinner-wrapper">
      <div className="spinner" />
    </div>
  );

  if (notFound) return (
    <div className="not-found">
      <span className="not-found-icon">🍳</span>
      <h1>Recette introuvable</h1>
      <p>Cette recette n'existe pas ou a été supprimée.</p>
      <Link to="/" className="btn-primary">← Retour aux recettes</Link>
    </div>
  );

  if (error) return (
    <div className="page">
      <Link to="/" className="link-back">← Retour aux recettes</Link>
      <p className="login-error">{error}</p>
    </div>
  );

  const selected = isSelected(recipe.id);
  const color = getCardColor(recipe.name);
  const totalTime = recipe.prep_time + recipe.cook_time;

  function handleToggle() {
    selected ? removeRecipe(recipe.id) : addRecipe(recipe.id);
  }

  return (
    <div className="page">
      <Link to="/" className="link-back">← Retour aux recettes</Link>

      <div className="recipe-hero" style={{ background: color }}>
        <h1 className="recipe-hero-title">{recipe.name}</h1>
        <div className="recipe-hero-meta">
          {recipe.prep_time > 0 && <span>Prép. {recipe.prep_time} min</span>}
          {recipe.cook_time > 0 && <span>Cuisson {recipe.cook_time} min</span>}
          {totalTime > 0 && <span>⏱ {totalTime} min au total</span>}
          <span>👥 {recipe.servings} portions</span>
        </div>
      </div>

      {recipe.description && (
        <p className="recipe-description">{recipe.description}</p>
      )}

      <button
        className={`btn-toggle ${selected ? "btn-remove" : "btn-add"}`}
        onClick={handleToggle}
        style={{ alignSelf: "flex-start" }}
      >
        {selected ? "✓ Dans le panier — retirer" : "Ajouter au panier"}
      </button>

      <div className="recipe-detail-body">
        <section className="recipe-ingredients">
          <h2>Ingrédients</h2>
          <ul>
            {recipe.ingredients.map((ing) => (
              <li
                key={ing.id}
                className={`recipe-ingredient-item ${checkedIngredients.has(ing.id) ? "checked" : ""}`}
                onClick={() => toggleIngredient(ing.id)}
              >
                <span className="ingredient-checkbox">
                  {checkedIngredients.has(ing.id) ? "✓" : ""}
                </span>
                <span>
                  <strong>{formatQty(ing.quantity)} {ing.unit}</strong> {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="recipe-steps">
          <h2>Préparation</h2>
          <ol className="recipe-steps-list">
            {recipe.steps.map((step, i) => (
              <li key={i} className="recipe-step-item">
                <span className="step-circle" style={{ background: color }}>{i + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

export default RecipeDetail;
