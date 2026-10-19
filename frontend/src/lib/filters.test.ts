import { products } from "../data/example-catalog";
import { applyFilters, buildFacets, sortProducts } from "./filters";

describe("applyFilters", () => {
  it("filtra por categoria", () => {
    const list = applyFilters(products, { category: "maquiagem" });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.category === "maquiagem")).toBe(true);
  });

  it("filtra por gênero e mantém unissex", () => {
    const list = applyFilters(products, { category: "roupas", gender: "masculino" });
    expect(list.every((p) => p.gender === "masculino" || p.gender === "unissex")).toBe(true);
    expect(list.some((p) => p.gender === "unissex")).toBe(true);
  });

  it("busca ignora acentos e caixa", () => {
    const list = applyFilters(products, { search: "SERUM" });
    expect(list.some((p) => p.slug === "serum-facial-exemplo")).toBe(true);
  });

  it("filtra por tamanho, cor e preço máximo", () => {
    const list = applyFilters(products, { category: "roupas", tamanho: ["XG"], cor: ["Grafite"], maxPrice: 200 });
    expect(list.map((p) => p.slug)).toEqual(["camisa-preta-masculina-exemplo"]);
  });

  it("retorna vazio quando nada combina", () => {
    expect(applyFilters(products, { search: "zzz-inexistente" })).toEqual([]);
  });
});

describe("sortProducts", () => {
  it("ordena por preço crescente", () => {
    const prices = sortProducts(products, "preco-asc").map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("novidades vem primeiro por createdAt", () => {
    const [first] = sortProducts(products, "novidades");
    expect(first.createdAt).toBe(products.map((p) => p.createdAt).sort().reverse()[0]);
  });
});

describe("buildFacets", () => {
  it("agrega tons só de maquiagem", () => {
    const facets = buildFacets(products.filter((p) => p.category === "maquiagem"));
    expect(facets.tom.length).toBeGreaterThan(0);
    expect(facets.tamanho).toEqual([]);
    expect(facets.priceRange[0]).toBeLessThanOrEqual(facets.priceRange[1]);
  });
});
