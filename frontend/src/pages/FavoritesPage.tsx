import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { PageIntro } from "../components/layout/PageIntro";
import { ProductGrid } from "../components/catalog/ProductCard";
import { CherryIcon } from "../components/brand/CherryIcon";
import { useFavorites } from "../store/favorites";
import { catalogService } from "../services/catalog";

export default function FavoritesPage() {
  const { ids } = useFavorites();
  const { data: products = [] } = useQuery({ queryKey: ["favorites", ids], queryFn: () => catalogService.resolveMany(ids), enabled: ids.length > 0 });

  return (
    <>
      <Seo title="Favoritos" description="Suas peças favoritas na Cherry Vibes, salvas neste navegador." noIndex />
      <PageIntro eyebrow="Salvos neste navegador" title="Favoritos" lead={ids.length ? `${ids.length} ${ids.length === 1 ? "peça guardada" : "peças guardadas"} para a próxima noite.` : "Toque na cereja de qualquer peça para guardá-la aqui."} />
      <section className="bg-cream">
        <div className="container-x py-10 md:py-16">
          {ids.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center" data-testid="favorites-empty-state">
              <CherryIcon className="h-12 w-12 text-cherry" />
              <p className="font-serif text-2xl">Nenhuma cereja guardada ainda.</p>
              <Link to="/maquiagem" className="btn btn-ink mt-2" data-testid="favorites-empty-cta">Ver maquiagem</Link>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>
    </>
  );
}
