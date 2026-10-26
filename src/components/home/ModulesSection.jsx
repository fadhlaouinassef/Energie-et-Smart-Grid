import { Link } from "react-router-dom";
import Icon from "../Icon";
import modules from "../../data/modules";

export default function ModulesSection() {
  return (
    <section
      className="modules-section"
      id="modules"
      aria-labelledby="modules-heading"
    >
      <div className="section-wrap">
        <div className="section-topline" data-reveal>
          <span className="section-kicker">02 / LES MODULES</span>
          <span className="small-label">
            CINQ PORTES D’ENTRÉE. UN MÊME RÉSEAU.
          </span>
        </div>
        <div className="modules-heading" data-reveal>
          <h2 id="modules-heading">
            Explorez l’énergie.
            <br />
            <span className="muted-heading">Sous tous ses angles.</span>
          </h2>
          <p>
            De la source à l’usage, découvrez
            <br />
            les cinq dimensions du Smart Grid.
          </p>
        </div>
        <div className="module-list">
          {modules.map((module, i) => (
            <details className="module-row" key={module.name}>
              <summary>
                <span className="module-number">0{i + 1}</span>
                <span className={`module-icon module-icon-${i}`}>
                  <Icon name={module.icon} size={28} />
                </span>
                <span className="module-text">
                  <span className="module-title">{module.name}</span>
                  <span className="module-description">
                    {module.description}
                  </span>
                </span>
                <span className="module-tag">{module.tag}</span>
                <span className="module-arrow">
                  <Icon name="diagonal" size={22} />
                </span>
              </summary>
              <div className="module-detail">
                <p>{module.detail}</p>
                <Link
                  className="button module-open-button"
                  to={`/modules/${module.slug}`}
                  aria-label={`Ouvrir le module ${module.name}`}
                >
                  Explorer ce module <Icon name="arrow" size={17} />
                </Link>
              </div>
            </details>
          ))}
        </div>
        <p className="modules-note">
          <span className="status-dot" /> Un socle commun de connaissances, des
          perspectives complémentaires.
        </p>
      </div>
    </section>
  );
}
