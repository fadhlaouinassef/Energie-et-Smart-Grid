import { Link, useNavigate, useParams } from "react-router-dom";
import modules from "../data/modules";
import { signOut } from "../auth";
import SiteHeader from "../components/SiteHeader";
import ActeursWorkspace from "../features/acteurs/ActeursWorkspace";
import Icon from "../components/Icon";
import MessageComposer from "../components/modules/MessageComposer";
import ModuleNavigation from "../components/modules/ModuleNavigation";
import ModulePattern from "../components/modules/ModulePattern";
import NotFoundPage from "./NotFoundPage";
import "./ModulePage.css";

export default function ModulePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const module = modules.find((item) => item.slug === slug);
  if (!module) return <NotFoundPage />;

  function logout() {
    signOut();
    navigate("/signin", { replace: true });
  }
  const index = modules.indexOf(module) + 1;

  return (
    <div className="module-page" data-theme={module.theme}>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <SiteHeader />
      <main className="module-workspace" id="contenu" tabIndex={-1}>
        <ModulePattern module={module} />
        <div className="module-page-content">
          <div className="module-breadcrumb">
            <a href="/#modules">
              <span aria-hidden="true">←</span> Tous les modules
            </a>
            <div className="module-breadcrumb-end">
              <span>MODULE 0{index} / 05</span>
              <button type="button" className="module-logout" onClick={logout}>
                Déconnexion
              </button>
            </div>
          </div>
          <ModuleNavigation activeSlug={slug} />
          <div className="module-intro">
            <div className="module-intro-copy">
              <p className="module-eyebrow">
                <span /> {module.name}
              </p>
              <h1>{module.headline}</h1>
              <p className="module-intro-description">{module.detail}</p>
            </div>
            <div className="module-emblem" aria-hidden="true">
              <Icon name={module.icon} size={80} />
              <span>0{index}</span>
            </div>
          </div>
          {slug === "acteurs-organisations" ? (
            <ActeursWorkspace module={module} />
          ) : (
            <MessageComposer key={module.slug} module={module} />
          )}
          <div className="module-page-footer">
            <span>ÉNERGIE & SMART GRID</span>
            <span>Des données reliées. Des questions éclairées.</span>
            <Link to="/">
              Retour à l’accueil <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
