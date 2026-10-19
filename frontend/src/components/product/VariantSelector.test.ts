import { products } from "../../data/example-catalog";
import { findVariant } from "./VariantSelector";

describe("findVariant", () => {
  const dress = products.find((p) => p.slug === "vestido-midi-exemplo")!;
  const lipstick = products.find((p) => p.slug === "batom-matte-exemplo")!;

  it("exige todas as opções para roupas", () => {
    expect(findVariant(dress, { tamanho: "M" })).toBeUndefined();
    const v = findVariant(dress, { tamanho: "M", cor: "Vinho" });
    expect(v?.selection).toEqual({ tamanho: "M", cor: "Vinho" });
  });

  it("resolve por tom em maquiagem", () => {
    const v = findVariant(lipstick, { tom: "Vinho Império" });
    expect(v?.sku).toContain("MQ-01");
  });

  it("toda combinação de exemplo tem variante e estoque não negativo", () => {
    products.forEach((p) => {
      p.variants.forEach((v) => expect(v.stock).toBeGreaterThanOrEqual(0));
      expect(p.variants.length).toBe(p.options.reduce((n, o) => n * o.values.length, 1));
    });
  });
});
