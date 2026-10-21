import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import { Logo } from "../brand/Logo";
import { CherryIcon } from "../brand/CherryIcon";
import { useCart } from "../../store/cart";
import { useFavorites } from "../../store/favorites";
import { CartDrawer } from "./CartDrawer";

const nav = [
  ["Roupas", "/roupas"],
  ["Acessórios", "/acessorios"],
  ["Maquiagem", "/maquiagem"],
  ["Cosméticos", "/cosmeticos"],
  ["Calçados", "/calcados"],
] as const;

function Counter({ value, testId }: { value: number; testId: string }) {
  if (!value) return null;
  return (
    <span data-testid={testId} className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-cherry px-1 text-[0.6rem] font-medium text-cream">
      {value}
    </span>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const favorites = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMenuOpen(false);
    navigate(`/busca?q=${encodeURIComponent(q)}`);
  };

  const iconBtn = "relative grid h-11 w-11 place-items-center text-cream transition-colors duration-200 hover:text-blossom";

  return (
    <header className={`theme-dark sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${scrolled ? "border-[var(--line-dark)] bg-wine/85 backdrop-blur-xl" : "border-transparent bg-wine"}`} data-testid="site-header">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-cream focus:px-3 focus:py-2 focus:text-wine">Pular para o conteúdo</a>
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <button type="button" className={iconBtn} onClick={() => setMenuOpen(true)} aria-label="Abrir menu" data-testid="menu-open-button">
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <Logo compact className="lg:hidden" />
        <Logo className="hidden lg:inline-flex" />
        <nav aria-label="Categorias" className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-8">
            {nav.map(([label, href]) => (
              <li key={href}>
                <NavLink to={href} data-testid={`nav-${href.slice(1)}`} className={({ isActive }) => `link-underline py-2 text-[0.8rem] uppercase tracking-[0.18em] text-cream/90 ${isActive ? "text-blossom after:scale-x-100" : ""}`}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-0 sm:gap-1">
          <button type="button" className={iconBtn} onClick={() => setSearchOpen((v) => !v)} aria-expanded={searchOpen} aria-controls="busca-rapida" aria-label="Buscar" data-testid="search-toggle-button">
            {searchOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Search className="h-5 w-5" strokeWidth={1.5} />}
          </button>
          <Link to="/favoritos" className={iconBtn} aria-label={`Favoritos, ${favorites.ids.length} itens`} data-testid="favorites-link">
            <CherryIcon filled={favorites.ids.length > 0} />
            <Counter value={favorites.ids.length} testId="favorites-count" />
          </Link>
          <button type="button" className={iconBtn} onClick={() => setCartOpen(true)} aria-label={`Abrir sacola, ${count} itens`} data-testid="cart-open-button">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <Counter value={count} testId="cart-count" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <form id="busca-rapida" onSubmit={submitSearch} role="search" className="container-x border-t border-[var(--line-dark)] py-3" data-testid="search-form">
          <label htmlFor="busca-input" className="sr-only">Buscar produtos</label>
          <div className="flex gap-2">
            <input id="busca-input" autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por vestido, batom, sérum…" className="field bg-wine-deep text-cream placeholder:text-cream/40 border-[var(--line-dark)]" data-testid="search-input" />
            <button type="submit" className="btn btn-cherry" data-testid="search-submit-button">Buscar</button>
          </div>
        </form>
      )}

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="theme-dark w-[86vw] max-w-sm border-[var(--line-dark)] p-0" data-testid="mobile-menu">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex h-full flex-col px-7 py-8">
            <Logo />
            <nav aria-label="Categorias" className="mt-12">
              <ul className="space-y-1">
                {nav.map(([label, href]) => (
                  <li key={href}>
                    <NavLink to={href} onClick={() => setMenuOpen(false)} data-testid={`mobile-nav-${href.slice(1)}`} className="display block py-3 text-4xl text-cream">
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className="mt-auto space-y-3 border-t border-[var(--line-dark)] pt-6 text-sm text-cream/80">
              {[["Favoritos", "/favoritos"], ["Sobre", "/sobre"], ["Trocas e devoluções", "/trocas-e-devolucoes"], ["Contato", "/contato"]].map(([label, href]) => (
                <li key={href}><Link to={href} onClick={() => setMenuOpen(false)} className="block py-2">{label}</Link></li>
              ))}
            </ul>
          </div>
        </SheetContent>
      </Sheet>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
