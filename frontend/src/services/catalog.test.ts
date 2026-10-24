import { catalogService, isValidCategory, mapStoreProduct } from "./catalog";

describe("mapeamento da API pública", () => {
  it("usa preço promocional, estoque, variações e imagem retornados pelo painel", () => {
    const product = mapStoreProduct({
      id: "66f100000000000000000001",
      slug: "batom-teste",
      nome: "Batom de teste",
      descricao: "Produto publicado pela administradora.",
      categoria: { slug: "maquiagem", nome: "Maquiagem" },
      preco: 52.5,
      preco_promocional: 45,
      preco_final: 45,
      estoque: 5,
      tamanhos: [],
      cores: [{ nome: "Vinho", hex: "#4A0F2B" }, { nome: "Cereja", hex: "#B3122F" }],
      imagens: ["https://cdn.example.test/batom.jpg"],
      exemplo: false,
    });

    expect(product).toMatchObject({ id: "66f100000000000000000001", name: "Batom de teste", category: "maquiagem", price: 45, isExample: false });
    expect(product.images[0].src).toBe("https://cdn.example.test/batom.jpg");
    expect(product.variants).toHaveLength(2);
    expect(product.variants.every((variant) => variant.stock === 5)).toBe(true);
  });
});

describe("categoria de calçados em preparação", () => {
  it("é navegável e não anuncia produtos de exemplo como disponíveis", async () => {
    expect(isValidCategory("calcados")).toBe(true);
    expect(await catalogService.getCategory("calcados")).toMatchObject({
      name: "Calçados",
      tagline: expect.stringContaining("em preparação"),
    });
    expect(await catalogService.listProducts({ category: "calcados" })).toEqual([]);
  });
});
