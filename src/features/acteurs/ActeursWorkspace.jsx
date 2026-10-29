import { useCallback, useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { api, errorMessage } from "./api";
import AssistantPanel from "./AssistantPanel";
import ConfirmDelete from "./ConfirmDelete";
import ResourceDrawer from "./ResourceDrawer";
import ResourceForm from "./ResourceForm";
import ResourcesView from "./ResourcesView";
import "./acteurs.css";

/** Espace de travail du module « Acteurs et organisations » : assistant NLP, deux tables CRUD et tableau de qualité. */
export default function ActeursWorkspace({ module }) {
  const [tab, setTab] = useState("assistant");
  const [boot, setBoot] = useState({ loading: true, error: "", schema: null });
  const [stats, setStats] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [trail, setTrail] = useState([]);
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    api
      .schema()
      .then((schema) => setBoot({ loading: false, error: "", schema }))
      .catch((error) => setBoot({ loading: false, error: errorMessage(error), schema: null }));
  }, []);

  useEffect(load, [load]);
  const retry = () => {
    setBoot({ loading: true, error: "", schema: null });
    load();
  };

  useEffect(() => {
    if (boot.schema) api.stats().then(setStats).catch(() => setStats(null));
  }, [boot.schema, refreshKey]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const changed = (message) => {
    setRefreshKey((key) => key + 1);
    if (message) setNotice(message);
  };
  const open = (collection, id) => setTrail((current) => [...current, { collection, id }]);
  const selected = trail.at(-1);

  if (boot.loading || boot.error) {
    return (
      <section className="ac" aria-live="polite">
        {boot.loading ? (
          <p className="ac-muted">Connexion au backend…</p>
        ) : (
          <div className="ac-offline">
            <p className="ac-alert" role="alert">
              {boot.error}
            </p>
            <p className="ac-muted">Vérifiez que FastAPI tourne (uvicorn main:app --reload) et que Fuseki est démarré.</p>
            <button type="button" className="ac-btn ac-primary" onClick={retry}>
              Réessayer
            </button>
          </div>
        )}
      </section>
    );
  }

  const tabs = [
    { key: "assistant", label: "Assistant" },
    { key: "personnes", label: "Personnes", count: stats?.totals.personnes },
    { key: "organisations", label: "Organisations", count: stats?.totals.organisations },
  ];
  const common = {
    schema: boot.schema,
    refreshKey,
    onOpen: open,
    onCreate: (collection) => setEditor({ collection, item: null }),
    onDelete: (collection, item) => setDeleting({ collection, item }),
  };

  return (
    <section className="ac" aria-label={module.name}>
      <header className="ac-head">
        <span className="ac-symbol">
          <Icon name="sparkle" size={22} />
        </span>
        <div>
          <h2>Personnes et organisations</h2>
          <p>Posez une question en français, ou gérez directement les ressources.</p>
        </div>
      </header>

      <div className="ac-tabs" role="tablist" aria-label="Sections du module">
        {tabs.map(({ key, label, count }) => (
          <button
            type="button"
            role="tab"
            key={key}
            id={`ac-tab-${key}`}
            aria-selected={tab === key}
            aria-controls={`ac-panel-${key}`}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            onKeyDown={(event) => {
              const move = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
              if (!move) return;
              const next = tabs[(tabs.findIndex((t) => t.key === key) + move + tabs.length) % tabs.length].key;
              setTab(next);
              document.getElementById(`ac-tab-${next}`)?.focus();
            }}
          >
            {label}
            {count !== undefined && <span>{count}</span>}
          </button>
        ))}
      </div>

      {notice && (
        <p className="ac-notice" role="status">
          {notice}
        </p>
      )}

      <div role="tabpanel" id="ac-panel-assistant" aria-labelledby="ac-tab-assistant" hidden={tab !== "assistant"}>
        <AssistantPanel onOpen={open} onChanged={() => changed()} />
      </div>
      {(tab === "personnes" || tab === "organisations") && (
        <div role="tabpanel" id={`ac-panel-${tab}`} aria-labelledby={`ac-tab-${tab}`}>
          <ResourcesView key={tab} collection={tab} {...common} />
        </div>
      )}
      {selected && (
        <ResourceDrawer
          key={`${selected.collection}-${selected.id}-${refreshKey}`}
          {...selected}
          schema={boot.schema}
          canGoBack={trail.length > 1}
          onBack={() => setTrail((current) => current.slice(0, -1))}
          onClose={() => setTrail([])}
          onOpen={open}
          onDelete={common.onDelete}
        />
      )}
      {editor && (
        <ResourceForm
          {...editor}
          schema={boot.schema}
          onClose={() => setEditor(null)}
          onSaved={(message) => {
            setEditor(null);
            changed(message);
          }}
        />
      )}
      {deleting && (
        <ConfirmDelete
          {...deleting}
          onClose={() => setDeleting(null)}
          onDeleted={(message, id) => {
            setDeleting(null);
            setTrail((current) => current.filter((entry) => entry.id !== id));
            changed(message);
          }}
        />
      )}
    </section>
  );
}
