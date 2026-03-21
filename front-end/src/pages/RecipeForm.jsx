import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { createRecipe, fetchRecipe, updateRecipe } from "../services/recipes";
import { fetchIngredientNames, fetchUnits } from "../services/units";
import IngredientCombobox from "../components/IngredientCombobox";
import StepperInput from "../components/StepperInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

const EMPTY_INGREDIENT = { name: "", quantity: "", unit: "" };
const EMPTY_STEP = "";

const ERROR_TRANSLATIONS = {
  "This field may not be blank.": "Ce champ est requis.",
  "This field is required.": "Ce champ est requis.",
  "A valid number is required.": "Veuillez entrer un nombre valide.",
  "Ensure this value is greater than or equal to 0.": "La valeur doit être ≥ 0.",
  "Ensure this value is greater than or equal to 1.": "La valeur doit être ≥ 1.",
  "This field must be unique.": "Une recette avec ce nom existe déjà.",
};

function translateError(err) {
  if (!err) return null;
  const str = Array.isArray(err) ? err[0] : String(err);
  return ERROR_TRANSLATIONS[str] || str;
}

function RecipeForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [units, setUnits] = useState([]);
  const [unitsError, setUnitsError] = useState(false);
  const [ingredientNames, setIngredientNames] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(isEditMode);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [fields, setFields] = useState({
    name: "",
    description: "",
    servings: 4,
    prep_time: "",
    cook_time: "",
  });
  const [steps, setSteps] = useState([EMPTY_STEP]);
  const [ingredients, setIngredients] = useState([{ ...EMPTY_INGREDIENT }]);

  // Snapshot de l'état initial en mode édition, pour calculer isDirty correctement
  const initialSnapshot = useRef(null);

  const [leaveOpen, setLeaveOpen] = useState(false);

  const isDirty = initialSnapshot.current === null
    ? (fields.name.trim() !== "" || fields.description.trim() !== "" ||
       ingredients.some(ing => ing.name.trim() !== "") || steps.some(s => s.trim() !== ""))
    : JSON.stringify({ fields, steps, ingredients }) !== initialSnapshot.current;

  // Interception fermeture onglet / rechargement
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    fetchUnits().then(setUnits).catch(() => setUnitsError(true));
    fetchIngredientNames().then(setIngredientNames).catch(() => {
      console.error("Impossible de charger les suggestions d'ingrédients.");
    });
  }, []);

  // Chargement de la recette existante en mode édition
  useEffect(() => {
    if (!isEditMode) return;
    fetchRecipe(id).then((recipe) => {
      const loadedFields = {
        name: recipe.name,
        description: recipe.description,
        servings: recipe.servings,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
      };
      const loadedSteps = recipe.steps.length ? recipe.steps : [EMPTY_STEP];
      const loadedIngredients = recipe.ingredients.map(ing => ({
        name: ing.name,
        quantity: String(ing.quantity),
        unit: ing.unit,
      }));
      setFields(loadedFields);
      setSteps(loadedSteps);
      setIngredients(loadedIngredients);
      initialSnapshot.current = JSON.stringify({
        fields: loadedFields,
        steps: loadedSteps,
        ingredients: loadedIngredients,
      });
      setLoadingRecipe(false);
    }).catch(() => {
      navigate("/");
    });
  }, [id, isEditMode, navigate]);

  function updateField(e) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function touchField(name) {
    setTouched(t => ({ ...t, [name]: true }));
  }

  function getFieldError(name) {
    // Backend error takes priority
    if (errors[name]) return translateError(errors[name]);
    // Client-side validation only after field is touched
    if (!touched[name]) return null;
    if (name === "name" && !fields.name.trim()) return "Le nom est requis.";
    if (name === "servings" && !fields.servings) return "Les portions sont requises.";
    if (name === "prep_time" && fields.prep_time === "") return "La durée de préparation est requise.";
    if (name === "cook_time" && fields.cook_time === "") return "La durée de cuisson est requise.";
    return null;
  }

  // --- Steps ---
  function updateStep(i, value) {
    setSteps(s => s.map((v, idx) => idx === i ? value : v));
  }
  function addStep() { setSteps(s => [...s, EMPTY_STEP]); }
  function removeStep(i) { setSteps(s => s.filter((_, idx) => idx !== i)); }

  // --- Ingredients ---
  function updateIngredient(i, key, value) {
    setIngredients(list => list.map((ing, idx) => idx === i ? { ...ing, [key]: value } : ing));
  }
  function addIngredient() { setIngredients(list => [...list, { ...EMPTY_INGREDIENT }]); }
  function removeIngredient(i) { setIngredients(list => list.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...fields,
      servings: Number(fields.servings),
      prep_time: Number(fields.prep_time),
      cook_time: Number(fields.cook_time),
      steps: steps.filter(s => s.trim()),
      ingredients: ingredients.filter(ing => ing.name.trim() && ing.quantity && ing.unit),
    };
    try {
      if (isEditMode) {
        const recipe = await updateRecipe(id, payload);
        toast.success("Recette mise à jour");
        navigate(`/recettes/${recipe.id}`);
      } else {
        const recipe = await createRecipe(payload);
        navigate(`/recettes/${recipe.id}`);
      }
    } catch (err) {
      setErrors(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingRecipe) {
    return <div className="page"><p className="text-muted">Chargement…</p></div>;
  }

  return (
    <div className="page">
      <button
        type="button"
        className="link-back"
        onClick={() => isDirty ? setLeaveOpen(true) : navigate(isEditMode ? `/recettes/${id}` : "/")}
      >
        {isEditMode ? "← Retour à la recette" : "← Retour aux recettes"}
      </button>
      <h1>{isEditMode ? "Modifier la recette" : "Nouvelle recette"}</h1>

      <form className="recipe-form" onSubmit={handleSubmit}>

        <section className="form-section">
          <h2 className="form-section-title">🧾 Informations générales</h2>

          <div className="form-group">
            <label>Nom *</label>
            <input
              name="name"
              value={fields.name}
              onChange={updateField}
              onBlur={() => touchField("name")}
              className={getFieldError("name") ? "input-error" : ""}
              required
            />
            {getFieldError("name") && <p className="form-error">{getFieldError("name")}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={fields.description} onChange={updateField} rows={2} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Portions *</label>
              <StepperInput
                name="servings"
                value={fields.servings}
                onChange={updateField}
                onBlur={() => touchField("servings")}
                min={1}
                max={50}
                className={getFieldError("servings") ? "input-error" : ""}
              />
              {getFieldError("servings") && <p className="form-error">{getFieldError("servings")}</p>}
            </div>
            <div className="form-group">
              <label>Préparation *</label>
              <div className={`input-with-unit ${getFieldError("prep_time") ? "input-error" : ""}`}>
                <input
                  name="prep_time"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={fields.prep_time}
                  onChange={updateField}
                  onBlur={() => touchField("prep_time")}
                  required
                />
                <span className="input-unit">min</span>
              </div>
              {getFieldError("prep_time") && <p className="form-error">{getFieldError("prep_time")}</p>}
            </div>
            <div className="form-group">
              <label>Cuisson *</label>
              <div className={`input-with-unit ${getFieldError("cook_time") ? "input-error" : ""}`}>
                <input
                  name="cook_time"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={fields.cook_time}
                  onChange={updateField}
                  onBlur={() => touchField("cook_time")}
                  required
                />
                <span className="input-unit">min</span>
              </div>
              {getFieldError("cook_time") && <p className="form-error">{getFieldError("cook_time")}</p>}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2 className="form-section-title">🥕 Ingrédients</h2>
          {unitsError && (
            <p className="form-error" style={{ marginBottom: "0.5rem" }}>
              Impossible de charger les unités. Saisissez-les manuellement.
            </p>
          )}
          {errors.ingredients && (
            <p className="form-error">
              {typeof errors.ingredients === "string"
                ? errors.ingredients
                : "Vérifiez les ingrédients : nom, quantité et unité sont requis."}
            </p>
          )}

          {ingredients.map((ing, i) => (
            <div key={i} className="form-row form-ingredient-row">
              <IngredientCombobox
                value={ing.name}
                onChange={val => updateIngredient(i, "name", val)}
                suggestions={ingredientNames}
              />
              <input
                placeholder="Qté"
                type="number"
                min="0.01"
                step="any"
                inputMode="decimal"
                value={ing.quantity}
                required={!!ing.name.trim()}
                onChange={e => updateIngredient(i, "quantity", e.target.value)}
              />
              {unitsError ? (
                <input
                  placeholder="Unité"
                  value={ing.unit}
                  required={!!ing.name.trim()}
                  onChange={e => updateIngredient(i, "unit", e.target.value)}
                />
              ) : (
                <select
                  value={ing.unit}
                  required={!!ing.name.trim()}
                  onChange={e => updateIngredient(i, "unit", e.target.value)}
                >
                  <option value="" disabled>Unité</option>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              )}
              {ingredients.length > 1 && (
                <button type="button" className="btn-remove btn-small" onClick={() => removeIngredient(i)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addIngredient}>+ Ingrédient</button>
        </section>

        <section className="form-section">
          <h2 className="form-section-title">👨‍🍳 Préparation</h2>
          {errors.steps && <p className="form-error">{translateError(errors.steps)}</p>}
          {steps.map((step, i) => (
            <div key={i} className="form-row form-step-row">
              <span className="step-number">{i + 1}.</span>
              <textarea
                placeholder={`Étape ${i + 1}`}
                value={step}
                rows={2}
                onChange={e => updateStep(i, e.target.value)}
              />
              {steps.length > 1 && (
                <button type="button" className="btn-remove btn-small" onClick={() => removeStep(i)}>✕</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-secondary" onClick={addStep}>+ Étape</button>
        </section>

        {errors.non_field_errors && (
          <p className="form-error">
            {translateError(errors.non_field_errors) || "Une erreur s'est produite. Vérifiez le formulaire."}
          </p>
        )}
        {errors.detail && (
          <p className="form-error">{translateError(errors.detail) || "Une erreur s'est produite."}</p>
        )}

        <button type="submit" className="btn-primary btn-full" disabled={submitting}>
          {submitting
            ? <><span className="btn-spinner" /> Enregistrement…</>
            : isEditMode ? "Enregistrer les modifications" : "Créer la recette"}
        </button>

      </form>

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent className="dialog-paprika">
          <DialogHeader>
            <DialogTitle>Quitter sans enregistrer ?</DialogTitle>
            <DialogDescription>
              Les données du formulaire seront perdues définitivement.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button className="btn-secondary" onClick={() => setLeaveOpen(false)}>
              Continuer la saisie
            </button>
            <button className="btn-danger" onClick={() => navigate(isEditMode ? `/recettes/${id}` : "/")}>
              Quitter
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RecipeForm;
