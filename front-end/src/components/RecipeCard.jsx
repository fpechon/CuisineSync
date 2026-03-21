import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import useMealPlanStore from "../store/mealPlanStore";
import { getRecipeColor } from "../lib/recipeColor";
import AddToCartDialog from "./AddToCartDialog";

function RecipeCard({ recipe }) {
  const { isSelected, addRecipe, removeRecipe } = useMealPlanStore();
  const selected = isSelected(recipe.id);
  const color = getRecipeColor(recipe.name);
  const totalTime = recipe.prep_time + recipe.cook_time;
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleToggle(e) {
    e.preventDefault();
    if (selected) {
      removeRecipe(recipe.id);
      toast("Retiré du panier", {
        action: { label: "Annuler", onClick: () => addRecipe(recipe.id, recipe.servings) },
      });
    } else {
      setDialogOpen(true);
    }
  }

  function handleConfirm(servings) {
    addRecipe(recipe.id, servings);
    setDialogOpen(false);
    toast.success(`"${recipe.name}" ajouté au panier`);
  }

  return (
    <>
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

      <AddToCartDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        recipe={recipe}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default RecipeCard;
