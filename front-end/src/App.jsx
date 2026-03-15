import { useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeForm from "./pages/RecipeForm";
import MealPlan from "./pages/MealPlan";
import ShoppingList from "./pages/ShoppingList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNav from "./components/BottomNav";
import useMealPlanStore from "./store/mealPlanStore";
import useAuthStore from "./store/authStore";

function Navbar() {
  const { selectedIds } = useMealPlanStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="navbar-brand-icon">🍳</span>
        CuisineSync
      </NavLink>

      <div className="navbar-links navbar-links-desktop">
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

      {user && (
        <div className="navbar-user">
          <span className="navbar-username">{user.username}</span>
          <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      )}
    </nav>
  );
}

function AppRoutes() {
  const { init } = useAuthStore();
  const { user } = useAuthStore();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><RecipeList /></ProtectedRoute>} />
          <Route path="/recettes/nouvelle" element={<ProtectedRoute><RecipeForm /></ProtectedRoute>} />
          <Route path="/recettes/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
          <Route path="/panier" element={<ProtectedRoute><MealPlan /></ProtectedRoute>} />
          <Route path="/liste-de-courses" element={<ProtectedRoute><ShoppingList /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {user && !isLoginPage && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter basename="/CuisineSync">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
