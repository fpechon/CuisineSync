import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ERROR_TRANSLATIONS = {
  "Ensure this field has at least 8 characters.": "Le mot de passe doit contenir au moins 8 caractères.",
  "This field may not be blank.": "Ce champ est requis.",
  "This field is required.": "Ce champ est requis.",
  "A user with that username already exists.": "Ce nom d'utilisateur est déjà pris.",
};

function translateError(err) {
  if (!err) return null;
  const str = Array.isArray(err) ? err[0] : String(err);
  return ERROR_TRANSLATIONS[str] || str;
}

function Register() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(username, password, passwordConfirm);
      navigate("/");
    } catch (err) {
      // err est un dict champ→liste d'erreurs (ex: { username: ["..."] })
      setErrors(typeof err === "object" && err !== null ? err : { non_field_errors: [String(err)] });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-brand">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CuisineSync" className="login-brand-logo" />
        </div>
        <p className="login-subtitle">Créez votre compte pour commencer</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            {errors.username && <p className="login-error">{translateError(errors.username)}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {errors.password && <p className="login-error">{translateError(errors.password)}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password-confirm">Confirmer le mot de passe</label>
            <input
              id="password-confirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
            {errors.password_confirm && (
              <p className="login-error">{translateError(errors.password_confirm)}</p>
            )}
          </div>

          {errors.non_field_errors && (
            <p className="login-error">{translateError(errors.non_field_errors)}</p>
          )}

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? "Création du compte…" : "Créer mon compte"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: "var(--color-primary)", fontWeight: 600 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
