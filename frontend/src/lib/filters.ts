import type { CatalogFilters, Facets, OptionValue, Product } from "../types/catalog";

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function hasOption(p: Product, key: "tamanho" | "cor" | "tom", wanted?: string[]) {
  if (!wanted?.length) return true;
  const opt = p.options.find((o) => o.key === key);
  return !!opt && opt.values.some((v) => wanted.includes(v.value));
}

export function applyFilters(all: Product[], f: CatalogFilters): Product[] {
  const q = f.search ? normalize(f.search) : "";
  const list = all.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.gender && p.gender !== f.gender && p.gender !== "unissex") return false;
    if (q && !normalize(`${p.name} ${p.description} ${p.category}`).includes(q)) return false;
    if (f.minPrice !== undefined && p.price < f.minPrice) return false;
    if (f.maxPrice !== undefined && p.price > f.maxPrice) return false;
    return hasOption(p, "tamanho", f.tamanho) && hasOption(p, "cor", f.cor) && hasOption(p, "tom", f.tom);
  });
  return sortProducts(list, f.sort ?? "novidades");
}

export function sortProducts(list: Product[], sort: CatalogFilters["sort"]): Product[] {
  const copy = [...list];
  switch (sort) {
    case "preco-asc": return copy.sort((a, b) => a.price - b.price);
    case "preco-desc": return copy.sort((a, b) => b.price - a.price);
    case "nome": return copy.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    default: return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

export function buildFacets(list: Product[]): Facets {
  const collect = (key: "tamanho" | "cor" | "tom") => {
    const map = new Map<string, OptionValue>();
    list.forEach((p) => p.options.filter((o) => o.key === key).forEach((o) => o.values.forEach((v) => map.set(v.value, v))));
    return [...map.values()];
  };
  const prices = list.map((p) => p.price);
  return {
    tamanho: collect("tamanho"),
    cor: collect("cor"),
    tom: collect("tom"),
    priceRange: prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 0],
  };
}
