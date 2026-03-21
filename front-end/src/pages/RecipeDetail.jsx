import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipe } from "../services/recipes";
import { getRecipeColor } from "../lib/recipeColor";

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
  const color = getRecipeColor(recipe.name);
  const totalTime = recipe.prep_time + recipe.cook_time;

  function handleToggle() {
    if (selected) {
      removeRecipe(recipe.id);
      toast("Retiré du panier", {
        action: { label: "Annuler", onClick: () => addRecipe(recipe.id) },
      });
    } else {
      addRecipe(recipe.id);
      toast.success("Ajouté au panier");
    }
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
        className={`btn-toggle recipe-detail-basket-desktop ${selected ? "btn-remove" : "btn-add"}`}
        onClick={handleToggle}
        style={{ alignSelf: "flex-start" }}
      >
        {selected ? "✓ Dans le panier — retirer" : "Ajouter au panier"}
      </button>

      {/* FAB mobile — visible uniquement sur mobile (≤768px via CSS) */}
      <button
        className={`recipe-fab ${selected ? "btn-remove" : "btn-add"}`}
        onClick={handleToggle}
        aria-label={selected ? "Retirer du panier" : "Ajouter au panier"}
      >
        {selected ? "✓ Dans le panier" : "+ Panier"}
      </button>

      <div className="recipe-detail-body">
        <section className="recipe-ingredients">
          <h2>Ingrédients</h2>
          {recipe.ingredients.length === 0 ? (
            <p className="empty-section">Aucun ingrédient renseigné.</p>
          ) : (
            <ul>
              {recipe.ingredients.map((ing) => (
                <li key={ing.id} className="recipe-ingredient-item">
                  <label className={`ingredient-label ${checkedIngredients.has(ing.id) ? "checked" : ""}`}>
                    <input
                      type="checkbox"
                      className="ingredient-checkbox"
                      checked={checkedIngredients.has(ing.id)}
                      onChange={() => toggleIngredient(ing.id)}
                    />
                    <strong>{formatQty(ing.quantity)} {ing.unit}</strong> {ing.name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="recipe-steps">
          <h2>Préparation</h2>
          {recipe.steps.length === 0 ? (
            <p className="empty-section">Aucune étape renseignée.</p>
          ) : (
            <ol className="recipe-steps-list">
              {recipe.steps.map((step, i) => (
                <li key={i} className="recipe-step-item">
                  <span className="step-circle" style={{ background: color }} aria-hidden="true">{i + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

export default RecipeDetail;
