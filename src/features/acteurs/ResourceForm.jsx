import { useId, useMemo, useState } from "react";
import { api, errorMessage } from "./api";
import Modal from "./Modal";
import RelationPicker from "./RelationPicker";
import { COLLECTIONS, classTree, humanize, propertyLabel, slugify } from "./utils";

const FIRST = ["nomComplet", "identifiantPersonne", "nomGestionnaire", "telephoneContact", "anneeCreation", "etatService"];
const FIRST_RELATIONS = ["travaillePour", "emploiePersonne", "collaboreAvec"];
const byPriority = (order) => (a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99);

const toInput = (datatype, value) => (datatype === "dateTime" && value ? value.slice(0, 16) : (value ?? ""));

function toPayload(datatype, value) {
  if (datatype === "boolean") return value === "true";
  if (datatype === "integer" || datatype === "decimal") return Number(value);
  if (datatype === "dateTime") return value.length === 16 ? `${value}:00` : value;
  return value;
}

/** Formulaire de création / modification généré à partir du schéma de l'ontologie (/api/acteurs/schema). */
export default function ResourceForm({ collection, schema, item, onClose, onSaved }) {
  const meta = COLLECTIONS[collection];
  const editing = Boolean(item);
  const formId = useId();
  const classes = useMemo(() => classTree(schema.collections[collection].classes), [schema, collection]);
  const [type, setType] = useState(item?.type ?? schema.collections[collection].root);
  const [label, setLabel] = useState(item?.label ?? "");
  const [customId, setCustomId] = useState(null);
  const [values, setValues] = useState(() => {
    const initial = {};
    Object.entries(item?.properties ?? {}).forEach(([name, list]) => {
      const spec = schema.properties[name];
      if (spec) initial[name] = spec.kind === "relation" ? list : toInput(spec.datatype, list[0]);
    });
    return initial;
  });
  const [state, setState] = useState({ saving: false, error: "" });

  const names = classes.find((c) => c.name === type)?.properties ?? [];
  const data = names.filter((n) => schema.properties[n].kind === "data").sort(byPriority(FIRST));
  const relations = names.filter((n) => schema.properties[n].kind === "relation").sort(byPriority(FIRST_RELATIONS));
  const id = customId ?? slugify(values.nomComplet || label);
  const set = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  async function submit(event) {
    event.preventDefault();
    if (!editing && !/^[\w][\w.-]*$/.test(id)) {
      setState({ saving: false, error: "L'identifiant est obligatoire (lettres, chiffres, _ . - sans espace)." });
      return;
    }
    const properties = {};
    for (const name of names) {
      const spec = schema.properties[name];
      const value = values[name];
      const original = item?.properties?.[name];
      if (spec.kind === "relation") {
        const list = value ?? [];
        if (editing ? JSON.stringify(list) !== JSON.stringify(original ?? []) : list.length) properties[name] = list;
      } else {
        const current = value ?? "";
        const before = toInput(spec.datatype, original?.[0]);
        if (editing ? current !== before : current !== "") {
          properties[name] = current === "" ? [] : toPayload(spec.datatype, current);
        }
      }
    }
    setState({ saving: true, error: "" });
    try {
      if (editing) {
        const changedLabel = label !== (item.label ?? "");
        if (!changedLabel && !Object.keys(properties).length) {
          setState({ saving: false, error: "Aucune modification à enregistrer." });
          return;
        }
        await api.update(collection, item.id, { label: changedLabel ? label : null, properties });
      } else {
        await api.create(collection, { id, type, label: label.trim() || null, properties });
      }
      onSaved(`${meta.singular[0].toUpperCase() + meta.singular.slice(1)} ${editing ? "modifiée" : "créée"} : ${editing ? item.id : id}`, editing ? item.id : id);
    } catch (error) {
      setState({ saving: false, error: errorMessage(error) });
    }
  }

  return (
    <Modal
      title={editing ? `Modifier ${item.name}` : `Nouvelle ${meta.singular}`}
      subtitle={editing ? item.id : "Les champs proposés dépendent de la classe choisie."}
      onClose={onClose}
    >
      <form className="ac-form" onSubmit={submit} noValidate>
        <div className="ac-form-grid">
          <div className="ac-field">
            <label htmlFor={`${formId}-type`}>Classe</label>
            <select id={`${formId}-type`} value={type} disabled={editing} onChange={(e) => setType(e.target.value)} data-autofocus={!editing || undefined}>
              {classes.map((c) => (
                <option key={c.name} value={c.name}>
                  {"  ".repeat(c.depth) + humanize(c.name)}
                </option>
              ))}
            </select>
            {editing && <small>La classe n'est pas modifiable.</small>}
          </div>
          <div className="ac-field">
            <label htmlFor={`${formId}-label`}>Libellé</label>
            <input id={`${formId}-label`} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Nom affiché dans les listes" />
          </div>
          {!editing && (
            <div className="ac-field ac-wide">
              <label htmlFor={`${formId}-id`}>Identifiant RDF</label>
              <input
                id={`${formId}-id`}
                value={id}
                onChange={(e) => setCustomId(e.target.value)}
                aria-describedby={`${formId}-id-help`}
                spellCheck={false}
                className="ac-mono"
              />
              <small id={`${formId}-id-help`}>Proposé à partir du nom ; il ne pourra plus être changé.</small>
            </div>
          )}
        </div>

        <fieldset>
          <legend>Informations</legend>
          <div className="ac-form-grid">
            {data.map((name) => {
              const spec = schema.properties[name];
              const inputId = `${formId}-${name}`;
              const common = { id: inputId, value: values[name] ?? "", onChange: (e) => set(name, e.target.value) };
              return (
                <div className="ac-field" key={name}>
                  <label htmlFor={inputId}>{propertyLabel(name)}</label>
                  {spec.datatype === "boolean" ? (
                    <select {...common}>
                      <option value="">—</option>
                      <option value="true">Oui</option>
                      <option value="false">Non</option>
                    </select>
                  ) : (
                    <input
                      {...common}
                      type={{ integer: "number", decimal: "number", dateTime: "datetime-local" }[spec.datatype] ?? "text"}
                      step={spec.datatype === "decimal" ? "any" : undefined}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        {relations.length > 0 && (
          <details className="ac-relations-form" open={FIRST_RELATIONS.some((n) => relations.includes(n))}>
            <summary>Relations ({relations.length} possibles)</summary>
            <div className="ac-form-grid">
              {relations.map((name) => (
                <RelationPicker
                  key={`${type}-${name}`}
                  label={propertyLabel(name)}
                  target={schema.properties[name].targets[0]}
                  value={values[name] ?? []}
                  onChange={(list) => set(name, list)}
                />
              ))}
            </div>
          </details>
        )}

        {state.error && (
          <p className="ac-alert" role="alert">
            {state.error}
          </p>
        )}
        <footer className="ac-modal-foot">
          <button type="button" className="ac-btn ac-ghost" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="ac-btn ac-primary" disabled={state.saving}>
            {state.saving ? "Enregistrement…" : editing ? "Enregistrer" : "Créer"}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
