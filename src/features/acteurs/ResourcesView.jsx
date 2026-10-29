import { useEffect, useMemo, useState } from "react";
import { api, errorMessage } from "./api";
import Glyph from "./Glyph";
import ResourceTable from "./ResourceTable";
import { COLLECTIONS, COLUMNS, capitalize, classTree, downloadCsv, humanize, useDebounced } from "./utils";

const PAGE_SIZE = 10;

/** Liste d'une collection : recherche, filtres (classe, contrôle qualité, employeur), pagination, export. */
export default function ResourcesView({ collection, schema, refreshKey, onOpen, onCreate, onDelete }) {
  const meta = COLLECTIONS[collection];
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [issue, setIssue] = useState("");
  const [employer, setEmployer] = useState("");
  const [employers, setEmployers] = useState([]);
  const [page, setPage] = useState(0);
  const [state, setState] = useState({ loading: true, error: "", items: [], total: 0 });
  const debounced = useDebounced(search);

  const classes = useMemo(() => classTree(schema.collections[collection].classes), [schema, collection]);
  const issues = Object.entries(schema.issues).filter(([, value]) => value.collection === collection);

  useEffect(() => {
    if (collection === "personnes") api.lookup("Organisation").then(setEmployers).catch(() => setEmployers([]));
  }, [collection]);

  useEffect(() => {
    const controller = new AbortController();
    const params = {
      search: debounced || undefined,
      type: type || undefined,
      issue: issue || undefined,
      filter: employer ? [`travaillePour:${employer}`] : undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    };
    api
      .list(collection, params, controller.signal)
      .then((result) => setState({ loading: false, error: "", items: result.data, total: result.total }))
      .catch((error) => {
        if (error.code !== "ERR_CANCELED") setState((s) => ({ ...s, loading: false, error: errorMessage(error) }));
      });
    return () => controller.abort();
  }, [collection, debounced, type, issue, employer, page, refreshKey]);

  const change = (setter) => (event) => {
    setState((s) => ({ ...s, loading: true }));
    setPage(0);
    setter(event.target.value);
  };
  const reset = () => {
    setSearch("");
    setType("");
    setIssue("");
    setEmployer("");
    setPage(0);
  };
  const filtered = Boolean(search || type || issue || employer);
  const lastPage = Math.max(Math.ceil(state.total / PAGE_SIZE) - 1, 0);

  async function exportCsv() {
    try {
      const all = await api.list(collection, {
        search: debounced || undefined,
        type: type || undefined,
        issue: issue || undefined,
        filter: employer ? [`travaillePour:${employer}`] : undefined,
        limit: 200,
      });
      downloadCsv(`${collection}.csv`, COLUMNS[collection], all.data);
    } catch (error) {
      setState((s) => ({ ...s, error: errorMessage(error) }));
    }
  }

  return (
    <div className="ac-panel">
      <div className="ac-toolbar">
        <label className="ac-search">
          <span className="ac-sr">Rechercher dans {meta.title.toLowerCase()}</span>
          <Glyph name="search" size={17} />
          <input
            type="search"
            value={search}
            onChange={change(setSearch)}
            placeholder={`Rechercher (nom, identifiant, mots multiples)…`}
          />
        </label>
        <label className="ac-select">
          <span>Classe</span>
          <select value={type} onChange={change(setType)}>
            <option value="">Toutes</option>
            {classes.map((item) => (
              <option key={item.name} value={item.name}>
                {"  ".repeat(item.depth) + humanize(item.name)}
              </option>
            ))}
          </select>
        </label>
        {collection === "personnes" && (
          <label className="ac-select">
            <span>Organisation</span>
            <select value={employer} onChange={change(setEmployer)}>
              <option value="">Toutes</option>
              {employers.map((item) => (
                <option key={item.id} value={item.id}>
                  {capitalize(item.name)}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="ac-select">
          <span>Contrôle qualité</span>
          <select value={issue} onChange={change(setIssue)}>
            <option value="">Aucun</option>
            {issues.map(([key, value]) => (
              <option key={key} value={key}>
                {value.title}
              </option>
            ))}
          </select>
        </label>
        {filtered && (
          <button type="button" className="ac-btn ac-ghost" onClick={reset}>
            Réinitialiser
          </button>
        )}
      </div>

      <div className="ac-bar">
        <p role="status" aria-live="polite">
          {state.loading ? "Chargement…" : `${state.total} ${state.total > 1 ? meta.title.toLowerCase() : meta.singular}${filtered ? " (filtré)" : ""}`}
        </p>
        <div className="ac-bar-actions">
          <button type="button" className="ac-btn ac-ghost" onClick={exportCsv} disabled={!state.total}>
            <Glyph name="download" /> Exporter CSV
          </button>
          <button type="button" className="ac-btn ac-primary" onClick={() => onCreate(collection)}>
            <Glyph name="plus" /> Nouvelle {meta.singular}
          </button>
        </div>
      </div>

      {state.error && (
        <p className="ac-alert" role="alert">
          {state.error}
        </p>
      )}
      {!state.error && state.items.length > 0 && (
        <ResourceTable collection={collection} items={state.items} onOpen={onOpen} onDelete={onDelete} />
      )}
      {!state.error && !state.loading && state.items.length === 0 && (
        <p className="ac-empty">
          Aucun résultat{filtered ? " pour ces critères." : "."}
          {filtered && (
            <button type="button" className="ac-link" onClick={reset}>
              Effacer les filtres
            </button>
          )}
        </p>
      )}

      {state.total > PAGE_SIZE && (
        <nav className="ac-pager" aria-label="Pagination">
          <button type="button" className="ac-btn ac-ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>
            ← Précédent
          </button>
          <span>
            Page {page + 1} / {lastPage + 1}
          </span>
          <button type="button" className="ac-btn ac-ghost" disabled={page >= lastPage} onClick={() => setPage(page + 1)}>
            Suivant →
          </button>
        </nav>
      )}
    </div>
  );
}
