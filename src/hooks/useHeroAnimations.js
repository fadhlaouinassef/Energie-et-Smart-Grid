import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useHeroAnimations(heroRef) {
  useEffect(() => {
    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 801px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      ({ conditions }) => {
        if (!conditions.motion) return;

        const context = gsap.context(() => {
          // Entrance and scroll transforms use separate wrappers to avoid collisions.
          gsap
            .timeline({ defaults: { ease: "power3.out", duration: 0.85 } })
            .from(".hero-copy [data-hero]", {
              y: 28,
              opacity: 0,
              stagger: 0.12,
            })
            .from(".grid-art", { y: 25, opacity: 0, scale: 0.96 }, 0.25);

          // Match the reference can: descend with scroll and shrink to 90%
          // halfway through the hero. Scrubbing also reverses when scrolling up.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
              defaults: { ease: "none" },
            })
            .to(
              ".grid-art-scroll",
              { y: conditions.desktop ? 200 : 85, duration: 1 },
              0,
            )
            .to(".grid-art-scroll", { scale: 0.9, duration: 0.5 }, 0);

          gsap.to(".energy-flow", {
            strokeDashoffset: -99,
            duration: 3.5,
            ease: "none",
            repeat: -1,
          });
          gsap.to(".network-pulse", {
            opacity: 0.35,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
          });
          gsap.to(".label-solar, .label-building", {
            y: -6,
            duration: 3,
            stagger: 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }, heroRef);

        return () => context.revert();
      },
    );

    return () => media.revert();
  }, [heroRef]);
}
