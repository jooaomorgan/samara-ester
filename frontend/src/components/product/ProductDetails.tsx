import type { Product } from "../../types/catalog";

const labels: Record<keyof Product["details"], string> = {
  material: "Material",
  cuidados: "Cuidados",
  pesoOuVolume: "Peso ou volume",
  ingredientes: "Ingredientes",
  modoDeUso: "Modo de uso",
  validade: "Validade",
  lote: "Lote",
};

export function ProductDetails({ product }: { product: Product }) {
  const entries = (Object.keys(labels) as (keyof Product["details"])[]).filter((k) => product.details[k]);
  if (entries.length === 0) return null;
  return (
    <dl className="divide-y divide-[var(--line-light)] border-y border-[var(--line-light)]" data-testid="product-details">
      {entries.map((k) => (
        <div key={k} className="grid gap-1 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
          <dt className="text-xs uppercase tracking-[0.18em] text-ink-muted">{labels[k]}</dt>
          <dd className="text-sm">{product.details[k]}</dd>
        </div>
      ))}
    </dl>
  );
}
