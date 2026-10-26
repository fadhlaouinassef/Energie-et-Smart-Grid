import { useRef } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import HeroSection from "./components/home/HeroSection";
import EnergyRibbon from "./components/home/EnergyRibbon";
import ProjectSection from "./components/home/ProjectSection";
import ModulesSection from "./components/home/ModulesSection";
import AssistantSection from "./components/home/AssistantSection";
import useHomeAnimations from "./hooks/useHomeAnimations";

export default function App() {
  const root = useRef(null);
  useHomeAnimations(root);

  return (
    <div ref={root}>
      <a className="skip-link" href="#contenu">
        Aller au contenu
      </a>
      <SiteHeader />
      <main id="contenu">
        <HeroSection />
        <EnergyRibbon />
        <ProjectSection />
        <ModulesSection />
        <AssistantSection />
      </main>
      <SiteFooter />
    </div>
  );
}
