import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Glyph from "./Glyph";

const FOCUSABLE = "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";

// Pile des fenêtres ouvertes : seule la dernière réagit au clavier (formulaire ouvert au-dessus d'une fiche).
const openModals = [];

/** Boîte de dialogue ou panneau latéral : Échap pour fermer, focus piégé puis restitué. */
export default function Modal({ title, subtitle, onClose, children, variant = "dialog" }) {
  const panel = useRef(null);
  const close = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    close.current = onClose;
  });

  useEffect(() => {
    const token = Symbol("modal");
    openModals.push(token);
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (panel.current?.querySelector("[data-autofocus]") ?? panel.current)?.focus();
    function onKey(event) {
      if (openModals.at(-1) !== token) return;
      if (event.key === "Escape") return close.current();
      if (event.key !== "Tab") return;
      const items = [...panel.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      openModals.splice(openModals.indexOf(token), 1);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  // Le portail reste dans .module-page pour hériter de la palette du module.
  return createPortal(
    <div className={`ac-overlay ac-${variant}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="ac-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panel} tabIndex={-1}>
        <header className="ac-modal-head">
          <div>
            <h3 id={titleId}>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="ac-icon-btn" onClick={onClose} aria-label="Fermer">
            <Glyph name="close" size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>,
    document.querySelector(".module-page") ?? document.body,
  );
}
