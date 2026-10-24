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
import { useStoreSettings } from "../hooks/useStoreSettings";
import { useStoreDataStatus } from "../hooks/useStoreDataStatus";

export default function HomePage() {
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: catalogService.listCategories });
  const { data: arrivals = [] } = useQuery({ queryKey: ["new-arrivals"], queryFn: () => catalogService.listNewArrivals(8) });
  const { data: products = [] } = useQuery({ queryKey: ["products", "home"], queryFn: () => catalogService.listProducts() });
  const { data: settings } = useStoreSettings();
  const status = useStoreDataStatus();
  const featuredIds = settings?.home.produtos_destaque || [];
  const featuredProducts = featuredIds.length
    ? products.filter((product) => featuredIds.includes(product.id) || featuredIds.includes(product.slug)).slice(0, 8)
    : arrivals;
  const featuredCategorySlugs = settings?.home.categorias_destaque || [];
  const featuredCategories = featuredCategorySlugs.length
    ? categories.filter((category) => featuredCategorySlugs.includes(category.slug))
    : categories;
  const activeBanners = (settings?.home.banners || []).filter((banner) => banner.ativo).sort((a, b) => a.ordem - b.ordem);
  const storeName = settings?.loja.nome || "Cherry Vibes";

  return (
    <>
      <Seo title={settings?.loja.slogan || "A noite pede cereja"} description={storeName + ": catálogo atualizado pela loja."} />
      {settings?.home.faixa_aviso && (
        <p className="bg-cream-2 px-4 py-2 text-center text-xs text-ink" role="status" data-testid="store-announcement">
          {settings.home.faixa_aviso}
        </p>
      )}
      <Hero banners={activeBanners} />
      <CategoryDoors categories={featuredCategories} />
      <Marquee />
      <section id="novidades" className="bg-cream-2" aria-labelledby="novidades-title" data-testid="new-arrivals">
        <div className="container-x py-16 md:py-24">
          <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="novidades-title" className="display text-4xl sm:text-5xl">{settings?.home.titulo_novidades || "Novidades"}</h2>
              <p className="mt-3 max-w-md text-sm text-ink-muted">
                {featuredProducts.some((product) => product.isExample) ? "Produtos de exemplo enquanto a loja cadastra os itens reais." : "Produtos publicados e destacados pela loja."}
              </p>
            </div>
            <Link to="/busca" className="link-underline text-xs uppercase tracking-[0.18em]" data-testid="see-all-link">Ver tudo</Link>
          </Reveal>
          <div className="mt-10">
            <ProductGrid products={featuredProducts} animate emptyMessage="Nenhum produto publicado para esta seleção." />
          </div>
        </div>
      </section>
      <HowToBuy />
    </>
  );
}

