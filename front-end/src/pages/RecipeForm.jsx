import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRecipe } from "../services/recipes";
import { fetchIngredientNames, fetchUnits } from "../services/units";

const EMPTY_INGREDIENT = { name: "", quantity: "", unit: "" };
const EMPTY_STEP = "";

function RecipeForm() {
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [ingredientNames, setIngredientNames] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [fields, setFields] = useState({
    name: "",
    description: "",
    servings: 4,
    prep_time: "",
    cook_time: "",
  });
  const [steps, setSteps] = useState([EMPTY_STEP]);
  const [ingredients, setIngredients] = useState([{ ...EMPTY_INGREDIENT }]);

  useEffect(() => {
    fetchUnits().then(setUnits).catch(() => {});
    fetchIngredientNames().then(setIngredientNames).catch(() => {});
  }, []);

  function updateField(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // --- Steps ---
  function updateStep(i, value) {
    setSteps((s) => s.map((v, idx) => (idx === i ? value : v)));
  }
  function addStep() {
    setSteps((s) => [...s, EMPTY_STEP]);
  }
  function removeStep(i) {
    setSteps((s) => s.filter((_, idx) => idx !== i));
  }

  // --- Ingredients ---
  function updateIngredient(i, key, value) {
    setIngredients((list) =>
      list.map((ing, idx) => (idx === i ? { ...ing, [key]: value } : ing))
    );
  }
  function addIngredient() {
    setIngredients((list) => [...list, { ...EMPTY_INGREDIENT }]);
  }
  function removeIngredient(i) {
    setIngredients((list) => list.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      const recipe = await createRecipe({
        ...fields,
        servings: Number(fields.servings),
        prep_time: Number(fields.prep_time),
        cook_time: Number(fields.cook_time),
        steps: steps.filter((s) => s.trim()),
        ingredients: ingredients.filter((ing) => ing.name.trim() && ing.quantity && ing.unit),
      });
      navigate(`/recettes/${recipe.id}`);
    } catch (err) {
      setErrors(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Link to="/" className="link-back">← Retour aux recettes</Link>
      <h1>Nouvelle recette</h1>

      <form className="recipe-form" onSubmit={handleSubmit}>

        <section className="form-section">
          <div className="form-group">
            <label>Nom *</label>
            <input name="name" value={fields.name} onChange={updateField} required />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={fields.description} onChange={updateField} rows={2} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Portions *</label>
              <input name="servings" type="number" min="1" value={fields.servings} onChange={updateField} required />
            </div>
            <div className="form-group">
              <label>Préparation (min) *</label>
              <input name="prep_time" type="number" min="0" value={fields.prep_time} onChange={updateField} required />
            </div>
            <div className="form-group">
              <label>Cuisson (min) *</label>
              <input name="cook_time" type="number" min="0" value={fields.cook_time} onChange={updateField} required />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Ingrédients</h2>
          {errors.ingredients && (
            <p className="form-error">
              {typeof errors.ingredients === "string"
                ? errors.ingredients
                : "Vérifiez les ingrédients : nom, quantité et unité sont requis."}
            </p>
          )}
          <datalist id="ingredient-suggestions">
            {ingredientNames.map((name) => <option key={name} value={name} />)}
          </datalist>

          {ingredients.map((ing, i) => (
            <div key={i} className="form-row form-ingredient-row">
              <input
                placeholder="Ingrédient"
                list="ingredient-suggestions"
                value={ing.name}
                onChange={(e) => updateIngredient(i, "name", e.target.value)}
              />
              <input
                placeholder="Quantité"
                type="number"
                min="0.01"
                step="any"
                value={ing.quantity}
                required={!!ing.name.trim()}
                onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
              />
              <select
                value={ing.unit}
                required={!!ing.name.trim()}
                onChange={(e) => updateIngredient(i, "unit", e.target.value)}
              >
                <option value="" disabled>Unité</option>
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              {ingredients.length > 1 && (
                <button type="button" className="btn-remove btn-small" onClick={() => removeIngredient(i)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addIngredient}>+ Ingrédient</button>
        </section>

        <section className="form-section">
          <h2>Étapes</h2>
          {errors.steps && <p className="form-error">{errors.steps}</p>}
          {steps.map((step, i) => (
            <div key={i} className="form-row form-step-row">
              <span className="step-number">{i + 1}.</span>
              <textarea
                placeholder={`Étape ${i + 1}`}
                value={step}
                rows={2}
                onChange={(e) => updateStep(i, e.target.value)}
              />
              {steps.length > 1 && (
                <button type="button" className="btn-remove btn-small" onClick={() => removeStep(i)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addStep}>+ Étape</button>
        </section>

        {errors.non_field_errors && <p className="form-error">{errors.non_field_errors}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Enregistrement…" : "Créer la recette"}
        </button>

      </form>
    </div>
  );
}

export default RecipeForm;
