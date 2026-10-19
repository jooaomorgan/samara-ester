import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import { ProductImage } from "../brand/ProductImage";
import { CherryIcon } from "../brand/CherryIcon";
import { useCartLines } from "../../hooks/useCartLines";
import { formatBRL, variantLabel } from "../../lib/format";
import type { CartLine } from "../../types/catalog";

export function CartLineRow({ line, onClose }: { line: CartLine; onClose?: () => void }) {
  const { setQuantity, remove } = useCartLines();
  const max = line.variant.stock;
  return (
    <li className="flex gap-4 py-5" data-testid={`cart-line-${line.variantId}`}>
      <Link to={`/produto/${line.product.slug}`} onClick={onClose} className="w-20 shrink-0">
        <ProductImage image={line.product.images[0]} sizes="80px" showLabel={false} />
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <Link to={`/produto/${line.product.slug}`} onClick={onClose} className="font-serif text-lg leading-tight">{line.product.name}</Link>
        <p className="text-xs text-ink-muted">{variantLabel(line.variant)}</p>
        <div className="mt-auto flex items-center justify-between">
          <div className="inline-flex items-center border border-[var(--line-light)]">
            <button type="button" className="grid h-10 w-10 place-items-center" aria-label="Diminuir quantidade" onClick={() => setQuantity(line.variantId, line.quantity - 1)} data-testid={`cart-decrease-${line.variantId}`}><Minus className="h-3.5 w-3.5" /></button>
            <span className="w-8 text-center text-sm" data-testid={`cart-qty-${line.variantId}`}>{line.quantity}</span>
            <button type="button" className="grid h-10 w-10 place-items-center disabled:opacity-40" aria-label="Aumentar quantidade" disabled={line.quantity >= max} onClick={() => setQuantity(line.variantId, line.quantity + 1)} data-testid={`cart-increase-${line.variantId}`}><Plus className="h-3.5 w-3.5" /></button>
          </div>
          <span className="text-sm">{formatBRL(line.product.price * line.quantity)}</span>
          <button type="button" className="grid h-10 w-10 place-items-center text-ink-muted hover:text-cherry" aria-label={`Remover ${line.product.name}`} onClick={() => remove(line.variantId)} data-testid={`cart-remove-${line.variantId}`}><Trash2 className="h-4 w-4" strokeWidth={1.5} /></button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { lines, subtotal, count } = useCartLines();
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full max-w-md flex-col bg-cream p-0 text-ink" data-testid="cart-drawer">
        <div className="border-b border-[var(--line-light)] px-6 py-5">
          <SheetTitle className="font-serif text-2xl font-light">Sua sacola</SheetTitle>
          <SheetDescription className="text-xs text-ink-muted">{count ? `${count} ${count === 1 ? "item" : "itens"}` : "Ainda vazia"}</SheetDescription>
        </div>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center" data-testid="cart-empty-state">
            <CherryIcon className="h-10 w-10 text-cherry" />
            <p className="font-serif text-xl">Nada por aqui ainda.</p>
            <p className="max-w-xs text-sm text-ink-muted">Comece pelas novidades ou escolha uma das quatro áreas da loja.</p>
            <Link to="/roupas" onClick={close} className="btn btn-ink mt-2" data-testid="cart-empty-cta">Ver roupas</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[var(--line-light)] overflow-y-auto px-6">
              {lines.map((line) => <CartLineRow key={line.variantId} line={line} onClose={close} />)}
            </ul>
            <div className="border-t border-[var(--line-light)] px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-muted">Subtotal</span>
                <span className="font-serif text-2xl" data-testid="cart-subtotal">{formatBRL(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">Frete calculado na próxima etapa.</p>
              <div className="mt-5 grid gap-2">
                <Link to="/checkout" onClick={close} className="btn btn-cherry" data-testid="cart-checkout-link">Ir para o checkout</Link>
                <Link to="/carrinho" onClick={close} className="btn btn-ghost-dark" data-testid="cart-view-link">Ver sacola completa</Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
