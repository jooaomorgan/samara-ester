import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { useStoreSettings } from "../../hooks/useStoreSettings";
import { catalogService } from "../../services/catalog";
import { useStoreDataStatus } from "../../hooks/useStoreDataStatus";

const helpLinks = [
  ["Como comprar", "/#como-comprar"],
  ["Trocas e devoluções", "/trocas-e-devolucoes"],
  ["Contato", "/contato"],
  ["Favoritos", "/favoritos"],
] as const;

export function Footer() {
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: catalogService.listCategories });
  const { data: settings } = useStoreSettings();
  const status = useStoreDataStatus();
  const storeName = settings?.loja.nome || "Cherry Vibes";
  const adminUrl = (process.env.REACT_APP_ADMIN_URL || "").trim();
  const paymentLabels = (settings?.checkout.formas_pagamento || []).map((method) => ({
    pix: "Pix",
    cartao: "cartão",
    whatsapp: "pagamento a combinar",
  }[method]));

  return (
    <footer className="theme-dark relative grain overflow-hidden" data-testid="site-footer">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-24">
        <div className="max-w-sm">
          <Logo name={storeName} slogan={settings?.loja.slogan} image={settings?.loja.logo} />
          <p className="mt-6 text-sm text-cream/70">
            {settings?.loja.slogan || "Moda, beleza e calçados escolhidos pela loja."}
          </p>
          {status.mode !== "fresh" && (
            <p className="mt-3 text-xs text-cream/50" data-testid="demo-catalog-notice">
              {status.mode === "stale" ? "Os dados podem estar desatualizados." : "Vitrine de demonstração; confirme disponibilidade antes da compra."}
            </p>
          )}
          {settings?.loja.whatsapp && (
            <a
              href={"https://wa.me/" + settings.loja.whatsapp.replace(/\D/g, "")}
              className="link-underline mt-4 inline-block text-sm text-cream/90"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp da loja
            </a>
          )}
        </div>

        <nav aria-label="Loja">
          <h2 className="eyebrow text-cream/60">Loja</h2>
          <ul className="mt-5 space-y-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link to={"/" + category.slug} className="link-underline inline-block py-2 text-sm text-cream/90">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Ajuda">
          <h2 className="eyebrow text-cream/60">Ajuda</h2>
          <ul className="mt-5 space-y-3">
            {helpLinks.map(([label, href]) => (
              <li key={href}>
                <Link to={href} className="link-underline inline-block py-2 text-sm text-cream/90">{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={storeName}>
          <h2 className="eyebrow text-cream/60">{storeName}</h2>
          <ul className="mt-5 space-y-3">
            <li><Link to="/sobre" className="link-underline inline-block py-2 text-sm text-cream/90">Sobre</Link></li>
            <li><Link to="/privacidade" className="link-underline inline-block py-2 text-sm text-cream/90">Privacidade</Link></li>
            {adminUrl && <li><a href={adminUrl} className="link-underline inline-block py-2 text-sm text-cream/90">Painel da loja</a></li>}
            {Object.entries(settings?.loja.redes_sociais || {}).filter(([, href]) => Boolean(href)).map(([name, href]) => (
              <li key={name}><a href={href} target="_blank" rel="noreferrer" className="link-underline inline-block py-2 text-sm text-cream/90">{name}</a></li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container-x flex flex-col gap-3 border-t border-[var(--line-dark)] py-6 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {storeName}. {settings?.loja.endereco || "Dados legais e endereço serão preenchidos pela loja."}</p>
        <p>
          {paymentLabels.length
            ? "Formas de pagamento: " + paymentLabels.join(", ") + "."
            : "Formas de pagamento serão informadas pela loja."}
        </p>
      </div>
    </footer>
  );
}

