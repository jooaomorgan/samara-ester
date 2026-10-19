import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { adminService } from "../services/catalog";
import { formatBRL, formatDate, orderStatusLabel, variantLabel } from "../lib/format";
import type { OrderStatus } from "../types/catalog";
import { AdminHeader, Phase2Button } from "./AdminLayout";
import { phase2 } from "./AdminProducts";

export function AdminStock() {
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: adminService.listProducts });
  const [onlyLow, setOnlyLow] = useState(false);
  const rows = products.flatMap((p) => p.variants.map((v) => ({ p, v }))).filter((r) => !onlyLow || r.v.stock <= 2);

  return (
    <>
      <AdminHeader title="Estoque" description="Uma linha por combinação (tamanho × cor, tom ou volume). Alterações não são gravadas nesta fase." action={<Phase2Button label="Salvar alterações" testId="admin-stock-save" onClick={() => phase2("Salvar estoque")} />} />
      <label className="mb-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} className="h-4 w-4 accent-[var(--cherry)]" data-testid="admin-stock-low-filter" /> Mostrar só estoque baixo (≤ 2)</label>
      <div className="overflow-x-auto border border-[var(--line-light)] bg-white">
        <table className="w-full text-sm" data-testid="admin-stock-table">
          <thead className="bg-cream-2 text-left text-xs uppercase tracking-[0.12em] text-ink-muted">
            <tr><th className="px-4 py-3">Produto</th><th className="px-4 py-3">Variação</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Quantidade</th></tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-light)]">
            {rows.map(({ p, v }) => (
              <tr key={v.id} data-testid={`admin-stock-row-${v.id}`}>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2 text-ink-muted">{variantLabel(v)}</td>
                <td className="px-4 py-2 font-mono text-xs text-ink-muted">{v.sku}</td>
                <td className="px-4 py-2">
                  <input type="number" min="0" defaultValue={v.stock} aria-label={`Estoque de ${p.name} ${variantLabel(v)}`} className={`field min-h-9 w-24 ${v.stock <= 2 ? "border-cherry" : ""}`} data-testid={`admin-stock-input-${v.id}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const statusTone: Record<OrderStatus, string> = {
  aguardando_pagamento: "bg-amber-100 text-amber-900",
  pago: "bg-emerald-100 text-emerald-900",
  em_separacao: "bg-sky-100 text-sky-900",
  enviado: "bg-indigo-100 text-indigo-900",
  entregue: "bg-cream-2 text-ink",
  cancelado: "bg-rose-100 text-rose-900",
};

export function AdminOrders() {
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: adminService.listOrders });
  return (
    <>
      <AdminHeader title="Pedidos" description="Pedidos de exemplo. Os pedidos reais chegarão pelo Mercado Pago na Fase 2." />
      <div className="overflow-x-auto border border-[var(--line-light)] bg-white">
        <table className="w-full text-sm" data-testid="admin-orders-table">
          <thead className="bg-cream-2 text-left text-xs uppercase tracking-[0.12em] text-ink-muted">
            <tr><th className="px-4 py-3">Pedido</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Data</th><th className="px-4 py-3">Pagamento</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-light)]">
            {orders.map((o) => (
              <tr key={o.id} data-testid={`admin-order-row-${o.id}`}>
                <td className="px-4 py-3 font-medium">{o.id}</td>
                <td className="px-4 py-3">{o.customerName}</td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 capitalize">{o.paymentMethod === "pix" ? "Pix" : "Cartão"}</td>
                <td className="px-4 py-3">{formatBRL(o.total)}</td>
                <td className="px-4 py-3">
                  <select defaultValue={o.status} aria-label={`Status do pedido ${o.id}`} onChange={() => phase2("Alterar status do pedido")} className={`min-h-9 border-0 px-2 text-xs ${statusTone[o.status]}`} data-testid={`admin-order-status-${o.id}`}>
                    {(Object.keys(orderStatusLabel) as OrderStatus[]).map((s) => <option key={s} value={s}>{orderStatusLabel[s]}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AdminShipping() {
  const { data: rules = [] } = useQuery({ queryKey: ["shipping-rules"], queryFn: adminService.listShippingRules });
  return (
    <>
      <AdminHeader title="Frete" description="Regras de exemplo por região. O cálculo por CEP e a gravação entram na Fase 2." action={<Phase2Button label="Salvar regras" testId="admin-shipping-save" onClick={() => phase2("Salvar regras de frete")} />} />
      <ul className="grid gap-3 md:grid-cols-3" data-testid="admin-shipping-list">
        {rules.map((r) => (
          <li key={r.id} className="space-y-3 border border-[var(--line-light)] bg-white p-5" data-testid={`admin-shipping-rule-${r.id}`}>
            <p className="text-sm font-medium">{r.label}</p>
            <p className="text-xs text-ink-muted">{r.regions}</p>
            <label className="block text-xs uppercase tracking-[0.14em] text-ink-muted">Valor (R$)<input type="number" min="0" step="0.5" defaultValue={r.price} className="field mt-1 min-h-9" data-testid={`admin-shipping-price-${r.id}`} /></label>
            <label className="block text-xs uppercase tracking-[0.14em] text-ink-muted">Prazo<input defaultValue={r.deadlineDays} className="field mt-1 min-h-9" data-testid={`admin-shipping-deadline-${r.id}`} /></label>
            <label className="block text-xs uppercase tracking-[0.14em] text-ink-muted">Grátis acima de (R$)<input type="number" min="0" defaultValue={r.freeAbove ?? ""} placeholder="sem frete grátis" className="field mt-1 min-h-9" data-testid={`admin-shipping-free-${r.id}`} /></label>
          </li>
        ))}
      </ul>
    </>
  );
}
