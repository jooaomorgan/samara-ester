import { motion, useReducedMotion } from "framer-motion";
import { createElement, useLayoutEffect, useRef, type ReactNode } from "react";
import { DUR, MOTION_OK, ScrollTrigger, gsap } from "../../lib/motion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(ref.current, { autoAlpha: 0, y: 16 }, {
          autoAlpha: 1, y: 0, duration: DUR.base, delay, ease: "premium",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [delay]);
  return createElement(as, { ref, className }, children);
}

export function useBatchReveal<T extends HTMLElement>(count: number) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    if (!count || !ref.current) return;
    const ctx = gsap.context((self) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const items = self.selector!("[data-reveal]") as HTMLElement[];
        gsap.set(items, { autoAlpha: 0, y: 16 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: DUR.base, ease: "premium", stagger: 0.08, overwrite: true }),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [count]);
  return ref;
}

export function SplitLines({ lines, className = "", delay = 0 }: { lines: ReactNode[]; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden ${className}`}>
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: DUR.slow, delay: delay + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}
