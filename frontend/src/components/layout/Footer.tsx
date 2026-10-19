import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";

const columns = [
  { title: "Loja", links: [["Roupas", "/roupas"], ["Acessórios", "/acessorios"], ["Maquiagem", "/maquiagem"], ["Cosméticos", "/cosmeticos"]] },
  { title: "Ajuda", links: [["Como comprar", "/#como-comprar"], ["Trocas e devoluções", "/trocas-e-devolucoes"], ["Contato", "/contato"], ["Favoritos", "/favoritos"]] },
  { title: "Cherry Vibes", links: [["Sobre", "/sobre"], ["Privacidade e LGPD", "/privacidade"], ["Painel da loja", "/admin"]] },
];

export function Footer() {
  return (
    <footer className="theme-dark relative grain overflow-hidden" data-testid="site-footer">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:py-24">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-6 text-sm text-cream/70">
            Roupas, acessórios, maquiagem e cosméticos escolhidos para brilhar à meia-luz. Loja em fase de montagem; os produtos exibidos são exemplos.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="eyebrow text-cream/60">{col.title}</h2>
            <ul className="mt-5 space-y-3">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="link-underline inline-block py-1 text-sm text-cream/90" data-testid={`footer-link-${href.replace(/[^a-z]/g, "") || "home"}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container-x flex flex-col gap-3 border-t border-[var(--line-dark)] py-6 text-xs text-cream/50 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Cherry Vibes. Dados legais (CNPJ, endereço) serão informados pela loja.</p>
        <p>Pagamento com Pix e cartão via Mercado Pago será ativado na próxima fase.</p>
      </div>
    </footer>
  );
}
