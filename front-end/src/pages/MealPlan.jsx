import { useState } from "react";
import { Link } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";
import MealPlanItem from "../components/MealPlanItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

function MealPlan() {
  const { selectedIds, servingsMap, entries, removeRecipe, clear } = useMealPlanStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const totalServings = Object.values(servingsMap).reduce((sum, s) => sum + s, 0);

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
              <span className="summary-stat-value">{selectedIds.length}</span>
              <span className="summary-stat-label">recette{selectedIds.length > 1 ? "s" : ""}</span>
            </div>
            {totalServings > 0 && (
              <div className="summary-stat">
                <span className="summary-stat-value">{totalServings}</span>
                <span className="summary-stat-label">portions</span>
              </div>
            )}
          </div>

          <Link to="/liste-de-courses" className="btn-primary btn-full" style={{ textAlign: "center" }}>
            Générer la liste de courses →
          </Link>

          <ul className="meal-plan-list">
            {entries.map((entry) => (
              <MealPlanItem
                key={entry.recipe_id}
                entry={entry}
                onRemove={removeRecipe}
              />
            ))}
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
                  Cette action retirera les {selectedIds.length} recette{selectedIds.length > 1 ? "s" : ""} de ton panier. Elle est irréversible.
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
