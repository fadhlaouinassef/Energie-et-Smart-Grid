import Icon from "../Icon";

export default function EnergyRibbon() {
  return (
    <div
      className="energy-ribbon"
      aria-label="Production, stockage, distribution, consommation"
    >
      <div>
        {["Production", "Stockage", "Distribution", "Consommation"].map(
          (word) => (
            <span key={word}>
              {word}
              <Icon name="sparkle" size={24} />
            </span>
          ),
        )}
      </div>
    </div>
  );
}
