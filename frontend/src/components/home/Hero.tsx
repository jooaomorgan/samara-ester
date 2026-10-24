import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CherryBranch } from "../brand/CherryBranch";
import { SplitLines } from "../motion/Reveal";
import { resolveStoreImage, type StoreBanner } from "../../services/catalog";

const HERO_IMAGE = "https://images.unsplash.com/photo-1760497925673-d2f56ed4d8f9?crop=entropy&cs=srgb&fm=jpg&q=80&w=1400";

export function Hero({ banners = [] }: { banners?: StoreBanner[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeBanners = useMemo(
    () => banners.filter((banner) => banner.ativo).sort((a, b) => a.ordem - b.ordem),
    [banners],
  );
  const banner = activeBanners[activeIndex % Math.max(activeBanners.length, 1)];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);

  useEffect(() => {
    if (activeBanners.length < 2) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % activeBanners.length), 7000);
    return () => window.clearInterval(timer);
  }, [activeBanners.length]);

  const image = resolveStoreImage(banner?.imagem) || HERO_IMAGE;

  return (
    <section ref={ref} className="theme-dark relative grain min-h-[calc(100svh-72px)] overflow-hidden" data-testid="hero-section">
      <CherryBranch className="pointer-events-none absolute -right-10 -top-6 w-[min(80vw,560px)] text-cream/70 md:-right-4 md:top-0" />

      <div className="container-x relative grid min-h-[calc(100svh-72px)] grid-cols-1 items-end gap-6 pb-10 pt-8 lg:grid-cols-12 lg:items-center lg:pb-24 lg:pt-28">
        <motion.div key={banner?.id || "default-hero"} style={{ y: textY }} className="lg:col-span-7">
          <p className="eyebrow text-blossom">
            {banner ? (banner.titulo ? "Destaque da loja" : "Cherry Vibes") : "Moda e beleza"}
            {!banner && <span className="hidden sm:inline"> · Feminino e masculino · Calçados</span>}
          </p>
          <h1 className="display mt-4 text-[clamp(3rem,10vw,9.5rem)] text-cream lg:mt-6" data-testid="hero-title">
            {banner?.titulo
              ? banner.titulo.split("\n").map((line, index) => <span key={index} className="block">{line}</span>)
              : <SplitLines lines={["A noite", <>pede <em className="font-light italic text-blossom">cereja</em>.</>]} delay={0.15} />}
          </h1>
          <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} className="mt-5 max-w-md text-base text-cream/75 md:mt-8 md:text-lg">
            {banner?.texto || "Moda feminina e masculina, acessórios, maquiagem, cosméticos e calçados para brilhar à meia-luz."}
          </motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.5, ease: [0.4, 0, 0.2, 1] }} className="mt-8 flex flex-wrap gap-3 md:mt-10">
            {banner?.link_botao
              ? <a href={banner.link_botao} className="btn btn-cherry" data-testid="hero-cta-custom">{banner.texto_botao || "Saiba mais"}</a>
              : <Link to="/#novidades" className="btn btn-cherry" data-testid="hero-cta-novidades">Ver novidades</Link>}
            {!banner && <Link to="/roupas" className="btn btn-ghost-light" data-testid="hero-cta-roupas">Explorar roupas</Link>}
          </motion.div>
        </motion.div>

        <motion.figure
          initial={reduce ? false : { clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative order-first mx-auto w-[min(56vw,260px)] lg:order-none lg:col-span-5 lg:w-full lg:max-w-[420px] lg:justify-self-end"
        >
          <div className="clip-arch relative aspect-[3/4] overflow-hidden bg-wine-soft">
            <motion.img
              key={image}
              src={image}
              alt={banner?.imagem ? banner.titulo : "Imagem editorial provisória da loja"}
              width={900}
              height={1200}
              fetchPriority="high"
              decoding="async"
              style={{ y: imgY, scale: 1.18 }}
              className="h-full w-full object-cover object-top"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,transparent_40%,var(--wine)_100%)] opacity-60" />
          </div>
          {!banner?.imagem && <figcaption className="mt-3 text-center text-[0.62rem] uppercase tracking-[0.22em] text-cream/50">Imagem editorial provisória</figcaption>}
        </motion.figure>
      </div>
    </section>
  );
}

