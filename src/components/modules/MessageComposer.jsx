import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Icon from "../Icon";
import ModulePattern from "./ModulePattern";
import NetworkResponse from "./NetworkResponse";
import { getRequestError, sendNetworkPrompt } from "../../services/networkApi";
import { getPlacesError, sendPlacesTransportPrompt } from "../../services/lieuxTransportsApi";
import { sendEquipementsPrompt } from "../../services/equipementsApi";

const MAX_LENGTH = 2000;

export default function MessageComposer({ module }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const connectedModules = ["production-stockage", "reseaux-infrastructures", "lieux-transports", "equipements-suivi"];
  const isConnected = connectedModules.includes(module.slug);
  const moduleHelpMap = {
    "equipements-suivi": "Consultez ou gérez les équipements et les informations. Exemples : Liste les équipements · Affiche les mesures · Liste les incidents.",
    "production-stockage": "Envoyez votre demande pour consulter les installations de production et les réserves de stockage.",
    "reseaux-infrastructures": "Envoyez votre demande pour consulter ou gérer les réseaux et infrastructures.",
    "lieux-transports": "Posez une question sur les lieux, bâtiments, sites ou transports (ex. : Affiche les lieux à Tunis · Liste les acheminements).",
  };
  const moduleHelp = moduleHelpMap[module.slug] ?? "Envoyez votre demande.";
  const suggestions = module.slug === "equipements-suivi"
    ? ["Liste les équipements", "Affiche les mesures", "Liste les incidents"]
    : module.slug === "lieux-transports"
      ? ["Affiche les sites", "Liste les bâtiments", "Liste les transports"]
      : module.suggestions;
  const request = useRef(null);
  const textarea = useRef(null);
  const latestMessage = useRef(null);
  const id = useId();
  const inputId = `${id}-question`;
  const helpId = `${id}-help`;
  const countId = `${id}-count`;

  useLayoutEffect(() => {
    const input = textarea.current;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 260)}px`;
  }, [draft]);

  useLayoutEffect(() => {
    // Scroll within the conversation only; never move the entire page on send.
    const conversation = latestMessage.current?.parentElement;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [messages]);

  useEffect(() => () => request.current?.abort(), []);

  async function submit(event, suggestion) {
    event?.preventDefault();
    const content = (suggestion ?? draft).trim();
    if (!content || request.current) return;
    const messageId = crypto.randomUUID();
    setMessages((previous) => [
      ...previous,
      { id: messageId, content, status: isConnected ? "loading" : "local" },
    ]);
    setDraft("");
    textarea.current.focus();
    if (!isConnected) return;

    const controller = new AbortController();
    request.current = controller;
    setIsSending(true);
    // Dispatch vers le bon service NLP selon le module.
    const sendPrompt = module.slug === "equipements-suivi"
      ? sendEquipementsPrompt
      : module.slug === "lieux-transports"
      ? sendPlacesTransportPrompt
      : sendNetworkPrompt;
    const getError = module.slug === "lieux-transports"
      ? getPlacesError
      : getRequestError;
    try {
      const result = await sendPrompt(content, controller.signal);
      if (!controller.signal.aborted) {
        setMessages((previous) => previous.map((message) => message.id === messageId
          ? { ...message, status: "success", result } : message));
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setMessages((previous) => previous.map((message) => message.id === messageId
          ? { ...message, status: "error", error: getError(error) } : message));
        setDraft((current) => current || content);
      }
    } finally {
      if (!controller.signal.aborted) {
        request.current = null;
        setIsSending(false);
      }
    }
  }

  function chooseSuggestion(suggestion) {
    if (module.slug === "lieux-transports") {
      void submit(null, suggestion);
      return;
    }
    setDraft(suggestion);
    textarea.current.focus();
  }

  return (
    <section className="message-composer" aria-labelledby={`${id}-title`}>
      <ModulePattern module={module} />
      <div className="composer-heading">
        <span className="composer-symbol">
          <Icon name="sparkle" size={24} />
        </span>
        <div>
          <h2 id={`${id}-title`}>Une question, un point de départ.</h2>
          <p>Explorez le module en langage naturel.</p>
        </div>
        <span className="composer-status">
          <span /> {isConnected ? "Assistant du module" : "Assistant à venir"}
        </span>
      </div>

      {messages.length > 0 && (
        <div
          className={`conversation${isConnected ? " conversation--connected" : ""}`}
          role="region"
          aria-label="Conversation dans ce module"
          tabIndex={0}
        >
          {messages.map((message, index) => (
            <div
              className={isConnected ? "conversation-turn" : "user-message"}
              key={message.id}
              ref={index === messages.length - 1 ? latestMessage : undefined}
            >
              {isConnected ? (
                <>
                  <div className="user-message">
                    <span className="message-author">Vous</span>
                    <p>{message.content}</p>
                  </div>
                  <div className="assistant-message" aria-busy={message.status === "loading"}>
                    <span className="message-author">Assistant</span>
                    <NetworkResponse message={message} />
                  </div>
                </>
              ) : (
                <>
                  <span className="message-author">Vous</span>
                  <p>{message.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="question-form">
        <label htmlFor={inputId}>Que souhaitez-vous savoir ?</label>
        <div className="question-input-wrap">
          <textarea
            ref={textarea}
            id={inputId}
            name="question"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (
                (event.ctrlKey || event.metaKey) &&
                event.key === "Enter" &&
                !event.nativeEvent.isComposing
              )
                submit(event);
            }}
            placeholder={suggestions[0]}
            maxLength={MAX_LENGTH}
            rows={4}
            aria-describedby={`${helpId} ${countId}`}
          />
          <span className="question-count" id={countId}>
            {draft.length.toLocaleString("fr-FR")} / 2 000
          </span>
        </div>
        <div className="composer-bottom">
          <p id={helpId}>
            <Icon name="link" size={16} />
            <span>
              {isConnected ? moduleHelp : "Assistant non connecté."}
              <br />
              Vos questions restent ici tant que ce module est ouvert.
            </span>
          </p>
          <button
            type="submit"
            className="button composer-submit"
            disabled={!draft.trim() || isSending}
          >
            {isConnected ? (isSending ? "Envoi en cours…" : "Envoyer ma demande") : "Ajouter ma question"} <Icon name="arrow" size={18} />
          </button>
        </div>
      </form>

      <p className="composer-feedback" role="status">
        {!isConnected && messages.length > 0
          ? `Question ${messages.length} ajoutée localement. Les réponses de l’assistant ne sont pas encore disponibles.`
          : ""}
      </p>
      <div className="suggestions">
        <span className="suggestions-label">POUR COMMENCER</span>
        <div>
          {suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={() => chooseSuggestion(suggestion)}
              disabled={module.slug === "lieux-transports" && isSending}
            >
              {suggestion}
              <Icon name="diagonal" size={14} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
