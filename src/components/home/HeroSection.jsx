import Icon from "../Icon";
import { useRef } from "react";
import GridIllustration from "./GridIllustration";
import useHeroAnimations from "../../hooks/useHeroAnimations";

export default function HeroSection() {
  const heroRef = useRef(null);
  useHeroAnimations(heroRef);

  return (
    <section
      ref={heroRef}
      className="hero section-wrap"
      id="accueil"
      aria-labelledby="hero-heading"
    >
      <div className="hero-copy">
        <div className="eyebrow" data-hero>
          <span className="status-dot" /> LE RÉSEAU ÉLECTRIQUE CONNECTÉ
        </div>
        <h1 id="hero-heading" data-hero>
          L’énergie
          <br />
          connectée,
          <br />
          les données
          <br />
          <span className="highlight">
            éclairées
            <svg
              viewBox="0 0 400 16"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M3 11Q185-4 395 8" />
            </svg>
          </span>
          <span className="green-period">.</span>
        </h1>
        <p className="hero-description" data-hero>
          Explorez les installations, les réseaux et les usages de l’électricité
          grâce à une plateforme fondée sur le Web sémantique.
        </p>
        <div className="hero-actions" data-hero>
          <a className="button button-lime" href="#modules">
            Explorer les modules <Icon name="diagonal" size={18} />
          </a>
          <a className="text-link" href="#projet">
            Découvrir le projet <Icon name="arrow" size={17} />
          </a>
        </div>
        <div className="hero-footnote" data-hero>
          <span>
            <Icon name="link" size={14} /> Des données reliées.
          </span>
          <span>Une énergie mieux comprise.</span>
        </div>
      </div>
      <GridIllustration />
      <div className="hero-bottom">
        <span>CONNECTER LES SAVOIRS. COMPRENDRE L’ÉNERGIE.</span>
        <a href="#projet">
          Défiler pour découvrir <span>↓</span>
        </a>
      </div>
    </section>
  );
}
