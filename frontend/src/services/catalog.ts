import { applyFilters, buildFacets, sortProducts } from "../lib/filters";
import { categories as exampleCategories, products as exampleProducts } from "../data/example-catalog";
import { exampleOrders, exampleShippingRules } from "../data/example-admin";
import type {
  CatalogFilters, Category, CategorySlug, Facets, Order, Product, ProductImage, ShippingRule,
  Variant, VariantOption, OptionKey,
} from "../types/catalog";

const API_URL = (process.env.REACT_APP_API_URL || "").trim().replace(/\/+$/, "").replace(/\/api$/, "");
const API_BASE = API_URL ? API_URL + "/api" : "";
const CACHE_PREFIX = "cherry-vibes:store-cache:";

export type StoreDataMode = "fresh" | "stale" | "demo";
export interface StoreDataStatus {
  mode: StoreDataMode;
  message: string;
}

const listeners = new Set<() => void>();
let dataStatus: StoreDataStatus = API_URL
  ? { mode: "fresh", message: "" }
  : { mode: "demo", message: "Vitrine de demonstração: configure REACT_APP_API_URL para usar os dados da loja." };

function setDataStatus(next: StoreDataStatus) {
  if (dataStatus.mode === next.mode && dataStatus.message === next.message) return;
  dataStatus = next;
  listeners.forEach((listener) => listener());
}

export const subscribeStoreDataStatus = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getStoreDataStatus = () => dataStatus;
export const isStoreApiConfigured = () => Boolean(API_URL);

function readCache<T>(key: string): T | undefined {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return undefined;
    return JSON.parse(raw).value as T;
  } catch {
    return undefined;
  }
}

function writeCache<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // Private browsing and storage limits should not prevent browsing or checkout.
  }
}

async function requestJson<T>(key: string, path: string, fallback: () => T): Promise<T> {
  const cached = readCache<T>(key);
  if (!API_BASE) {
    setDataStatus({ mode: "demo", message: "Vitrine de demonstração: configure REACT_APP_API_URL para conectar a loja." });
    return cached ?? fallback();
  }

  try {
    const response = await fetch(API_BASE + path, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      const error = new Error("A API respondeu " + response.status) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }
    const value = (await response.json()) as T;
    writeCache(key, value);
    setDataStatus({ mode: "fresh", message: "" });
    return value;
  } catch {
    if (cached !== undefined) {
      setDataStatus({ mode: "stale", message: "Conexão instável. Exibindo a última versão salva; confirme os dados ao finalizar." });
      return cached;
    }
    setDataStatus({ mode: "demo", message: "Não foi possível conectar à loja. Produtos de demonstração estão sendo exibidos." });
    return fallback();
  }
}

export interface StoreBanner {
  id: string;
  imagem: string;
  titulo: string;
  texto: string;
  texto_botao: string;
  link_botao: string;
  ordem: number;
  ativo: boolean;
}

export interface StoreSettings {
  loja: {
    nome: string;
    slogan: string;
    logo: string;
    whatsapp: string;
    email: string;
    endereco: string;
    horario: string;
    redes_sociais: Record<string, string>;
  };
  destaque: "vinho" | "cereja" | "rosa";
  home: {
    banners: StoreBanner[];
    produtos_destaque: string[];
    categorias_destaque: string[];
    faixa_aviso: string;
    titulo_novidades: string;
  };
  paginas: {
    sobre: string;
    entrega_trocas: string;
    contato: string;
    politicas: string;
  };
  checkout: {
    formas_pagamento: Array<"pix" | "cartao" | "whatsapp">;
    mensagem_pagamento: string;
    chave_pix?: string;
    regras_entrega: Array<{
      id: string;
      nome: string;
      regioes: string;
      preco: number;
      prazo: string;
      gratis_acima?: number | null;
    }>;
    mensagem_entrega: string;
    retirada: string;
  };
  loja_aberta: boolean;
  vendas_pausadas: boolean;
  mensagem_pausa: string;
  estoque_esgotado: "mostrar" | "ocultar";
}

