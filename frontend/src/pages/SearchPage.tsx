import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { PageIntro } from "../components/layout/PageIntro";
import { ProductGrid } from "../components/catalog/ProductCard";
import { SortSelect } from "../components/catalog/FilterPanel";
import { useCatalogFilters } from "../components/catalog/useCatalogFilters";
import { catalogService } from "../services/catalog";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q")?.trim() ?? "";
  const { filters } = useCatalogFilters();
  const { data: products = [] } = useQuery({ queryKey: ["search", filters], queryFn: () => catalogService.listProducts(filters) });

  return (
    <>
      <Seo title={q ? `Busca por “${q}”` : "Todas as peças"} description="Busque roupas, acessórios, maquiagem, cosméticos e calçados na Cherry Vibes." noIndex />
      <PageIntro eyebrow="Busca" title={q ? `“${q}”` : "Todas as peças"} lead={`${products.length} ${products.length === 1 ? "resultado" : "resultados"}`} />
      <section className="bg-cream">
        <div className="container-x py-10 md:py-16">
          <div className="flex justify-end border-b border-[var(--line-light)] pb-4"><SortSelect /></div>
          <div className="mt-8">
            <ProductGrid products={products} emptyMessage={`Nada encontrado para “${q}”.`} />
          </div>
        </div>
      </section>
    </>
  );
}
