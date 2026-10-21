import { formatBRL } from "../../lib/format";
import type { Facets } from "../../types/catalog";
import { useCatalogFilters } from "./useCatalogFilters";

interface FilterPanelProps {
  facets: Facets;
  showGender: boolean;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-[var(--line-light)] py-5">
      <legend className="eyebrow pr-3 text-ink-muted">{title}</legend>
      <div className="mt-3">{children}</div>
    </fieldset>
  );
}

export function FilterPanel({ facets, showGender }: FilterPanelProps) {
  const { filters, set, toggleIn, clear, activeCount } = useCatalogFilters();
  const [min, max] = facets.priceRange;
  const priceSteps = [max * 0.25, max * 0.5, max * 0.75].map((v) => Math.ceil(v / 10) * 10).filter((v) => v > min && v < max);

  return (
    <div data-testid="filter-panel">
      {showGender && (
        <Group title="Para quem">
          <div className="flex flex-wrap gap-2">
            {[["", "Todos"], ["feminino", "Feminino"], ["masculino", "Masculino"]].map(([value, label]) => {
              const active = (filters.gender ?? "") === value;
              return (
                <button key={value} type="button" onClick={() => set("genero", value || undefined)} aria-pressed={active} data-testid={`filter-gender-${value || "todos"}`} className={`min-h-11 border px-4 text-xs uppercase tracking-[0.14em] transition-colors duration-200 ${active ? "border-ink bg-ink text-cream" : "border-[var(--line-light)] text-ink"}`}>
                  {label}
                </button>
              );
            })}
          </div>
        </Group>
      )}

      {facets.tamanho.length > 0 && (
        <Group title="Tamanho">
          <div className="flex flex-wrap gap-2">
            {facets.tamanho.map((t) => {
              const active = filters.tamanho?.includes(t.value);
              return (
                <button key={t.value} type="button" onClick={() => toggleIn("tamanho", t.value)} aria-pressed={active} data-testid={`filter-size-${t.value}`} className={`grid h-11 min-w-11 place-items-center border px-2 text-xs transition-colors duration-200 ${active ? "border-ink bg-ink text-cream" : "border-[var(--line-light)]"}`}>
                  {t.value}
                </button>
              );
            })}
          </div>
        </Group>
      )}

      {facets.cor.length > 0 && (
        <Group title="Cor">
          <ul className="flex flex-wrap gap-2">
            {facets.cor.map((c) => {
              const active = filters.cor?.includes(c.value);
              return (
                <li key={c.value}>
                  <button type="button" onClick={() => toggleIn("cor", c.value)} aria-pressed={active} aria-label={c.value} title={c.value} data-testid={`filter-color-${c.value}`} className={`grid h-11 w-11 place-items-center rounded-full border transition-colors duration-200 ${active ? "border-ink" : "border-transparent"}`}>
                    <span className="h-6 w-6 rounded-full border border-[var(--line-light)]" style={{ background: c.swatch }} />
                  </button>
                </li>
              );
            })}
          </ul>
        </Group>
      )}

      {facets.tom.length > 0 && (
        <Group title="Tom">
          <ul className="space-y-1">
            {facets.tom.map((t) => {
              const active = filters.tom?.includes(t.value) ?? false;
              return (
                <li key={t.value}>
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                    <input type="checkbox" checked={active} onChange={() => toggleIn("tom", t.value)} className="h-4 w-4 accent-[var(--cherry)]" data-testid={`filter-shade-${t.value}`} />
                    <span className="h-4 w-4 rounded-full border border-[var(--line-light)]" style={{ background: t.swatch }} aria-hidden="true" />
                    {t.value}
                  </label>
                </li>
              );
            })}
          </ul>
        </Group>
      )}

      <Group title="Preço">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => set("max", undefined)} aria-pressed={filters.maxPrice === undefined} data-testid="filter-price-all" className={`min-h-11 border px-3 text-xs transition-colors duration-200 ${filters.maxPrice === undefined ? "border-ink bg-ink text-cream" : "border-[var(--line-light)]"}`}>Todos</button>
          {priceSteps.map((v) => (
            <button key={v} type="button" onClick={() => set("max", v)} aria-pressed={filters.maxPrice === v} data-testid={`filter-price-${v}`} className={`min-h-11 border px-3 text-xs transition-colors duration-200 ${filters.maxPrice === v ? "border-ink bg-ink text-cream" : "border-[var(--line-light)]"}`}>
              até {formatBRL(v)}
            </button>
          ))}
        </div>
      </Group>

      {activeCount > 0 && (
        <button type="button" onClick={clear} className="link-underline mt-2 text-xs uppercase tracking-[0.16em] text-cherry" data-testid="filter-clear-button">
          Limpar filtros ({activeCount})
        </button>
      )}
    </div>
  );
}

export function SortSelect() {
  const { filters, set } = useCatalogFilters();
  return (
    <label className="flex items-center gap-2 text-xs text-ink-muted">
      <span className="sr-only sm:not-sr-only">Ordenar</span>
      <select value={filters.sort ?? "novidades"} onChange={(e) => set("ordem", e.target.value === "novidades" ? undefined : e.target.value)} className="field min-h-11 w-auto bg-transparent text-xs" data-testid="sort-select">
        <option value="novidades">Novidades</option>
        <option value="preco-asc">Menor preço</option>
        <option value="preco-desc">Maior preço</option>
        <option value="nome">Nome (A–Z)</option>
      </select>
    </label>
  );
}