export interface StoreOrderPayload {
  cliente_nome: string;
  cliente_telefone: string;
  cliente_email?: string;
  forma_pagamento: "pix" | "cartao" | "whatsapp";
  observacoes: string;
  entrega_id?: string;
  endereco_entrega?: string;
  itens: Array<{
    produto_id: string;
    quantidade: number;
    tamanho?: string;
    cor?: string;
    preco_esperado: number;
  }>;
}

export interface StoreOrderResult {
  numero: number;
  total: number;
  frete: number;
}

const emptySettings = (): StoreSettings => ({
  loja: { nome: "", slogan: "", logo: "", whatsapp: "", email: "", endereco: "", horario: "", redes_sociais: {} },
  destaque: "vinho",
  home: { banners: [], produtos_destaque: [], categorias_destaque: [], faixa_aviso: "", titulo_novidades: "Novidades" },
  paginas: { sobre: "", entrega_trocas: "", contato: "", politicas: "" },
  checkout: { formas_pagamento: [], mensagem_pagamento: "", regras_entrega: [], mensagem_entrega: "", retirada: "" },
  loja_aberta: false,
  vendas_pausadas: false,
  mensagem_pausa: "",
  estoque_esgotado: "mostrar",
});

export function resolveStoreImage(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https:\/\//i.test(path)) return path;
  if (!API_BASE) return path;
  const safePath = path.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  return API_BASE + "/files/" + safePath;
}

function mapCategory(raw: any): Category {
  return {
    slug: String(raw.slug || "") as CategorySlug,
    name: String(raw.nome || "Categoria"),
    tagline: String(raw.descricao || ""),
    imageAlt: String(raw.nome || "Categoria"),
    hasGenderFilter: false,
  };
}

function option(key: OptionKey, label: string, values: Array<{ value: string; swatch?: string }>): VariantOption | null {
  return values.length ? { key, label, values } : null;
}

export function mapStoreProduct(raw: any): Product {
  const id = String(raw.id);
  const name = String(raw.nome || "Produto");
  const sizes = Array.isArray(raw.tamanhos) ? raw.tamanhos.map(String) : [];
  const colors = Array.isArray(raw.cores)
    ? raw.cores.map((color: any) => ({ value: String(color.nome || ""), swatch: String(color.hex || "") })).filter((color: any) => color.value)
    : [];
  const options = [
    option("tamanho", "Tamanho", sizes.map((value: string) => ({ value }))),
    option("cor", "Cor", colors),
  ].filter((value): value is VariantOption => value !== null);
  const selections: Array<Partial<Record<OptionKey, string>>> = options.reduce(
    (all, current) => all.flatMap((selection) => current.values.map((value) => ({ ...selection, [current.key]: value.value }))),
    [{}] as Array<Partial<Record<OptionKey, string>>>,
  );
  const stock = Math.max(0, Number(raw.estoque || 0));
  const variants: Variant[] = selections.map((selection, index) => ({
    id: id + "-" + index,
    sku: String(raw.sku || raw.codigo || id),
    selection,
    stock,
  }));
  const images: ProductImage[] = (Array.isArray(raw.imagens) ? raw.imagens : []).map((path: string) => ({
    src: resolveStoreImage(path),
    alt: name,
    tint: "#EAD5D3",
  }));

  return {
    id,
    slug: String(raw.slug || id),
    name,
    category: String(raw.categoria?.slug || "") as CategorySlug,
    price: Number(raw.preco_final ?? raw.preco_promocional ?? raw.preco ?? 0),
    description: String(raw.descricao || ""),
    images,
    options,
    variants,
    details: {},
    isExample: Boolean(raw.exemplo),
    createdAt: String(raw.criado_em || raw.atualizado_em || ""),
  };
}

const exampleProductsBySlug = new Map(exampleProducts.map((product) => [product.slug, product]));
const exampleProductsById = new Map(exampleProducts.map((product) => [product.id, product]));

async function storeProducts(): Promise<Product[]> {
  const rows = await requestJson<any[]>("products", "/store/products?limit=200", () => []);
  const mapped = rows.map(mapStoreProduct);
  const realProducts = mapped.filter((product) => !product.isExample);
  if (realProducts.length) return realProducts;
  return mapped.length ? mapped : exampleProducts;
}

