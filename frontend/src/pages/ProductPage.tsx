import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Seo } from "../components/Seo";
import { ExampleBadge, ProductImage } from "../components/brand/ProductImage";
import { FavoriteButton } from "../components/brand/CherryIcon";
import { ProductGrid } from "../components/catalog/ProductCard";
import { VariantSelector, findVariant } from "../components/product/VariantSelector";
import { ProductDetails } from "../components/product/ProductDetails";
import { Reveal } from "../components/motion/Reveal";
import { useCart } from "../store/cart";
import { catalogService } from "../services/catalog";
import { formatBRL } from "../lib/format";
import type { OptionKey, Product } from "../types/catalog";

const categoryName: Record<string, string> = { roupas: "Roupas", acessorios: "Acessórios", maquiagem: "Maquiagem", cosmeticos: "Cosméticos", calcados: "Calçados" };

function ProductView({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const { add } = useCart();
  const [selection, setSelection] = useState<Partial<Record<OptionKey, string>>>(() =>
    product.options.length === 1 && product.options[0].values.length === 1 ? { [product.options[0].key]: product.options[0].values[0].value } : {},
  );
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const { data: related = [] } = useQuery({ queryKey: ["related", product.id], queryFn: () => catalogService.listRelated(product) });

  const variant = findVariant(product, selection);
  const missing = product.options.filter((o) => !selection[o.key]).map((o) => o.label.toLowerCase());

  const handleAdd = () => {
    if (!variant) { setError(`Escolha ${missing.join(" e ")} antes de adicionar.`); return; }
    if (variant.stock === 0) { setError("Essa combinação está esgotada. Tente outra opção."); return; }
    setError(null);
    add(product.id, variant.id);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
    toast.success("Adicionado à sacola", { description: product.name });
  };

  return (
    <>
      <Seo
        title={product.name}
        description={product.description}
      />
      <article className="bg-cream">
        <div className="container-x py-6 md:py-12">
          <nav aria-label="Você está em" className="text-xs text-ink-muted">
            <ol className="flex flex-wrap gap-2">
              <li><Link to="/" className="link-underline">Início</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link to={`/${product.category}`} className="link-underline" data-testid="breadcrumb-category">{categoryName[product.category] || product.category}</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">{product.name}</li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
                {product.images.map((img, i) => (
                  <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: i * 0.1 }} className={`relative ${i === 0 ? "sm:col-span-2" : ""}`}>
                    <ProductImage image={img} priority={i === 0} sizes="(min-width: 1024px) 55vw, 100vw" className={i === 0 ? "sm:aspect-[5/4]" : ""} />
                    {i === 0 && product.isExample && <ExampleBadge className="absolute left-4 top-4 bg-cream/90" />}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow text-ink-muted">{categoryName[product.category] || product.category}{product.gender ? ` · ${product.gender}` : ""}</p>
                <h1 className="display mt-3 text-4xl sm:text-5xl" data-testid="product-title">{product.name}</h1>
                <p className="mt-4 font-serif text-3xl" data-testid="product-price">{formatBRL(product.price)}</p>
                <p className="mt-6 text-sm text-ink-muted md:text-base">{product.description}</p>

                <div className="mt-8">
                  <VariantSelector product={product} selection={selection} onChange={(k, v) => { setError(null); setSelection((s) => ({ ...s, [k]: v })); }} />
                </div>

                <p className="mt-6 text-xs text-ink-muted" aria-live="polite" data-testid="stock-status">
                </p>

                {error && <p role="alert" className="mt-3 border-l-2 border-cherry pl-3 text-sm text-cherry" data-testid="add-to-cart-error">{error}</p>}

                <div className="mt-6 flex gap-3">
                  <motion.button type="button" onClick={handleAdd} whileTap={reduce ? undefined : { scale: 0.97 }} className="btn btn-cherry flex-1" data-testid="add-to-cart-button">
                    {justAdded ? "Na sacola ✓" : "Adicionar à sacola"}
                  </motion.button>
                  <FavoriteButton productId={product.id} name={product.name} className="h-12 w-12 bg-transparent" />
                </div>

                <div className="mt-10">
                  <ProductDetails product={product} />
                </div>
                <p className="mt-6 text-xs text-ink-muted">Trocas e devoluções: a política será publicada pela loja. <Link to="/trocas-e-devolucoes" className="link-underline">Saiba mais</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-cream-2" aria-labelledby="relacionados-title">
          <div className="container-x py-16 md:py-24">
            <Reveal><h2 id="relacionados-title" className="display text-3xl sm:text-4xl">Combina com</h2></Reveal>
            <div className="mt-8"><ProductGrid products={related} /></div>
          </div>
        </section>
      )}
    </>
  );
}

export default function ProductPage() {
  const { slug = "" } = useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", slug], queryFn: () => catalogService.getProduct(slug) });
  if (isLoading) return <div className="container-x py-24 text-sm text-ink-muted">Carregando…</div>;
  if (!product) return <Navigate to="/404" replace />;
  return <ProductView key={product.id} product={product} />;
}

