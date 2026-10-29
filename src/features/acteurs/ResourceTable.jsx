import Glyph from "./Glyph";
import { COLUMNS, capitalize, humanize } from "./utils";

function Chips({ values = [], onOpen, collection }) {
  if (!values.length) return <span className="ac-muted">—</span>;
  const [first, ...others] = values;
  return (
    <span className="ac-chips">
      <button type="button" className="ac-chip" onClick={() => onOpen?.(collection, first)}>
        {capitalize(first.replaceAll("_", " "))}
      </button>
      {others.length > 0 && <span className="ac-muted">+{others.length}</span>}
    </span>
  );
}

/** Tableau de ressources ; les actions n'apparaissent que si les callbacks sont fournis. */
export default function ResourceTable({ collection, items, onOpen, onEdit, onDelete }) {
  const personnes = collection === "personnes";
  const headers = COLUMNS[collection].slice(2).filter((column) => column.title !== "Identifiant RDF");
  return (
    <div className="ac-table-wrap">
      <table className="ac-table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            {headers.map((column) => (
              <th scope="col" key={column.title}>
                {column.title}
              </th>
            ))}
            {(onEdit || onDelete) && <th scope="col" className="ac-actions-col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <button type="button" className="ac-name" onClick={() => onOpen(collection, item.id)}>
                  {item.name}
                  <small>{item.id}</small>
                </button>
              </td>
              <td>
                <span className="ac-badge">{humanize(item.type)}</span>
              </td>
              {personnes ? (
                <>
                  <td className="ac-mono">{item.properties.identifiantPersonne?.[0] ?? <span className="ac-muted">—</span>}</td>
                  <td>
                    <Chips values={item.properties.travaillePour} collection="organisations" onOpen={onOpen} />
                  </td>
                </>
              ) : (
                <>
                  <td className="ac-mono">{item.properties.emploiePersonne?.length ?? 0}</td>
                  <td className="ac-mono">{item.properties.collaboreAvec?.length ?? 0}</td>
                </>
              )}
              {(onEdit || onDelete) && (
                <td className="ac-actions-col">
                  <div className="ac-row-actions">
                    {onEdit && (
                      <button type="button" onClick={() => onEdit(collection, item)} aria-label={`Modifier ${item.name}`}>
                        <Glyph name="edit" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        className="ac-danger"
                        onClick={() => onDelete(collection, item)}
                        aria-label={`Supprimer ${item.name}`}
                      >
                        <Glyph name="trash" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
