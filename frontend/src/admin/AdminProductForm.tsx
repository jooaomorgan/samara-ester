import { useQuery } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { catalogService } from "../services/catalog";
import type { CategorySlug } from "../types/catalog";
import { AdminHeader } from "./AdminLayout";
import { phase2 } from "./AdminProducts";

const categories: { value: CategorySlug; label: string }[] = [
  { value: "roupas", label: "Roupas" }, { value: "acessorios", label: "Acessórios" }, { value: "maquiagem", label: "Maquiagem" }, { value: "cosmeticos", label: "Cosméticos" },
];

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-ink-muted">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
    </div>
  );
}

export default function AdminProductForm() {
  const { id } = useParams();
  const { data: existing } = useQuery({ queryKey: ["admin-product", id], queryFn: () => catalogService.getProductById(id!), enabled: !!id });
  const [category, setCategory] = useState<CategorySlug>("roupas");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setCategory(existing.category);
    setName(existing.name);
    setPrice(String(existing.price));
    setDescription(existing.description);
  }, [existing]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    phase2("Salvar produto");
  };

  const input = "field min-h-10";

  return (
    <>
      <AdminHeader title={id ? "Editar produto" : "Novo produto"} description="Os campos mudam conforme a categoria. Nada é gravado nesta fase." action={<Link to="/admin/produtos" className="link-underline text-xs uppercase tracking-[0.14em]" data-testid="admin-back-to-products">Voltar à lista</Link>} />
      <form onSubmit={onSubmit} className="grid max-w-4xl gap-8 lg:grid-cols-[1fr_300px]" data-testid="admin-product-form">
        <div className="space-y-6">
          <section className="space-y-4 border border-[var(--line-light)] bg-white p-5">
            <h2 className="text-sm font-medium">Informações básicas</h2>
            <Field id="p-cat" label="Categoria">
              <select id="p-cat" value={category} onChange={(e) => setCategory(e.target.value as CategorySlug)} className={input} data-testid="admin-form-category">
                {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field id="p-name" label="Nome"><input id="p-name" value={name} onChange={(e) => setName(e.target.value)} required className={input} data-testid="admin-form-name" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="p-price" label="Preço (R$)"><input id="p-price" type="number" min="0" step="0.01" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} required className={input} data-testid="admin-form-price" /></Field>
              {category === "roupas" && (
                <Field id="p-gender" label="Para quem">
                  <select id="p-gender" className={input} defaultValue={existing?.gender ?? "feminino"} data-testid="admin-form-gender"><option value="feminino">Feminino</option><option value="masculino">Masculino</option><option value="unissex">Unissex</option></select>
                </Field>
              )}
            </div>
            <Field id="p-desc" label="Descrição"><textarea id="p-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="field py-2" data-testid="admin-form-description" /></Field>
          </section>

          <section className="space-y-4 border border-[var(--line-light)] bg-white p-5" data-testid={`admin-form-section-${category}`}>
            <h2 className="text-sm font-medium">Variações — {categories.find((c) => c.value === category)?.label}</h2>
            {category === "roupas" && (
              <>
                <Field id="p-sizes" label="Tamanhos" hint="Separe por vírgula. Ex.: PP, P, M, G, GG"><input id="p-sizes" className={input} defaultValue="PP, P, M, G, GG" data-testid="admin-form-sizes" /></Field>
                <Field id="p-colors" label="Cores" hint="Ex.: Vinho, Preto, Cereja"><input id="p-colors" className={input} data-testid="admin-form-colors" /></Field>
                <p className="text-xs text-ink-muted">O estoque é informado por combinação de tamanho e cor na tela de Estoque.</p>
              </>
            )}
            {category === "acessorios" && (
              <>
                <Field id="p-material" label="Cor ou material" hint="Ex.: Dourado, Prata, Couro sintético"><input id="p-material" className={input} data-testid="admin-form-material" /></Field>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-[var(--cherry)]" data-testid="admin-form-has-size" /> Este acessório tem tamanho (ex.: cinto, anel)</label>
              </>
            )}
            {category === "maquiagem" && (
              <>
                <Field id="p-shades" label="Tons" hint="Um por linha: nome e cor em hex. Ex.: Cereja Velvet #A8102B"><textarea id="p-shades" rows={4} className="field py-2" data-testid="admin-form-shades" /></Field>
                <Field id="p-weight" label="Volume ou peso" hint="Ex.: 3,5 g"><input id="p-weight" className={input} data-testid="admin-form-weight" /></Field>
                <p className="text-xs text-ink-muted">A loja mostra automaticamente o aviso “a cor pode variar conforme a tela”.</p>
              </>
            )}
            {category === "cosmeticos" && (
              <>
                <Field id="p-volume" label="Volumes" hint="Ex.: 30 ml, 50 ml"><input id="p-volume" className={input} data-testid="admin-form-volume" /></Field>
                <Field id="p-ingredients" label="Ingredientes"><textarea id="p-ingredients" rows={3} className="field py-2" data-testid="admin-form-ingredients" /></Field>
                <Field id="p-usage" label="Modo de uso"><textarea id="p-usage" rows={2} className="field py-2" data-testid="admin-form-usage" /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="p-validity" label="Validade"><input id="p-validity" className={input} data-testid="admin-form-validity" /></Field>
                  <Field id="p-batch" label="Lote"><input id="p-batch" className={input} data-testid="admin-form-batch" /></Field>
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border border-[var(--line-light)] bg-white p-5">
            <h2 className="text-sm font-medium">Fotos</h2>
            <label className="mt-3 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[var(--line-light)] p-4 text-center text-xs text-ink-muted hover:border-ink">
              <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
              Escolher fotos (proporção 4:5 recomendada)
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} data-testid="admin-form-photos" />
            </label>
            {files.length > 0 && <ul className="mt-3 space-y-1 text-xs" data-testid="admin-form-photo-list">{files.map((f) => <li key={f}>{f}</li>)}</ul>}
            <p className="mt-3 text-xs text-ink-muted">O envio para o armazenamento de fotos será ativado na Fase 2.</p>
          </section>
          <div className="space-y-2">
            <button type="submit" className="btn btn-cherry w-full" data-testid="admin-form-save">Salvar produto</button>
            <p className="text-center text-[0.68rem] uppercase tracking-[0.14em] text-ink-muted">Salvamento ativado na Fase 2</p>
            {saved && <p role="status" className="border-l-2 border-cherry pl-3 text-xs text-ink-muted" data-testid="admin-form-not-saved">Nada foi gravado. Quando o banco de dados for ligado, este botão salvará de verdade.</p>}
          </div>
        </aside>
      </form>
    </>
  );
}
