import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { Sheet, SheetContent, SheetTitle } from "../components/ui/sheet";
import { PageIntro } from "../components/layout/PageIntro";
import { ProductGrid } from "../components/catalog/ProductCard";
import { FilterPanel, SortSelect } from "../components/catalog/FilterPanel";
import { useCatalogFilters } from "../components/catalog/useCatalogFilters";
import { catalogService, isValidCategory } from "../services/catalog";

export default function CategoryPage() {
  const { categoria } = useParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { filters, activeCount, clear } = useCatalogFilters();
  const slug = isValidCategory(categoria) ? categoria : undefined;

  const { data: category } = useQuery({ queryKey: ["category", slug], queryFn: () => catalogService.getCategory(slug!), enabled: !!slug });
  const { data: facets } = useQuery({ queryKey: ["facets", slug], queryFn: () => catalogService.getFacets(slug), enabled: !!slug });
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", slug, filters],
    queryFn: () => catalogService.listProducts({ ...filters, category: slug }),
    enabled: !!slug,
  });

  if (!slug) return <Navigate to="/404" replace />;
  if (!category || !facets) return null;

  const panel = <FilterPanel facets={facets} showGender={category.hasGenderFilter} />;

  return (
    <>
      <Seo title={category.name} description={`${category.name} na Cherry Vibes: ${category.tagline.toLowerCase()}. Filtre por tamanho, cor, tom e preço.`} />
      <PageIntro eyebrow="Área da loja" title={category.name} lead={category.tagline} />

      <section className="bg-cream">
        <div className="container-x grid gap-10 py-10 lg:grid-cols-[260px_1fr] lg:py-16">
          <aside className="hidden lg:block" aria-label="Filtros">{panel}</aside>

          <div>
            <div className="flex items-center justify-between gap-4 border-b border-[var(--line-light)] pb-4">
              <p className="text-sm text-ink-muted" data-testid="results-count" aria-live="polite">
                {isLoading ? "Carregando…" : `${products.length} ${products.length === 1 ? "peça" : "peças"}`}
              </p>
              <div className="flex items-center gap-3">
                <SortSelect />
                <button type="button" onClick={() => setFiltersOpen(true)} className="btn btn-ghost-dark min-h-10 px-4 text-[0.7rem] lg:hidden" data-testid="filters-open-button">
                  <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} /> Filtrar{activeCount ? ` (${activeCount})` : ""}
                </button>
              </div>
            </div>
            <div className="mt-8">
              <ProductGrid products={products} emptyMessage="Nenhuma peça com esses filtros.">
                {activeCount > 0 && <button type="button" onClick={clear} className="btn btn-ink mt-6" data-testid="empty-clear-filters">Limpar filtros</button>}
              </ProductGrid>
            </div>
          </div>
        </div>
      </section>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-[88svh] overflow-y-auto bg-cream px-6 pb-8 text-ink" data-testid="filters-sheet">
          <SheetTitle className="font-serif text-2xl font-light">Filtrar</SheetTitle>
          <div className="mt-4">{panel}</div>
          <button type="button" onClick={() => setFiltersOpen(false)} className="btn btn-ink mt-6 w-full" data-testid="filters-apply-button">Ver {products.length} {products.length === 1 ? "peça" : "peças"}</button>
        </SheetContent>
      </Sheet>
    </>
  );
}
