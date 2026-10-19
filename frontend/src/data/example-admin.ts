import type { Order, ShippingRule } from "../types/catalog";

export const exampleOrders: Order[] = [
  { id: "CV-0001", customerName: "Cliente de exemplo A", createdAt: "2026-06-05T20:14:00", status: "aguardando_pagamento", total: 358, itemsCount: 2, paymentMethod: "pix" },
  { id: "CV-0002", customerName: "Cliente de exemplo B", createdAt: "2026-06-04T18:40:00", status: "pago", total: 129, itemsCount: 1, paymentMethod: "cartao" },
  { id: "CV-0003", customerName: "Cliente de exemplo C", createdAt: "2026-06-03T21:05:00", status: "enviado", total: 548, itemsCount: 3, paymentMethod: "cartao" },
  { id: "CV-0004", customerName: "Cliente de exemplo D", createdAt: "2026-06-01T15:22:00", status: "entregue", total: 69, itemsCount: 1, paymentMethod: "pix" },
];

export const exampleShippingRules: ShippingRule[] = [
  { id: "sh-01", label: "Capital e região metropolitana", regions: "Cidade da loja (exemplo)", price: 12, deadlineDays: "2 a 3 dias úteis", freeAbove: 299 },
  { id: "sh-02", label: "Sudeste e Sul", regions: "SP, RJ, MG, ES, PR, SC, RS", price: 24, deadlineDays: "4 a 7 dias úteis", freeAbove: 399 },
  { id: "sh-03", label: "Demais regiões", regions: "Norte, Nordeste e Centro-Oeste", price: 34, deadlineDays: "7 a 12 dias úteis" },
];
