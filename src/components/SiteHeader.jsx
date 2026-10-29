import { useLocation } from "react-router-dom";
import { useState } from "react";
import Icon from "./Icon";
import Brand from "./Brand";
import SignInButton from "./SignInButton";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = useLocation().pathname === "/";

  return (
    <header className="site-header">
      <Brand />
      <nav
        className={menuOpen ? "navigation is-open" : "navigation"}
        id="main-nav"
        aria-label="Navigation principale"
      >
        <a
          href="/#accueil"
          className={isHome ? "nav-home" : undefined}
          aria-current={isHome ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          Accueil
        </a>
        <a href="/#projet" onClick={() => setMenuOpen(false)}>
          Le projet
        </a>
        <a href="/#modules" onClick={() => setMenuOpen(false)}>
          Modules
        </a>
      </nav>
      <SignInButton />
      <a className="button button-dark nav-explore" href="/#modules">
        Explorer <Icon name="diagonal" size={16} />
      </a>
      <button
        className="menu-toggle"
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpen(!menuOpen)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setMenuOpen(false);
        }}
      >
        <Icon name={menuOpen ? "close" : "menu"} />
      </button>
    </header>
  );
}
