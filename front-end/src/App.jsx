import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import MealPlan from "./pages/MealPlan";
import ShoppingList from "./pages/ShoppingList";
import useMealPlanStore from "./store/mealPlanStore";
function Navbar() {
  const { selectedIds } = useMealPlanStore();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">CuisineSync</NavLink>
      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Recettes
        </NavLink>
        <NavLink to="/panier" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Panier {selectedIds.length > 0 && <span className="badge">{selectedIds.length}</span>}
        </NavLink>
        <NavLink to="/liste-de-courses" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Liste de courses
        </NavLink>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter basename="/CuisineSync">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recettes/:id" element={<RecipeDetail />} />
          <Route path="/panier" element={<MealPlan />} />
          <Route path="/liste-de-courses" element={<ShoppingList />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
