import { useEffect, useId, useState } from "react";
import { api } from "./api";
import Glyph from "./Glyph";
import { capitalize, humanize, useDebounced } from "./utils";

/** Sélection de ressources liées : puces + recherche dans les instances de la classe cible (/lookup). */
export default function RelationPicker({ label, target, value, onChange }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [names, setNames] = useState({});
  const [open, setOpen] = useState(false);
  const debounced = useDebounced(query, 250);

  const remember = (list) => setNames((known) => ({ ...known, ...Object.fromEntries(list.map((o) => [o.id, o.name])) }));

  useEffect(() => {
    // Noms des valeurs déjà choisies (une seule fois).
    api.lookup(target).then(remember).catch(() => {});
  }, [target]);

  useEffect(() => {
    let current = true;
    api
      .lookup(target, debounced, 30)
      .then((list) => {
        if (!current) return;
        setOptions(list);
        remember(list);
      })
      .catch(() => current && setOptions([]));
    return () => {
      current = false;
    };
  }, [target, debounced]);

  const available = options.filter((option) => !value.includes(option.id));
  const add = (optionId) => {
    onChange([...value, optionId]);
    setQuery("");
  };

  return (
    <div className="ac-picker">
      <label htmlFor={id}>
        {label} <small>({humanize(target)})</small>
      </label>
      <div className="ac-picker-box">
        {value.map((item) => (
          <span className="ac-token" key={item}>
            {capitalize(names[item] ?? item)}
            <button type="button" onClick={() => onChange(value.filter((v) => v !== item))} aria-label={`Retirer ${names[item] ?? item}`}>
              <Glyph name="close" size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          value={query}
          placeholder={value.length ? "Ajouter…" : "Rechercher pour ajouter…"}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (available[0]) add(available[0].id);
            }
            if (event.key === "Backspace" && !query && value.length) onChange(value.slice(0, -1));
          }}
        />
      </div>
      {open && (
        <ul className="ac-options" id={`${id}-list`} role="listbox" aria-label={`Résultats pour ${label}`}>
          {available.length === 0 && <li className="ac-muted">Aucun résultat</li>}
          {available.map((option) => (
            <li
              key={option.id}
              role="option"
              aria-selected="false"
              onMouseDown={(event) => {
                event.preventDefault();
                add(option.id);
              }}
            >
              {capitalize(option.name)} <small>{option.id}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
