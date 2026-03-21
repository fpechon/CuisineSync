import { Link } from "react-router-dom";
import StepperInput from "./StepperInput";
import useServingsEditor from "../hooks/useServingsEditor";
import { getRecipeColor } from "../lib/recipeColor";

function MealPlanItem({ entry, onRemove }) {
  const { localValue, handleChange } = useServingsEditor(entry.recipe_id);
  const color = getRecipeColor(entry.recipe_name);

  return (
    <li className="meal-plan-item">
      <span className="meal-plan-color-dot" style={{ background: color }} />
      <Link to={`/recettes/${entry.recipe_id}`} className="meal-plan-name">
        {entry.recipe_name}
      </Link>
      <div className="meal-plan-servings" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <StepperInput
          name="servings"
          value={String(localValue)}
          onChange={handleChange}
          min={1}
          max={99}
        />
        <span style={{ fontSize: "0.82rem", color: "var(--color-text-muted)" }}>couverts</span>
      </div>
      <button
        className="btn-remove btn-small"
        onClick={() => onRemove(entry.recipe_id)}
      >
        Retirer
      </button>
    </li>
  );
}

export default MealPlanItem;
