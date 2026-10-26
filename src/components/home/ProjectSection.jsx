import Icon from "../Icon";

export default function ProjectSection() {
  return (
    <section
      className="project-section section-wrap"
      id="projet"
      aria-labelledby="project-heading"
    >
      <div className="section-topline" data-reveal>
        <span className="section-kicker">01 / LE PROJET</span>
        <span className="small-label">L’ÉNERGIE PREND TOUT SON SENS</span>
      </div>
      <div className="project-grid" data-reveal>
        <h2 id="project-heading">
          Tout est lié.
          <br />
          <span className="muted-heading">
            Et si on le
            <br />
            rendait visible ?
          </span>
        </h2>
        <div className="project-description">
          <span className="round-icon">
            <Icon name="link" size={28} />
          </span>
          <p>
            Une installation produit. Une batterie stocke. Un réseau distribue.{" "}
            <strong>
              Notre plateforme relie les informations pour comprendre
              l’ensemble.
            </strong>
          </p>
          <p>
            Grâce à une ontologie RDF/OWL, explorez les relations entre
            installations, équipements, lieux et acteurs. Le Web sémantique
            transforme des données dispersées en connaissances connectées.
          </p>
          <div className="tech-tags">
            <span>RDF / OWL</span>
            <span>SPARQL</span>
            <span>WEB SÉMANTIQUE</span>
          </div>
        </div>
      </div>
      <div className="knowledge-strip" data-reveal>
        <span>
          <span className="strip-number">01</span> Des données structurées
        </span>
        <Icon name="arrow" size={20} />
        <span>
          <span className="strip-number">02</span> Des relations explicites
        </span>
        <Icon name="arrow" size={20} />
        <span>
          <span className="strip-number">03</span> Des connaissances accessibles
        </span>
      </div>
    </section>
  );
}
