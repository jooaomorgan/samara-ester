import { motion, useReducedMotion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CherryBranch } from "../brand/CherryBranch";
import { SplitLines } from "../motion/Reveal";
import { MOTION_OK, gsap } from "../../lib/motion";

const base = process.env.PUBLIC_URL ?? "";
const FRAMES = [
  { src: `${base}/hero/frame-1.jpg`, alt: "Cereja suspensa sobre uma taça de água com gás e gelo, fundo vinho escuro", caption: "Escolha a peça." },
  { src: `${base}/hero/frame-2.jpg`, alt: "Cereja mergulhando na taça, com respingos e bolhas", caption: "Mergulhe na noite." },
  { src: `${base}/hero/frame-3.jpg`, alt: "Cereja descansando no fundo da taça, entre o gelo", caption: "Brinde ao look." },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const ctx = gsap.context((self) => {
      const frames = self.selector!("[data-frame]") as HTMLElement[];
      const captions = self.selector!("[data-caption]") as HTMLElement[];
      gsap.set([...frames.slice(1), ...captions.slice(1)], { autoAlpha: 0 });

      gsap.matchMedia().add({ motion: MOTION_OK, desktop: "(min-width: 1024px)" }, (c) => {
        if (!c.conditions?.motion) return;
        const desktop = !!c.conditions.desktop;
        const tl = gsap.timeline({
          defaults: { ease: "premium" },
          scrollTrigger: { trigger: ref.current, start: "top 72px", end: desktop ? "+=160%" : "+=120%", scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.to(frames[0], { autoAlpha: 0, duration: 1 }, 0.4)
          .to(frames[1], { autoAlpha: 1, duration: 1 }, 0.4)
          .to(captions[0], { autoAlpha: 0, y: -8, duration: 0.5 }, 0.4)
          .to(captions[1], { autoAlpha: 1, duration: 0.5 }, 0.9)
          .to(frames[1], { autoAlpha: 0, duration: 1 }, 2)
          .to(frames[2], { autoAlpha: 1, duration: 1 }, 2)
          .to(captions[1], { autoAlpha: 0, y: -8, duration: 0.5 }, 2)
          .to(captions[2], { autoAlpha: 1, duration: 0.5 }, 2.5)
          .to("[data-glass]", { scale: 1.06, duration: 3.2 }, 0);
        if (desktop) {
          tl.to("[data-hero-text]", { y: -40, duration: 3.2 }, 0).to("[data-branch]", { autoAlpha: 0.25, duration: 2 }, 0.4);
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="theme-dark relative grain h-[calc(100svh-72px)] overflow-hidden" data-testid="hero-section">
      <CherryBranch className="pointer-events-none absolute -right-10 -top-6 w-[min(80vw,560px)] text-cream/70 md:-right-4 md:top-0" data-branch="" />

      <div className="container-x relative grid h-full grid-cols-1 content-end gap-4 pb-8 pt-6 lg:grid-cols-12 lg:content-center lg:gap-10 lg:pb-0 lg:pt-0">
        <div data-hero-text="" className="relative z-10 will-change-transform lg:col-span-7">
          <p className="eyebrow text-blossom">Moda feminina e masculina<span className="hidden sm:inline"> · Maquiagem · Cosméticos</span></p>
          <h1 className="display mt-4 text-[clamp(2.75rem,10vw,9rem)] text-cream lg:mt-5" data-testid="hero-title">
            <SplitLines lines={["A noite", <>pede <em className="font-light italic text-blossom">cereja</em>.</>]} delay={0.15} />
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-4 max-w-md text-sm text-cream/75 md:mt-6 md:text-lg">
            Roupas, acessórios, maquiagem e cosméticos escolhidos para brilhar à meia-luz.
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.5, ease: [0.4, 0, 0.2, 1] }} className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <Link to="/#novidades" className="btn btn-cherry flex-1 sm:flex-none" data-testid="hero-cta-novidades">Ver novidades</Link>
            <Link to="/roupas" className="btn btn-ghost-light flex-1 sm:flex-none" data-testid="hero-cta-roupas">Explorar roupas</Link>
          </motion.div>
        </div>

        <motion.figure
          initial={reduce ? false : { clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative order-first mx-auto w-[min(44vw,200px)] lg:order-none lg:col-span-5 lg:w-full lg:max-w-[380px] lg:justify-self-end"
          data-testid="hero-glass"
        >
          <div data-glass="" className="clip-arch relative aspect-[512/688] overflow-hidden bg-[#140008] will-change-transform">
            {FRAMES.map((f, i) => (
              <img
                key={f.src}
                data-frame=""
                src={f.src}
                alt={f.alt}
                width={512}
                height={688}
                fetchPriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover will-change-[opacity]"
              />
            ))}
          </div>
          <figcaption className="relative mt-3 h-5 text-center text-[0.68rem] uppercase tracking-[0.22em] text-cream/60">
            {FRAMES.map((f) => (
              <span key={f.caption} data-caption="" className="absolute inset-x-0 top-0 block">{f.caption}</span>
            ))}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
