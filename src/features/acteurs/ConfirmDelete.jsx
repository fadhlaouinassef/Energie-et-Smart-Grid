import { useEffect, useState } from "react";
import { api, errorMessage } from "./api";
import Modal from "./Modal";
import { capitalize } from "./utils";

/** Confirmation de suppression : indique combien de liens (dans les deux sens) disparaîtront avec la ressource. */
export default function ConfirmDelete({ collection, item, onClose, onDeleted }) {
  const [links, setLinks] = useState(null);
  const [state, setState] = useState({ busy: false, error: "" });

  useEffect(() => {
    api
      .relations(collection, item.id)
      .then((result) => setLinks(result.nodes.length))
      .catch(() => setLinks(null));
  }, [collection, item.id]);

  async function confirm() {
    setState({ busy: true, error: "" });
    try {
      await api.remove(collection, item.id);
      onDeleted(`« ${capitalize(item.name)} » a été supprimé.`, item.id);
    } catch (error) {
      setState({ busy: false, error: errorMessage(error) });
    }
  }

  return (
    <Modal title="Supprimer cette ressource ?" subtitle={item.id} onClose={onClose}>
      <div className="ac-confirm">
        <p>
          <strong>{capitalize(item.name)}</strong> sera supprimé de Fuseki
          {links === null || links === 0
            ? "."
            : links === 1
              ? ", ainsi que le lien qui le relie à une autre ressource."
              : `, ainsi que les ${links} liens qui le relient à d'autres ressources.`}
        </p>
        <p className="ac-muted">Cette action est définitive.</p>
        {state.error && (
          <p className="ac-alert" role="alert">
            {state.error}
          </p>
        )}
        <footer className="ac-modal-foot">
          <button type="button" className="ac-btn ac-ghost" onClick={onClose} data-autofocus>
            Annuler
          </button>
          <button type="button" className="ac-btn ac-danger-btn" onClick={confirm} disabled={state.busy}>
            {state.busy ? "Suppression…" : "Supprimer définitivement"}
          </button>
        </footer>
      </div>
    </Modal>
  );
}
