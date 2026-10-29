import { Link, useLocation } from "react-router-dom";
import { isAuthenticated } from "../auth";
import "./SignInButton.css";

/** Bouton « Sign in » de la barre de navigation : masqué une fois connecté et sur la page de connexion. */
export default function SignInButton() {
  const { pathname } = useLocation();
  if (isAuthenticated() || pathname === "/signin") return null;
  return (
    <Link className="button nav-signin" to="/signin">
      Sign in
    </Link>
  );
}