async function storeCategories(): Promise<Category[]> {
  const rows = await requestJson<any[]>("categories", "/store/categories", () => []);
  const mapped = rows.map(mapCategory);
  return mapped.length ? mapped : exampleCategories;
}

async function storeSettings(): Promise<StoreSettings> {
  return requestJson<StoreSettings>("settings", "/store/settings", emptySettings);
}

function errorMessage(response: Response, body: any): string {
  if (typeof body?.detail === "string") return body.detail;
  if (Array.isArray(body?.detail)) return body.detail.map((item: any) => item?.msg).filter(Boolean).join(" ");
  return response.status === 429
    ? "Muitos pedidos em sequência. Aguarde alguns minutos e tente novamente."
    : "Não foi possível enviar o pedido. Confira seus dados e tente novamente.";
}

export const isValidCategory = (slug: string | undefined): slug is CategorySlug => Boolean(slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug));

export const catalogService = {
  listCategories: async (): Promise<Category[]> => storeCategories(),
  getCategory: async (slug: string): Promise<Category | undefined> => (await storeCategories()).find((category) => category.slug === slug),
  listProducts: async (filters: CatalogFilters = {}): Promise<Product[]> => applyFilters(await storeProducts(), filters),
  getProduct: async (slug: string): Promise<Product | undefined> => {
    if (API_BASE) {
      try {
        const response = await fetch(API_BASE + "/store/products/" + encodeURIComponent(slug), { headers: { Accept: "application/json" } });
        if (response.ok) {
          const raw = await response.json();
          const product = mapStoreProduct(raw);
          writeCache("product:" + slug, raw);
          setDataStatus({ mode: "fresh", message: "" });
          return product;
        }
        if (response.status !== 404) throw new Error("A API respondeu " + response.status);
        setDataStatus({ mode: "fresh", message: "" });
      } catch {
        const cached = readCache<any>("product:" + slug);
        if (cached) {
          setDataStatus({ mode: "stale", message: "Conexão instável. Exibindo a última versão salva." });
          return mapStoreProduct(cached);
        }
        setDataStatus({ mode: "demo", message: "Não foi possível conectar à loja. Exibindo o catálogo de demonstração." });
      }
    } else {
      setDataStatus({ mode: "demo", message: "Vitrine de demonstração: configure REACT_APP_API_URL para conectar a loja." });
    }
    return exampleProductsBySlug.get(slug);
  },
  getProductById: async (id: string): Promise<Product | undefined> => (await storeProducts()).find((product) => product.id === id) || exampleProductsById.get(id),
  listNewArrivals: async (limit = 8): Promise<Product[]> => sortProducts(await storeProducts(), "novidades").slice(0, limit),
  listRelated: async (product: Product, limit = 4): Promise<Product[]> =>
    (await storeProducts()).filter((item) => item.category === product.category && item.id !== product.id).slice(0, limit),
  getFacets: async (category?: CategorySlug): Promise<Facets> =>
    buildFacets(category ? (await storeProducts()).filter((product) => product.category === category) : await storeProducts()),
  resolveMany: async (ids: string[]): Promise<Product[]> => (await storeProducts()).filter((product) => ids.includes(product.id)),
  getStoreSettings: storeSettings,
};

export const adminService = {
  listProducts: storeProducts,
  listOrders: (): Promise<Order[]> => Promise.resolve(exampleOrders),
  listShippingRules: async (): Promise<ShippingRule[]> => {
    const settings = await storeSettings();
    if (!settings.checkout.regras_entrega.length) return API_URL ? [] : exampleShippingRules;
    return settings.checkout.regras_entrega.map((rule) => ({
      id: rule.id,
      label: rule.nome,
      regions: rule.regioes,
      price: rule.preco,
      deadlineDays: rule.prazo,
      freeAbove: rule.gratis_acima ?? undefined,
    }));
  },
};

export async function createStoreOrder(payload: StoreOrderPayload): Promise<StoreOrderResult> {
  if (!API_BASE) throw new Error("O checkout será liberado quando a API da loja estiver configurada.");
  try {
    const response = await fetch(API_BASE + "/store/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(errorMessage(response, body));
    return body as StoreOrderResult;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Sem conexão com o servidor. Tente novamente.");
  }
}

