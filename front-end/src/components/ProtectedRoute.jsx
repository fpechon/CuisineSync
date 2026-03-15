import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Spinner from "./Spinner";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
