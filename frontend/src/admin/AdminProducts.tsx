import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { adminService } from "../services/catalog";
import { formatBRL } from "../lib/format";
import { ExampleBadge } from "../components/brand/ProductImage";
import { AdminHeader, Phase2Button } from "./AdminLayout";

const categoryName: Record<string, string> = { roupas: "Roupas", acessorios: "Acessórios", maquiagem: "Maquiagem", cosmeticos: "Cosméticos", calcados: "Calçados" };

export const phase2 = (what: string) => toast.info(`${what} será ativado na Fase 2.`, { description: "Nada foi gravado. Esta tela mostra apenas a interface." });

export default function AdminProducts() {
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: adminService.listProducts });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const list = products.filter((p) => (!cat || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <AdminHeader title="Produtos" description={`${products.length} produtos de exemplo. O cadastro real será salvo no banco na Fase 2.`} action={<Link to="/admin/produtos/novo" className="btn btn-cherry min-h-10 px-4 text-[0.7rem]" data-testid="admin-new-product-link">Novo produto</Link>} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome" aria-label="Buscar produto" className="field min-h-10 sm:max-w-xs" data-testid="admin-product-search" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Filtrar por categoria" className="field min-h-10 sm:w-48" data-testid="admin-product-category-filter">
          <option value="">Todas as categorias</option>
          {Object.entries(categoryName).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto border border-[var(--line-light)] bg-white">
        <table className="w-full text-sm" data-testid="admin-products-table">
          <thead className="bg-cream-2 text-left text-xs uppercase tracking-[0.12em] text-ink-muted">
            <tr><th className="px-4 py-3">Produto</th><th className="px-4 py-3">Categoria</th><th className="px-4 py-3">Preço</th><th className="px-4 py-3">Variações</th><th className="px-4 py-3">Estoque</th><th className="px-4 py-3"><span className="sr-only">Ações</span></th></tr>
          </thead>
          <tbody className="divide-y divide-[var(--line-light)]">
            {list.map((p) => (
              <tr key={p.id} data-testid={`admin-product-row-${p.id}`}>
                <td className="px-4 py-3"><span className="flex items-center gap-2">{p.name}{p.isExample && <ExampleBadge />}</span></td>
                <td className="px-4 py-3 text-ink-muted">{categoryName[p.category] || p.category}</td>
                <td className="px-4 py-3">{formatBRL(p.price)}</td>
                <td className="px-4 py-3">{p.variants.length}</td>
                <td className="px-4 py-3">{p.variants.reduce((n, v) => n + v.stock, 0)}</td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/produtos/${p.id}`} className="link-underline text-xs uppercase tracking-[0.14em]" data-testid={`admin-edit-${p.id}`}>Editar</Link>
                  <Phase2Button label="Excluir" testId={`admin-delete-${p.id}`} onClick={() => phase2("Excluir produto")} />
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-muted" data-testid="admin-products-empty">Nenhum produto com esse filtro.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

