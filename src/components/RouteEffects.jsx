import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import modules from "../data/modules";

export default function RouteEffects() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    const module = modules.find((item) => pathname === `/modules/${item.slug}`);
    document.title =
      pathname === "/"
        ? "Énergie & Smart Grid — Les données éclairées"
        : `${pathname === "/signin" ? "Connexion" : (module?.name ?? "Page introuvable")} — Énergie & Smart Grid`;
    const frame = requestAnimationFrame(() => {
      const anchor = hash ? document.getElementById(hash.slice(1)) : null;
      if (anchor) anchor.scrollIntoView({ behavior: "instant" });
      else window.scrollTo({ top: 0, behavior: "instant" });
      const target = anchor || document.querySelector("main");
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
