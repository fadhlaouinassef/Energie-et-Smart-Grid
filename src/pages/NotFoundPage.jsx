import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="not-found section-wrap" id="contenu" tabIndex={-1}>
        <p className="section-kicker">404 / PAGE INTROUVABLE</p>
        <h1>Cette connexion n’existe pas.</h1>
        <p>Retrouvez les cinq modules depuis la page d’accueil.</p>
        <Link className="button button-lime" to="/#modules">
          Explorer les modules
        </Link>
      </main>
    </>
  );
}
