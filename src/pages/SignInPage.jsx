import { useId, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Icon from "../components/Icon";
import modules from "../data/modules";
import { isAuthenticated, signIn } from "../auth";
import "./SignInPage.css";

const DEFAULT_DESTINATION = `/modules/${modules[0].slug}`;

export default function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Retour vers la page demandée avant la redirection, sinon vers le premier module.
  const from = location.state?.from;
  const destination = from?.pathname?.startsWith("/modules/")
    ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
    : DEFAULT_DESTINATION;

  if (isAuthenticated()) return <Navigate to={destination} replace />;

  function submit(event) {
    event.preventDefault();
    if (signIn(email, password)) {
      navigate(destination, { replace: true });
      return;
    }
    setError("Adresse e-mail ou mot de passe incorrect.");
    setPassword("");
  }

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <SiteHeader />
      <main className="signin section-wrap" id="contenu" tabIndex={-1}>
        <div className="signin-copy">
          <div className="eyebrow">
            <span className="status-dot" /> ESPACE RÉSERVÉ
          </div>
          <h1>
            Entrez dans
            <br />
            le{" "}
            <span className="highlight">
              réseau
              <svg viewBox="0 0 400 16" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 11Q185-4 395 8" />
              </svg>
            </span>
            <span className="green-period">.</span>
          </h1>
          <p className="signin-description">
            Connectez-vous pour explorer les cinq modules de la plateforme : production, réseaux, équipements, acteurs et lieux.
          </p>
          <p className="signin-footnote">
            <Icon name="link" size={14} /> Accès réservé à l’équipe VORTEX.
          </p>
        </div>

        <form className="signin-card" onSubmit={submit} noValidate>
          <p className="section-kicker">CONNEXION</p>
          <h2>Bon retour.</h2>

          <div className="signin-field">
            <label htmlFor={`${id}-email`}>Adresse e-mail</label>
            <input
              id={`${id}-email`}
              type="email"
              name="email"
              autoComplete="username"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              required
            />
          </div>

          <div className="signin-field">
            <label htmlFor={`${id}-password`}>Mot de passe</label>
            <div className="signin-password">
              <input
                id={`${id}-password`}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-pressed={showPassword}
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          <p className="signin-error" id={`${id}-error`} role="alert">
            {error}
          </p>

          <button type="submit" className="button button-lime signin-submit" disabled={!email.trim() || !password}>
            Se connecter <Icon name="arrow" size={18} />
          </button>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
