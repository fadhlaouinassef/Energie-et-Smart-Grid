import { useRef, useState } from "react";
import { api, errorMessage } from "./api";
import Glyph from "./Glyph";
import ResourceTable from "./ResourceTable";
import { COLLECTIONS, COLUMNS, downloadCsv } from "./utils";

const MAX_LENGTH = 2000;
const HISTORY_KEY = "acteurs.prompts";

const VERBS = { create: "Créer", update: "Modifier", delete: "Supprimer" };

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
  } catch {
    return [];
  }
}

/** Assistant en langage naturel : spaCy traduit la phrase en SPARQL, les lectures s'affichent, les écritures demandent confirmation. */
export default function AssistantPanel({ onOpen, onChanged }) {
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState({ phase: "idle", result: null, error: "" });
  const [history, setHistory] = useState(loadHistory);
  const input = useRef(null);
  const busy = state.phase === "thinking";

  function remember(text) {
    const next = [text, ...history.filter((entry) => entry !== text)].slice(0, 6);
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* stockage indisponible : l'historique reste en mémoire */
    }
  }

  async function ask(text) {
    const question = text.trim();
    if (!question || busy) return;
    setState({ phase: "thinking", result: null, error: "" });
    try {
      // Étape 1 : traduction seule. Les lectures sont lancées aussitôt, les écritures attendent la confirmation.
      const preview = await api.nlp(question, false);
      remember(question);
      if (preview.action === "read" || preview.action === "count") {
        setState({ phase: "done", result: { ...(await api.nlp(question, true)), prompt: question }, error: "" });
      } else {
        setState({ phase: "confirm", result: { ...preview, prompt: question }, error: "" });
      }
    } catch (error) {
      setState({ phase: "error", result: null, error: errorMessage(error) });
    }
  }

  async function confirm() {
    const { prompt: question } = state.result;
    setState((s) => ({ ...s, phase: "thinking" }));
    try {
      const done = await api.nlp(question, true);
      setState({ phase: "done", result: { ...done, prompt: question }, error: "" });
      onChanged();
    } catch (error) {
      setState({ phase: "error", result: state.result, error: errorMessage(error) });
    }
  }

  function submit(event) {
    event.preventDefault();
    ask(prompt);
  }

  const { result } = state;
  const write = result && VERBS[result.action];
  const destructive = result?.action === "delete";

  return (
    <div className="ac-panel">
      <form className="ac-ask" onSubmit={submit}>
        <label htmlFor="ac-prompt">Que souhaitez-vous savoir ou modifier ?</label>
        <div className="ac-ask-box">
          <textarea
            id="ac-prompt"
            ref={input}
            value={prompt}
            rows={2}
            maxLength={MAX_LENGTH}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                ask(prompt);
              }
            }}
            placeholder="Ex. : Quels techniciens travaillent pour service_distribution_ariana ?"
            aria-describedby="ac-ask-help"
          />
          <button type="submit" className="ac-btn ac-primary" disabled={!prompt.trim() || busy}>
            {busy ? "Analyse…" : "Envoyer"} <Glyph name="send" />
          </button>
        </div>
        <p id="ac-ask-help" className="ac-hint">
          Entrée pour envoyer, Maj+Entrée pour un retour à la ligne. Les créations, modifications et suppressions demandent votre confirmation.
        </p>
      </form>

      {history.length > 0 && (
        <div className="ac-history">
          <span>
            <Glyph name="history" size={14} /> Récents
          </span>
          {history.map((entry) => (
            <button
              type="button"
              key={entry}
              onClick={() => {
                setPrompt(entry);
                input.current?.focus();
              }}
            >
              {entry}
            </button>
          ))}
        </div>
      )}

      <div className="ac-result" aria-live="polite">
        {busy && <p className="ac-muted">Analyse de la phrase par spaCy…</p>}
        {state.error && (
          <p className="ac-alert" role="alert">
            {state.error}
          </p>
        )}

        {result && (state.phase === "confirm" || state.phase === "done" || state.phase === "error") && (
          <div className={`ac-card ${destructive && state.phase === "confirm" ? "ac-card-danger" : ""}`}>
            <div className="ac-card-head">
              <h3>
                {state.phase === "confirm" ? "Ce que j'ai compris" : state.phase === "done" ? "Interprétation" : "Dernière demande"}
              </h3>
              <ul className="ac-explain">
                {result.explain.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>

            {state.phase === "confirm" && (
              <div className="ac-confirm-box">
                {destructive && <p>Cette suppression retire la ressource et tous les liens qui y mènent. Elle est définitive.</p>}
                <div>
                  <button type="button" className="ac-btn ac-ghost" onClick={() => setState({ phase: "idle", result: null, error: "" })}>
                    Annuler
                  </button>
                  <button type="button" className={`ac-btn ${destructive ? "ac-danger-btn" : "ac-primary"}`} onClick={confirm}>
                    Confirmer et exécuter
                  </button>
                </div>
              </div>
            )}

            {state.phase === "done" && result.action === "count" && (
              <p className="ac-count">
                <strong>{result.count}</strong> {COLLECTIONS[result.collection].title.toLowerCase()}
              </p>
            )}

            {state.phase === "done" && write && (
              <p className="ac-success" role="status">
                <Glyph name="check" /> {result.action === "create" ? "Créé" : result.action === "update" ? "Modifié" : "Supprimé"} : {result.id}
                {result.action !== "delete" && (
                  <button type="button" className="ac-link" onClick={() => onOpen(result.collection, result.id)}>
                    Ouvrir la fiche
                  </button>
                )}
              </p>
            )}

            <details className="ac-sparql">
              <summary>
                <Glyph name="code" /> Requête SPARQL générée
              </summary>
              <pre>{result.sparql.replace(/^PREFIX.*\n/gm, "").trim()}</pre>
            </details>
          </div>
        )}

        {state.phase === "done" && result.action === "read" && (
          <div className="ac-card">
            <div className="ac-bar">
              <p>
                {result.total} résultat{result.total > 1 ? "s" : ""}
                {result.total > result.data.length && ` · ${result.data.length} affichés (précisez la demande ou ouvrez l'onglet ${COLLECTIONS[result.collection].title})`}
              </p>
              {result.data.length > 0 && (
                <button type="button" className="ac-btn ac-ghost" onClick={() => downloadCsv(`${result.collection}.csv`, COLUMNS[result.collection], result.data)}>
                  <Glyph name="download" /> Exporter CSV
                </button>
              )}
            </div>
            {result.data.length > 0 ? (
              <ResourceTable collection={result.collection} items={result.data} onOpen={onOpen} />
            ) : (
              <p className="ac-empty">Aucun résultat pour cette demande.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
