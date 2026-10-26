import Icon from "./Icon";
import Brand from "./Brand";

export default function SiteFooter() {
  return (
    <footer className="site-footer section-wrap">
      <div className="footer-top">
        <Brand />
        <p>
          Relier les données.
          <br />
          <strong>Éclairer l’énergie.</strong>
        </p>
        <a className="back-top" href="#accueil">
          Retour en haut <span>↑</span>
        </a>
      </div>
      <div className="footer-bottom">
        <span>Projet universitaire de Web sémantique</span>
        <span>
          Équipe <strong>VORTEX</strong> — ESPRIT
        </span>
        <span>
          Conçu pour un monde connecté <Icon name="sparkle" size={14} />
        </span>
      </div>
    </footer>
  );
}
