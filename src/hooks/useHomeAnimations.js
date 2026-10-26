import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useHomeAnimations(rootRef) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.utils.toArray("[data-reveal]").forEach((section) => {
          gsap.from(section, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: { trigger: section, start: "top 92%", once: true },
          });
        });
        gsap.from(".module-row", {
          y: 22,
          opacity: 0,
          stagger: 0.1,
          duration: 0.65,
          scrollTrigger: {
            trigger: ".module-list",
            start: "top 90%",
            once: true,
          },
        });
      }, rootRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, [rootRef]);
}
