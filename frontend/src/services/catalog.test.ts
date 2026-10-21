import { catalogService, isValidCategory } from "./catalog";

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
