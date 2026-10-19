import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { CherryBranch } from "../brand/CherryBranch";
import { SplitLines } from "../motion/Reveal";

const HERO_IMAGE = "https://images.unsplash.com/photo-1760497925673-d2f56ed4d8f9?crop=entropy&cs=srgb&fm=jpg&q=80&w=1400";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);

  return (
    <section ref={ref} className="theme-dark relative grain min-h-[92svh] overflow-hidden" data-testid="hero-section">
      <CherryBranch className="pointer-events-none absolute -right-10 -top-6 w-[min(80vw,560px)] text-cream/70 md:-right-4 md:top-0" />

      <div className="container-x relative grid min-h-[92svh] grid-cols-1 items-end gap-10 pb-16 pt-28 lg:grid-cols-12 lg:items-center lg:pb-24">
        <motion.div style={{ y: textY }} className="lg:col-span-7">
          <p className="eyebrow text-blossom">Moda feminina e masculina · Maquiagem · Cosméticos</p>
          <h1 className="display mt-6 text-[clamp(3.4rem,11vw,9.5rem)] text-cream" data-testid="hero-title">
            <SplitLines lines={["A noite", <>pede <em className="font-light italic text-blossom">cereja</em>.</>]} delay={0.2} />
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="mt-8 max-w-md text-base text-cream/75 md:text-lg">
            Roupas, acessórios, maquiagem e cosméticos escolhidos para brilhar à meia-luz.
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.7 }} className="mt-10 flex flex-wrap gap-3">
            <Link to="/#novidades" className="btn btn-cherry" data-testid="hero-cta-novidades">Ver novidades</Link>
            <Link to="/roupas" className="btn btn-ghost-light" data-testid="hero-cta-roupas">Explorar roupas</Link>
          </motion.div>
        </motion.div>

        <motion.figure
          initial={reduce ? false : { clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)" }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-[min(70vw,320px)] lg:col-span-5 lg:w-full lg:max-w-[420px] lg:justify-self-end"
        >
          <div className="clip-arch relative aspect-[3/4] overflow-hidden bg-wine-soft">
            <motion.img
              src={HERO_IMAGE}
              alt="Modelo em vestido escuro, iluminada por um foco de luz quente em estúdio"
              width={900}
              height={1200}
              fetchPriority="high"
              decoding="async"
              style={{ y: imgY, scale: 1.18 }}
              className="h-full w-full object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,transparent_40%,var(--wine)_100%)] opacity-60" />
          </div>
          <figcaption className="mt-3 text-center text-[0.62rem] uppercase tracking-[0.22em] text-cream/50">Imagem editorial provisória</figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
