import { useId, useLayoutEffect, useRef, useState } from "react";
import Icon from "../Icon";
import ModulePattern from "./ModulePattern";

const MAX_LENGTH = 2000;

export default function MessageComposer({ module }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
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
  }, [messages.length]);

  function submit(event) {
    event.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), content },
    ]);
    setDraft("");
    textarea.current.focus();
  }

  function chooseSuggestion(suggestion) {
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
          <span /> Assistant à venir
        </span>
      </div>

      {messages.length > 0 && (
        <div
          className="conversation"
          role="region"
          aria-label="Vos questions dans ce module"
          tabIndex={0}
        >
          {messages.map((message, index) => (
            <div
              className="user-message"
              key={message.id}
              ref={index === messages.length - 1 ? latestMessage : undefined}
            >
              <span className="message-author">Vous</span>
              <p>{message.content}</p>
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
            placeholder={module.suggestions[0]}
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
              Assistant non connecté.
              <br />
              Vos questions restent ici tant que ce module est ouvert.
            </span>
          </p>
          <button
            type="submit"
            className="button composer-submit"
            disabled={!draft.trim()}
          >
            Ajouter ma question <Icon name="arrow" size={18} />
          </button>
        </div>
      </form>

      <p className="composer-feedback" role="status">
        {messages.length > 0
          ? `Question ${messages.length} ajoutée localement. Les réponses de l’assistant ne sont pas encore disponibles.`
          : ""}
      </p>
      <div className="suggestions">
        <span className="suggestions-label">POUR COMMENCER</span>
        <div>
          {module.suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={() => chooseSuggestion(suggestion)}
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
