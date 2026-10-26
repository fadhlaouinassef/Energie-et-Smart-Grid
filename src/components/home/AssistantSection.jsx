import Icon from "../Icon";

export default function AssistantSection() {
  return (
    <section
      className="assistant-section section-wrap"
      aria-labelledby="assistant-heading"
    >
      <div className="assistant-panel" data-reveal>
        <div className="assistant-copy">
          <span className="section-kicker">03 / L’ASSISTANT INTELLIGENT</span>
          <h2 id="assistant-heading">
            Vos questions.
            <br />
            <span>Les bonnes connexions.</span>
          </h2>
          <p>
            Et si explorer un réseau commençait par une simple question ? Un
            assistant IA pour interroger les connaissances en langage naturel.
          </p>
          <span className="coming-soon">
            <span /> Fonctionnalité à venir
          </span>
        </div>
        <div className="question-visual">
          <span className="question-star">
            <Icon name="sparkle" size={48} />
          </span>
          <div className="question-bubble">
            <Icon name="sparkle" size={23} />
            <p>Quels équipements sont installés dans ce bâtiment ?</p>
          </div>
          <div className="question-caption">
            <span /> Les connaissances, à portée de question.
          </div>
        </div>
      </div>
    </section>
  );
}
