export type CategorySlug = "roupas" | "acessorios" | "maquiagem" | "cosmeticos";
export type Gender = "feminino" | "masculino" | "unissex";
export type OptionKey = "tamanho" | "cor" | "tom" | "volume";
export type SortKey = "novidades" | "preco-asc" | "preco-desc" | "nome";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
  imageAlt: string;
  hasGenderFilter: boolean;
}

export interface OptionValue {
  value: string;
  swatch?: string;
}

export interface VariantOption {
  key: OptionKey;
  label: string;
  values: OptionValue[];
}

export interface Variant {
  id: string;
  sku: string;
  selection: Partial<Record<OptionKey, string>>;
  stock: number;
}

export interface ProductImage {
  src?: string;
  alt: string;
  tint: string;
}

export interface ProductDetails {
  material?: string;
  ingredientes?: string;
  modoDeUso?: string;
  validade?: string;
  lote?: string;
  pesoOuVolume?: string;
  cuidados?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  gender?: Gender;
  price: number;
  description: string;
  images: ProductImage[];
  options: VariantOption[];
  variants: Variant[];
  details: ProductDetails;
  isExample: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
  variant: Variant;
}

export interface CatalogFilters {
  category?: CategorySlug;
  search?: string;
  gender?: Gender;
  tamanho?: string[];
  cor?: string[];
  tom?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortKey;
}

export interface Facets {
  tamanho: OptionValue[];
  cor: OptionValue[];
  tom: OptionValue[];
  priceRange: [number, number];
}

export type OrderStatus = "aguardando_pagamento" | "pago" | "em_separacao" | "enviado" | "entregue" | "cancelado";

export interface Order {
  id: string;
  customerName: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  itemsCount: number;
  paymentMethod: "pix" | "cartao";
}

export interface ShippingRule {
  id: string;
  label: string;
  regions: string;
  price: number;
  deadlineDays: string;
  freeAbove?: number;
}
