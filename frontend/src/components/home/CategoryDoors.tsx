import { Link } from "react-router-dom";
import { Reveal } from "../motion/Reveal";
import type { Category } from "../../types/catalog";

export function CategoryDoors({ categories }: { categories: Category[] }) {
  return (
    <section className="bg-cream" aria-labelledby="areas-title" data-testid="category-doors">
      <div className="container-x py-16 md:py-24">
        <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 id="areas-title" className="display text-4xl sm:text-5xl">Quatro portas para a noite</h2>
          <p className="max-w-xs text-sm text-ink-muted">Comece pela área que combina com o seu plano de hoje.</p>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 0.08} className={i % 2 === 1 ? "lg:translate-y-10" : ""}>
              <Link to={`/${c.slug}`} className="group relative block overflow-hidden bg-wine" data-testid={`category-door-${c.slug}`}>
                <img src={c.image} alt={c.imageAlt} width={600} height={800} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover opacity-80 transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--wine)_0%,transparent_55%)]" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-cream md:p-6">
                  <h3 className="font-serif text-2xl font-light md:text-3xl">{c.name}</h3>
                  <p className="mt-1 text-xs text-cream/70">{c.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
