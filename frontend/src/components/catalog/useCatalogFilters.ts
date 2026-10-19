import { useSearchParams } from "react-router-dom";
import type { CatalogFilters, Gender, SortKey } from "../../types/catalog";

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : undefined);
const num = (v: string | null) => (v !== null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined);
const genders: Gender[] = ["feminino", "masculino", "unissex"];
const sorts: SortKey[] = ["novidades", "preco-asc", "preco-desc", "nome"];

export function useCatalogFilters() {
  const [params, setParams] = useSearchParams();
  const gender = params.get("genero");
  const sort = params.get("ordem");

  const filters: CatalogFilters = {
    search: params.get("q") ?? undefined,
    gender: genders.includes(gender as Gender) ? (gender as Gender) : undefined,
    tamanho: list(params.get("tamanho")),
    cor: list(params.get("cor")),
    tom: list(params.get("tom")),
    minPrice: num(params.get("min")),
    maxPrice: num(params.get("max")),
    sort: sorts.includes(sort as SortKey) ? (sort as SortKey) : undefined,
  };

  const set = (key: string, value: string | string[] | number | undefined) => {
    const next = new URLSearchParams(params);
    const v = Array.isArray(value) ? value.join(",") : value;
    if (v === undefined || v === "" ) next.delete(key); else next.set(key, String(v));
    setParams(next, { replace: true });
  };

  const toggleIn = (key: "tamanho" | "cor" | "tom", value: string) => {
    const current = filters[key] ?? [];
    set(key, current.includes(value) ? current.filter((x) => x !== value) : [...current, value]);
  };

  const clear = () => {
    const next = new URLSearchParams();
    const q = params.get("q");
    if (q) next.set("q", q);
    setParams(next, { replace: true });
  };

  const activeCount = [filters.gender, filters.minPrice, filters.maxPrice].filter((x) => x !== undefined).length + (filters.tamanho?.length ?? 0) + (filters.cor?.length ?? 0) + (filters.tom?.length ?? 0);

  return { filters, set, toggleIn, clear, activeCount };
}
