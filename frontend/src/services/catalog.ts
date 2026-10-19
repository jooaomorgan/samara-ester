import { categories, products } from "../data/example-catalog";
import { exampleOrders, exampleShippingRules } from "../data/example-admin";
import { applyFilters, buildFacets, sortProducts } from "../lib/filters";
import type { CatalogFilters, Category, CategorySlug, Facets, Order, Product, ShippingRule } from "../types/catalog";

/*
 * Camada de dados única da loja. Hoje lê os dados de exemplo em memória;
 * na Fase 2 cada função passa a chamar o backend sem mudar as telas.
 */
const delay = <T,>(value: T): Promise<T> => Promise.resolve(value);

export const catalogService = {
  listCategories: (): Promise<Category[]> => delay(categories),
  getCategory: (slug: string): Promise<Category | undefined> => delay(categories.find((c) => c.slug === slug)),
  listProducts: (filters: CatalogFilters = {}): Promise<Product[]> => delay(applyFilters(products, filters)),
  getProduct: (slug: string): Promise<Product | undefined> => delay(products.find((p) => p.slug === slug)),
  getProductById: (id: string): Promise<Product | undefined> => delay(products.find((p) => p.id === id)),
  listNewArrivals: (limit = 8): Promise<Product[]> => delay(sortProducts(products, "novidades").slice(0, limit)),
  listRelated: (product: Product, limit = 4): Promise<Product[]> =>
    delay(products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit)),
  getFacets: (category?: CategorySlug): Promise<Facets> =>
    delay(buildFacets(category ? products.filter((p) => p.category === category) : products)),
  resolveMany: (ids: string[]): Promise<Product[]> => delay(products.filter((p) => ids.includes(p.id))),
};

export const adminService = {
  listProducts: (): Promise<Product[]> => delay(products),
  listOrders: (): Promise<Order[]> => delay(exampleOrders),
  listShippingRules: (): Promise<ShippingRule[]> => delay(exampleShippingRules),
};

export const isValidCategory = (slug: string | undefined): slug is CategorySlug =>
  categories.some((c) => c.slug === slug);
