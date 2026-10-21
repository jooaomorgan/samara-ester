import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Hero } from "../components/home/Hero";
import { CategoryDoors } from "../components/home/CategoryDoors";
import { Marquee } from "../components/home/Marquee";
import { HowToBuy } from "../components/home/HowToBuy";
import { ProductGrid } from "../components/catalog/ProductCard";
import { Reveal } from "../components/motion/Reveal";
import { catalogService } from "../services/catalog";

export default function HomePage() {
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: catalogService.listCategories });
  const { data: arrivals = [] } = useQuery({ queryKey: ["new-arrivals"], queryFn: () => catalogService.listNewArrivals(8) });

  return (
    <>
      <Seo title="A noite pede cereja" description="Cherry Vibes: moda feminina e masculina, acessórios, maquiagem, cosméticos e calçados. Loja virtual em fase de montagem, com peças de exemplo." />
      <Hero />
      <CategoryDoors categories={categories} />
      <Marquee />

      <section id="novidades" className="bg-cream-2" aria-labelledby="novidades-title" data-testid="new-arrivals">
        <div className="container-x py-16 md:py-24">
          <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="novidades-title" className="display text-4xl sm:text-5xl">Novidades</h2>
              <p className="mt-3 max-w-md text-sm text-ink-muted">Peças de exemplo enquanto a loja monta o catálogo real. Fotos, nomes e preços serão substituídos pelo painel.</p>
            </div>
            <Link to="/busca" className="link-underline text-xs uppercase tracking-[0.18em]" data-testid="see-all-link">Ver tudo</Link>
          </Reveal>
          <div className="mt-10">
            <ProductGrid products={arrivals} animate />
          </div>
        </div>
      </section>

      <HowToBuy />

      <section className="bg-cream" aria-labelledby="ajuda-title">
        <div className="container-x grid gap-8 py-16 md:grid-cols-3 md:py-24">
          <Reveal>
            <h2 id="ajuda-title" className="display text-3xl sm:text-4xl">Precisa de ajuda?</h2>
          </Reveal>
          {[
            ["Trocas e devoluções", "Veja como funcionará a troca de tamanho ou cor.", "/trocas-e-devolucoes"],
            ["Contato", "Fale com a loja por mensagem.", "/contato"],
          ].map(([title, text, href], i) => (
            <Reveal key={href} delay={0.1 * (i + 1)}>
              <Link to={href} className="group block border-t border-[var(--line-light)] pt-5" data-testid={`help-link-${href.slice(1)}`}>
                <h3 className="font-serif text-2xl font-light transition-colors duration-200 group-hover:text-cherry">{title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{text}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
