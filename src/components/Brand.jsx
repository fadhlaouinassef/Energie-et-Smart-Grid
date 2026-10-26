import Icon from "./Icon";

export default function Brand() {
  return (
    <a
      className="brand"
      href="/#accueil"
      aria-label="Énergie & Smart Grid — Accueil"
    >
      <span className="brand-symbol">
        <Icon size={25} />
      </span>
      <span>
        Énergie
        <span className="brand-second">
          & Smart Grid<span className="brand-period">.</span>
        </span>
      </span>
    </a>
  );
}
