import { NavLink } from "react-router-dom";
import useMealPlanStore from "../store/mealPlanStore";

function BottomNav() {
  const { selectedIds } = useMealPlanStore();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}>
        <span className="bottom-nav-icon">🍽️</span>
        <span className="bottom-nav-label">Recettes</span>
      </NavLink>

      <NavLink to="/panier" className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}>
        <span className="bottom-nav-icon">
          🛒
          {selectedIds.length > 0 && <span className="bottom-nav-badge">{selectedIds.length}</span>}
        </span>
        <span className="bottom-nav-label">Panier</span>
      </NavLink>

      <NavLink to="/liste-de-courses" className={({ isActive }) => "bottom-nav-item" + (isActive ? " active" : "")}>
        <span className="bottom-nav-icon">📋</span>
        <span className="bottom-nav-label">Courses</span>
      </NavLink>
    </nav>
  );
}

export default BottomNav;
