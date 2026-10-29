import { useEffect, useState } from "react";
import { api, errorMessage } from "./api";
import Glyph from "./Glyph";
import Modal from "./Modal";
import RelationGraph from "./RelationGraph";
import { capitalize, formatValue, humanize, propertyLabel } from "./utils";

const direction = (link) => (link.direction === "out" ? `${propertyLabel(link.property)} →` : `← ${propertyLabel(link.property)}`);

/** Fiche détaillée : informations, relations dans les deux sens et graphe cliquable. */
export default function ResourceDrawer({ collection, id, schema, canGoBack, onBack, onClose, onOpen, onDelete }) {
  const [state, setState] = useState({ loading: true, error: "", item: null, nodes: [] });

  useEffect(() => {
    let current = true;
    Promise.all([api.get(collection, id), api.relations(collection, id)])
      .then(([item, relations]) => current && setState({ loading: false, error: "", item, nodes: relations.nodes }))
      .catch((error) => current && setState({ loading: false, error: errorMessage(error), item: null, nodes: [] }));
    return () => {
      current = false;
    };
  }, [collection, id]);

  const { item, nodes } = state;
  const inModule = nodes.filter((node) => node.collection);
  const elsewhere = nodes.filter((node) => !node.collection);
  const facts = item
    ? Object.entries(item.properties).filter(([name]) => schema.properties[name]?.kind === "data")
    : [];

  return (
    <Modal variant="drawer" title={item ? capitalize(item.name) : "Fiche"} subtitle={item ? `${humanize(item.type)} · ${item.id}` : id} onClose={onClose}>
      <div className="ac-drawer-body">
        {canGoBack && (
          <button type="button" className="ac-link" onClick={onBack}>
            ← Retour à la fiche précédente
          </button>
        )}
        {state.loading && <p className="ac-muted">Chargement…</p>}
        {state.error && (
          <p className="ac-alert" role="alert">
            {state.error}
          </p>
        )}
        {item && (
          <>
            {item.comment && <p className="ac-comment">{item.comment}</p>}
            <section aria-labelledby="ac-facts">
              <h4 id="ac-facts">Informations</h4>
              {facts.length === 0 ? (
                <p className="ac-muted">Aucune information détaillée enregistrée.</p>
              ) : (
                <dl className="ac-facts">
                  {facts.map(([name, list]) => (
                    <div key={name}>
                      <dt>{propertyLabel(name)}</dt>
                      <dd>{list.map((v) => formatValue(v, schema.properties[name].datatype)).join(", ")}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>

            <section aria-labelledby="ac-relations">
              <h4 id="ac-relations">
                <Glyph name="graph" /> Relations dans le module ({inModule.length})
              </h4>
              {inModule.length === 0 ? (
                <p className="ac-muted">Aucune personne ni organisation liée.</p>
              ) : (
                <>
                  <RelationGraph center={item} nodes={inModule} onOpen={onOpen} />
                  <ul className="ac-neighbors">
                    {inModule.map((node) => (
                      <li key={node.id}>
                        <button type="button" onClick={() => onOpen(node.collection, node.id)}>
                          <span>{capitalize(node.name)}</span>
                          <small>{humanize(node.type)}</small>
                        </button>
                        <span className="ac-muted">{node.links.map(direction).join(" · ")}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {elsewhere.length > 0 && (
              <details className="ac-others">
                <summary>Liens vers d'autres modules ({elsewhere.length})</summary>
                <ul>
                  {elsewhere.map((node) => (
                    <li key={node.id}>
                      <strong>{capitalize(node.name)}</strong> <small>{node.type ? humanize(node.type) : "Ressource"}</small>
                      <span className="ac-muted"> — {node.links.map(direction).join(" · ")}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <footer className="ac-modal-foot">
              <button type="button" className="ac-btn ac-danger-btn" onClick={() => onDelete(collection, item)}>
                <Glyph name="trash" /> Supprimer
              </button>
            </footer>
          </>
        )}
      </div>
    </Modal>
  );
}
