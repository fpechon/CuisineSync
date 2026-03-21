import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";
import { fetchRecipe } from "../services/recipes";
import { getRecipeColor } from "../lib/recipeColor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

function MealPlan() {
  const { selectedIds, removeRecipe, clear } = useMealPlanStore();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.allSettled(selectedIds.map(fetchRecipe))
      .then((results) => {
        results.forEach((r, i) => {
          if (r.status === "rejected") removeRecipe(selectedIds[i]);
        });
        setRecipes(results.filter((r) => r.status === "fulfilled").map((r) => r.value));
      })
      .finally(() => setLoading(false));
  }, [selectedIds.join(",")]);

  if (loading) return (
    <div className="spinner-wrapper">
      <div className="spinner" />
    </div>
  );

  const totalTime = recipes.reduce((sum, r) => sum + r.prep_time + r.cook_time, 0);
  const totalServings = recipes.reduce((sum, r) => sum + r.servings, 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Panier de la semaine</h1>
        <Link to="/" className="link-back">← Recettes</Link>
      </div>

      {selectedIds.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: "3rem" }}>🛒</span>
          <p>Aucune recette dans le panier.</p>
          <Link to="/" className="btn-primary">Parcourir les recettes</Link>
        </div>
      ) : (
        <>
          <div className="meal-plan-summary">
            <div className="summary-stat">
              <span className="summary-stat-value">{recipes.length}</span>
              <span className="summary-stat-label">recette{recipes.length > 1 ? "s" : ""}</span>
            </div>
            {totalTime > 0 && (
              <div className="summary-stat">
                <span className="summary-stat-value">{totalTime}</span>
                <span className="summary-stat-label">min au total</span>
              </div>
            )}
            <div className="summary-stat">
              <span className="summary-stat-value">{totalServings}</span>
              <span className="summary-stat-label">portions</span>
            </div>
          </div>

          <Link to="/liste-de-courses" className="btn-primary btn-full" style={{ textAlign: "center" }}>
            Générer la liste de courses →
          </Link>

          <ul className="meal-plan-list">
            {recipes.map((recipe) => {
              const color = getRecipeColor(recipe.name);
              return (
                <li key={recipe.id} className="meal-plan-item">
                  <span className="meal-plan-color-dot" style={{ background: color }} />
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
              );
            })}
          </ul>

          <button
            className="btn-secondary"
            style={{ alignSelf: "flex-start" }}
            onClick={() => setConfirmOpen(true)}
          >
            Vider le panier
          </button>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent className="dialog-paprika">
              <DialogHeader>
                <DialogTitle>Vider le panier ?</DialogTitle>
                <DialogDescription>
                  Cette action retirera les {recipes.length} recette{recipes.length > 1 ? "s" : ""} de ton panier. Elle est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <button className="btn-secondary" onClick={() => setConfirmOpen(false)}>
                  Annuler
                </button>
                <button
                  className="btn-danger"
                  onClick={() => { clear(); setConfirmOpen(false); }}
                >
                  Vider le panier
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default MealPlan;
