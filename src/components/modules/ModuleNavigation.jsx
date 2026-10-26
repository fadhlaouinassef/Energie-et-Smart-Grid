import { Link } from "react-router-dom";
import modules from "../../data/modules";
import Icon from "../Icon";

export default function ModuleNavigation({ activeSlug }) {
  return (
    <nav className="module-navigation" aria-label="Choisir un module">
      {modules.map((module, index) => (
        <Link
          key={module.slug}
          to={`/modules/${module.slug}`}
          className="module-tab"
          aria-current={module.slug === activeSlug ? "page" : undefined}
        >
          <span className="module-tab-index">0{index + 1}</span>
          <Icon name={module.icon} size={18} />
          <span>{module.name}</span>
        </Link>
      ))}
    </nav>
  );
}
