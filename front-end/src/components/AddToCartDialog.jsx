import { useEffect, useState } from "react";
import StepperInput from "./StepperInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

function AddToCartDialog({ open, onOpenChange, recipe, onConfirm }) {
  const initialServings = Math.max(1, Number(recipe?.servings) || 1);
  const [localServings, setLocalServings] = useState(initialServings);

  // Reset stepper when dialog re-opens
  useEffect(() => {
    if (open) {
      setLocalServings(Math.max(1, Number(recipe?.servings) || 1));
    }
  }, [open, recipe?.servings]);

  function handleChange(e) {
    setLocalServings(Number(e.target.value));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dialog-paprika">
        <DialogHeader>
          <DialogTitle>Ajouter au panier</DialogTitle>
          <DialogDescription>{recipe?.name}</DialogDescription>
        </DialogHeader>

        <div className="form-group" style={{ alignItems: "center", flexDirection: "row", gap: "1rem", justifyContent: "center", padding: "0.5rem 0" }}>
          <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Couverts</label>
          <StepperInput
            name="servings"
            value={String(localServings)}
            onChange={handleChange}
            min={1}
            max={99}
          />
        </div>

        <DialogFooter>
          <button className="btn-secondary" onClick={() => onOpenChange(false)}>
            Annuler
          </button>
          <button
            className="btn-primary"
            onClick={() => onConfirm(localServings)}
          >
            Ajouter
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddToCartDialog;
