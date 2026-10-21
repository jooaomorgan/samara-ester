import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";
import { ScrollTrigger, gsap } from "../lib/motion";

export function useSmoothScroll() {
  const { pathname, hash } = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        const el = document.getElementById(hash.slice(1));
        if (!el) return;

        const lenis = lenisRef.current;
        if (lenis) lenis.scrollTo(el, { offset: -72 });
        else el.scrollIntoView({ behavior: "auto", block: "start" });
        ScrollTrigger.refresh();
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    ScrollTrigger.refresh();
  }, [pathname, hash]);
}
