import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import { useSmoothScroll } from "../../hooks/useSmoothScroll";
import { useStoreSettings } from "../../hooks/useStoreSettings";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { StoreStatusNotice } from "./StoreStatusNotice";

const ACCENTS = {
  vinho: "#6B1836",
  cereja: "#A30C34",
  rosa: "#B45C79",
} as const;

export default function StoreLayout() {
  useSmoothScroll();
  const { data: settings } = useStoreSettings();
  const accent = ACCENTS[settings?.destaque ?? "vinho"];

  return (
    <div className="flex min-h-screen flex-col" style={{ "--cherry": accent } as CSSProperties}>
      <Header />
      <StoreStatusNotice />
      {settings && (!settings.loja_aberta || settings.vendas_pausadas) && (
        <p className="bg-cream-2 px-4 py-2 text-center text-xs text-ink-muted" role="status" data-testid="store-closed-notice">
          {settings.vendas_pausadas && settings.mensagem_pausa
            ? settings.mensagem_pausa
            : "Os pedidos estão temporariamente indisponíveis."}
        </p>
      )}
      <main id="conteudo" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

