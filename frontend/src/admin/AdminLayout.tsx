import { Boxes, LayoutDashboard, Package, Settings2, ShoppingCart, Store } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Seo } from "../components/Seo";
import { CherryMark } from "../components/brand/Logo";

const items = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, end: true, id: "overview" },
  { to: "/admin/produtos", label: "Produtos", icon: Package, id: "products" },
  { to: "/admin/estoque", label: "Estoque", icon: Boxes, id: "stock" },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart, id: "orders" },
  { to: "/admin/frete", label: "Frete", icon: Settings2, id: "shipping" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-ink" data-testid="admin-layout">
      <Seo title="Painel da loja" description="Painel administrativo da Cherry Vibes." noIndex />
      <a href="#admin-conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-cream">Pular para o conteúdo</a>
      <div role="status" className="border-b border-cherry/30 bg-cherry/10 px-4 py-2 text-center text-xs text-ink" data-testid="admin-phase-banner">
        <strong>Fase 1 — interface e fluxo.</strong> O salvamento, o login da dona e o envio de fotos serão ativados na Fase 2. Nada do que você alterar aqui é gravado.
      </div>
      <div className="grid min-h-[calc(100vh-37px)] lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-[var(--line-light)] bg-white lg:border-b-0 lg:border-r" aria-label="Menu do painel">
          <div className="flex items-center gap-3 px-5 py-5">
            <CherryMark className="h-8 w-8 text-wine" />
            <div className="leading-tight">
              <p className="font-serif text-lg">Cherry Vibes</p>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">Painel da loja</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
            {items.map(({ to, label, icon: Icon, end, id }) => (
              <NavLink key={to} to={to} end={end} data-testid={`admin-nav-${id}`} className={({ isActive }) => `flex min-h-11 items-center gap-3 whitespace-nowrap px-3 text-sm transition-colors duration-150 ${isActive ? "bg-wine text-cream" : "text-ink hover:bg-cream-2"}`}>
                <Icon className="h-4 w-4" strokeWidth={1.6} /> {label}
              </NavLink>
            ))}
            <NavLink to="/" data-testid="admin-nav-store" className="mt-auto flex min-h-11 items-center gap-3 whitespace-nowrap px-3 text-sm text-ink-muted hover:bg-cream-2 lg:border-t lg:border-[var(--line-light)]">
              <Store className="h-4 w-4" strokeWidth={1.6} /> Ver a loja
            </NavLink>
          </nav>
        </aside>
        <main id="admin-conteudo" className="px-5 py-8 lg:px-10" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}

export function AdminHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl font-light" data-testid="admin-title">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Phase2Button({ label, testId, onClick }: { label: string; testId: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-ink min-h-10 px-4 text-[0.7rem]" data-testid={testId} title="Será ativado na Fase 2">
      {label}
    </button>
  );
}
