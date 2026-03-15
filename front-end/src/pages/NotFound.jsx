import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found">
      <span className="not-found-icon">🍳</span>
      <h1>Page introuvable</h1>
      <p>Cette page n'existe pas ou a été déplacée.</p>
      <Link to="/" className="btn-primary">← Retour aux recettes</Link>
    </div>
  );
}

export default NotFound;
