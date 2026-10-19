import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { PageIntro } from "../components/layout/PageIntro";
import { CartLineRow } from "../components/layout/CartDrawer";
import { CherryIcon } from "../components/brand/CherryIcon";
import { useCartLines } from "../hooks/useCartLines";
import { formatBRL } from "../lib/format";

export default function CartPage() {
  const { lines, subtotal, count, clear } = useCartLines();
  return (
    <>
      <Seo title="Sacola" description="Sua sacola na Cherry Vibes." noIndex />
      <PageIntro eyebrow="Salva neste navegador" title="Sacola" lead={count ? `${count} ${count === 1 ? "item" : "itens"} esperando por você.` : "Sua sacola está vazia."} />
      <section className="bg-cream">
        <div className="container-x py-10 md:py-16">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center" data-testid="cart-page-empty">
              <CherryIcon className="h-12 w-12 text-cherry" />
              <p className="font-serif text-2xl">Nada por aqui ainda.</p>
              <Link to="/" className="btn btn-ink mt-2" data-testid="cart-page-empty-cta">Voltar para a vitrine</Link>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
              <ul className="divide-y divide-[var(--line-light)] border-y border-[var(--line-light)]" data-testid="cart-page-lines">
                {lines.map((l) => <CartLineRow key={l.variantId} line={l} />)}
              </ul>
              <aside className="h-fit border border-[var(--line-light)] bg-white p-6 lg:sticky lg:top-28">
                <h2 className="font-serif text-2xl font-light">Resumo</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between"><dt className="text-ink-muted">Subtotal</dt><dd data-testid="cart-page-subtotal">{formatBRL(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-muted">Frete</dt><dd>calculado no checkout</dd></div>
                </dl>
                <Link to="/checkout" className="btn btn-cherry mt-6 w-full" data-testid="cart-page-checkout-link">Ir para o checkout</Link>
                <button type="button" onClick={clear} className="link-underline mt-4 text-xs uppercase tracking-[0.16em] text-ink-muted" data-testid="cart-clear-button">Esvaziar sacola</button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
