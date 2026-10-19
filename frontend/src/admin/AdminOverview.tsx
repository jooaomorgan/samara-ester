import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminService } from "../services/catalog";
import { formatBRL, orderStatusLabel } from "../lib/format";
import { AdminHeader } from "./AdminLayout";

export default function AdminOverview() {
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: adminService.listProducts });
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: adminService.listOrders });
  const lowStock = products.flatMap((p) => p.variants.filter((v) => v.stock <= 2).map((v) => ({ p, v }))).length;
  const pending = orders.filter((o) => o.status === "aguardando_pagamento").length;

  const cards = [
    { label: "Produtos cadastrados", value: products.length, to: "/admin/produtos", id: "products" },
    { label: "Variações com estoque baixo", value: lowStock, to: "/admin/estoque", id: "low-stock" },
    { label: "Pedidos aguardando pagamento", value: pending, to: "/admin/pedidos", id: "pending-orders" },
  ];

  return (
    <>
      <AdminHeader title="Visão geral" description="Números calculados sobre os dados de exemplo." />
      <ul className="grid gap-3 sm:grid-cols-3">
        {cards.map((c) => (
          <li key={c.id}>
            <Link to={c.to} className="block border border-[var(--line-light)] bg-white p-5 transition-colors duration-150 hover:border-ink" data-testid={`overview-card-${c.id}`}>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">{c.label}</p>
              <p className="mt-2 font-serif text-4xl">{c.value}</p>
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-10">
        <h2 className="text-sm font-medium">Últimos pedidos (exemplo)</h2>
        <ul className="mt-3 divide-y divide-[var(--line-light)] border border-[var(--line-light)] bg-white">
          {orders.slice(0, 4).map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <span className="font-medium">{o.id}</span>
              <span className="flex-1 text-ink-muted">{o.customerName}</span>
              <span className="text-xs">{orderStatusLabel[o.status]}</span>
              <span>{formatBRL(o.total)}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
