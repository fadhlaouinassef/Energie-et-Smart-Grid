import { capitalize } from "./utils";

const W = 720;
const H = 440;
const MAX_NODES = 24;
const short = (text) => (text.length > 24 ? `${text.slice(0, 23)}…` : text);

/** Graphe radial : la ressource au centre, ses voisines du module autour. Cliquer ouvre la fiche voisine. */
export default function RelationGraph({ center, nodes, onOpen }) {
  const shown = nodes.slice(0, MAX_NODES);
  const hidden = nodes.length - shown.length;
  const place = (index) => {
    const angle = (2 * Math.PI * index) / shown.length - Math.PI / 2;
    // Au-delà de 12 voisins, un nœud sur deux est rapproché du centre pour que les libellés ne se chevauchent pas.
    const scale = shown.length > 12 && index % 2 ? 0.68 : 1;
    return { x: W / 2 + 200 * scale * Math.cos(angle), y: H / 2 + 165 * scale * Math.sin(angle), cos: Math.cos(angle), sin: Math.sin(angle) };
  };

  return (
    <svg className="ac-graph" viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Relations de ${center.name} avec ${nodes.length} ressources du module`}>
      {shown.map((node, index) => {
        const p = place(index);
        return <line key={node.id} x1={W / 2} y1={H / 2} x2={p.x} y2={p.y} className="ac-edge" />;
      })}
      {shown.map((node, index) => {
        const p = place(index);
        const anchor = p.cos > 0.3 ? "start" : p.cos < -0.3 ? "end" : "middle";
        const links = node.links.map((l) => `${l.direction === "out" ? "→" : "←"} ${l.property}`).join(", ");
        return (
          <g
            key={node.id}
            className={`ac-node ac-node-${node.collection}`}
            tabIndex={0}
            role="button"
            aria-label={`Ouvrir ${node.name}`}
            onClick={() => onOpen(node.collection, node.id)}
            onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && (event.preventDefault(), onOpen(node.collection, node.id))}
          >
            <title>{`${node.name} (${links})`}</title>
            <circle cx={p.x} cy={p.y} r="8" />
            <text x={p.x + (anchor === "start" ? 13 : anchor === "end" ? -13 : 0)} y={p.y + (anchor === "middle" ? (p.sin > 0 ? 22 : -14) : 4)} textAnchor={anchor}>
              {short(capitalize(node.name))}
            </text>
          </g>
        );
      })}
      <g className="ac-node ac-node-center">
        <circle cx={W / 2} cy={H / 2} r="17" />
        <text x={W / 2} y={H / 2 + 4} textAnchor="middle">
          ●
        </text>
      </g>
      <text x={W / 2} y={H / 2 + 36} textAnchor="middle" className="ac-center-label">
        {short(capitalize(center.name))}
      </text>
      {hidden > 0 && (
        <text x={W - 10} y={H - 8} textAnchor="end" className="ac-graph-note">
          +{hidden} autres relations dans la liste
        </text>
      )}
    </svg>
  );
}
