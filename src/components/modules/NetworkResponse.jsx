const RDF_TYPE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
const RDF_LABEL = "http://www.w3.org/2000/01/rdf-schema#label";

function localName(value) {
  return value.split(/[#/]/).pop() || value;
}

function fieldLabel(property) {
  return localName(property).replace(/([a-zà-ÿ])([A-Z])/g, "$1 $2");
}

function ResourceResult({ resource }) {
  const properties = resource.properties || {};
  const labels = properties[RDF_LABEL] || [];
  const label = labels.find((value) => value["xml:lang"] === "fr") || labels[0];
  const fields = Object.entries(properties).filter(([key]) => key !== RDF_LABEL && key !== RDF_TYPE);

  return (
    <article className="resource-result">
      <h3>{label?.value || resource.id}</h3>
      <p className="resource-identifier" title={resource.uri}>{resource.id}</p>
      <div className="resource-types">
        {(properties[RDF_TYPE] || []).map((type) => (
          <span key={type.value} title={type.value}>{fieldLabel(type.value)}</span>
        ))}
      </div>
      {fields.length > 0 && (
        <details className="resource-details">
          <summary>Voir les propriétés ({fields.length})</summary>
          <dl>
            {fields.map(([property, values]) => (
              <div key={property}>
                <dt title={property}>{fieldLabel(property)}</dt>
                <dd>
                  <ul>
                    {values.map((value, index) => (
                      <li key={`${value.value}-${index}`} title={value.type === "uri" ? value.value : undefined}>
                        {value.type === "uri" ? localName(value.value) : value.value}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </article>
  );
}

export default function NetworkResponse({ message }) {
  if (message.status === "loading") {
    return <p className="response-notice" role="status">Traitement de votre demande…</p>;
  }
  if (message.status === "error") {
    return <p className="response-notice response-error" role="alert">{message.error}</p>;
  }
  const result = message.result;
  if (!result) return null;

  const resources = result.data || [];
  const confirmations = {
    create: "La ressource a été créée.",
    update: "La ressource a été modifiée.",
    delete: "La ressource a été supprimée.",
  };
  const summary = result.executed === false
    ? "La demande n’a pas été exécutée."
    : result.action === "read"
      ? resources.length > 0
        ? `${resources.length} résultat${resources.length > 1 ? "s" : ""} trouvé${resources.length > 1 ? "s" : ""}.`
        : "Aucun résultat trouvé pour cette demande."
      : confirmations[result.action] || "La demande a été traitée.";

  return (
    <div className="network-response">
      <p className="response-notice" role="status">{summary}</p>
      {result.id && <p className="resource-identifier">{result.id}</p>}
      {resources.length > 0 && (
        <div className="resource-results">
          {resources.map((resource) => <ResourceResult key={resource.uri || resource.id} resource={resource} />)}
        </div>
      )}
    </div>
  );
}
