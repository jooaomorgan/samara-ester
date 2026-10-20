import { Link } from "react-router-dom";
import { ExampleBadge, ProductImage } from "../brand/ProductImage";
import { FavoriteButton } from "../brand/CherryIcon";
import { useBatchReveal } from "../motion/Reveal";
import { formatBRL } from "../../lib/format";
import type { Product } from "../../types/catalog";

const categoryLabel: Record<Product["category"], string> = { roupas: "Roupas", acessorios: "Acessórios", maquiagem: "Maquiagem", cosmeticos: "Cosméticos" };

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const swatches = product.options.find((o) => o.key === "cor" || o.key === "tom")?.values.filter((v) => v.swatch) ?? [];
  const soldOut = product.variants.every((v) => v.stock === 0);
  return (
    <li data-reveal="" className="group relative">
      <Link to={`/produto/${product.slug}`} className="block" data-testid={`product-card-${product.id}`}>
        <div className="relative overflow-hidden bg-cream-2">
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
            <ProductImage image={product.images[0]} priority={priority} />
          </div>
          {product.isExample && <ExampleBadge className="absolute left-3 top-3 bg-cream/90" />}
          {soldOut && <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1.5 text-center text-[0.65rem] uppercase tracking-[0.2em] text-cream">Esgotado</span>}
        </div>
        <div className="mt-4 flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-3">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">{categoryLabel[product.category]}{product.gender && product.gender !== "unissex" ? ` · ${product.gender}` : ""}</p>
            <h3 className="mt-1 font-serif text-lg leading-tight md:text-xl">{product.name}</h3>
          </div>
          <span className="whitespace-nowrap text-sm md:pt-5" data-testid={`product-price-${product.id}`}>{formatBRL(product.price)}</span>
        </div>
        {swatches.length > 0 && (
          <ul className="mt-2 flex items-center gap-1.5" aria-label="Cores disponíveis">
            {swatches.slice(0, 5).map((s) => (
              <li key={s.value} className="h-3 w-3 rounded-full border border-[var(--line-light)]" style={{ background: s.swatch }} title={s.value} />
            ))}
            {swatches.length > 5 && <li className="text-[0.65rem] text-ink-muted">+{swatches.length - 5}</li>}
          </ul>
        )}
      </Link>
      <FavoriteButton productId={product.id} name={product.name} className="absolute right-3 top-3" />
    </li>
  );
}

export function ProductGrid({ products, emptyMessage, children, animate = false }: { products: Product[]; emptyMessage?: string; children?: React.ReactNode; animate?: boolean }) {
  const ref = useBatchReveal<HTMLUListElement>(animate ? products.length : 0);
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-[var(--line-light)] px-6 py-16 text-center" data-testid="product-grid-empty">
        <p className="font-serif text-2xl">{emptyMessage ?? "Nenhuma peça encontrada."}</p>
        <p className="mt-2 text-sm text-ink-muted">Tente limpar os filtros ou buscar por outro termo.</p>
        {children}
      </div>
    );
  }
  return (
    <ul ref={ref} className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4" data-testid="product-grid">
      {products.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)}
    </ul>
  );
}
