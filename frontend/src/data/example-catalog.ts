import type { Category, OptionKey, OptionValue, Product, Variant } from "../types/catalog";

export const categories: Category[] = [
  {
    slug: "roupas",
    name: "Roupas",
    tagline: "Feminino e masculino para a noite inteira",
    image: "https://images.unsplash.com/photo-1760497925673-d2f56ed4d8f9?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    imageAlt: "Modelo em vestido escuro em estúdio com luz dramática",
    hasGenderFilter: true,
  },
  {
    slug: "acessorios",
    name: "Acessórios",
    tagline: "O detalhe que fecha o look",
    image: "https://images.pexels.com/photos/4355155/pexels-photo-4355155.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Acessórios sobre fundo escuro",
    hasGenderFilter: false,
  },
  {
    slug: "maquiagem",
    name: "Maquiagem",
    tagline: "Tons de cereja, vinho e noite",
    image: "https://images.pexels.com/photos/30263622/pexels-photo-30263622.jpeg?auto=compress&cs=tinysrgb&w=1200",
    imageAlt: "Batom em tom vermelho sobre fundo escuro",
    hasGenderFilter: false,
  },
  {
    slug: "cosmeticos",
    name: "Cosméticos",
    tagline: "Cuidado antes e depois da festa",
    image: "https://images.unsplash.com/photo-1590785069862-343f908422d7?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200",
    imageAlt: "Frasco de cosmético sobre fundo escuro",
    hasGenderFilter: false,
  },
];

const colors: Record<string, string> = {
  Vinho: "#4a0f2b",
  Preto: "#17141a",
  "Off-white": "#f1ebe1",
  Cereja: "#b3122f",
  Rosé: "#d9a3ac",
  Grafite: "#4b4a52",
  Caramelo: "#9a6a3a",
  Dourado: "#c9a44a",
  Prata: "#b8bcc4",
};

const sizesF = ["PP", "P", "M", "G", "GG"];
const sizesM = ["P", "M", "G", "GG", "XG"];

function opt(key: OptionKey, label: string, values: string[], swatches?: Record<string, string>) {
  return { key, label, values: values.map((v): OptionValue => ({ value: v, swatch: swatches?.[v] })) };
}

function combos(id: string, a: { key: OptionKey; values: string[] }, b?: { key: OptionKey; values: string[] }): Variant[] {
  const out: Variant[] = [];
  a.values.forEach((av, i) => {
    const bs = b ? b.values : [""];
    bs.forEach((bv, j) => {
      const selection: Variant["selection"] = { [a.key]: av };
      if (b) selection[b.key] = bv;
      out.push({
        id: `${id}-${i}${j}`,
        sku: `${id.toUpperCase()}-${av}${bv ? "-" + bv.slice(0, 3).toUpperCase() : ""}`,
        selection,
        stock: (i * 3 + j * 5 + 7) % 9,
      });
    });
  });
  return out;
}

type Seed = Omit<Product, "isExample" | "images" | "createdAt"> & { tint: string; createdAt?: string };

function product(seed: Seed): Product {
  const { tint, createdAt, ...rest } = seed;
  return {
    ...rest,
    isExample: true,
    createdAt: createdAt ?? "2026-05-01",
    images: [
      { alt: `${rest.name} — foto provisória`, tint },
      { alt: `${rest.name} — detalhe, foto provisória`, tint },
    ],
  };
}

export const products: Product[] = [
  product({
    id: "rp-01", slug: "vestido-midi-exemplo", name: "Vestido midi (peça de exemplo)", category: "roupas", gender: "feminino", price: 289,
    description: "Vestido midi de alças finas com caimento fluido. Peça de exemplo: o texto e o preço são provisórios e serão substituídos pelo cadastro da loja.",
    options: [opt("tamanho", "Tamanho", sizesF), opt("cor", "Cor", ["Vinho", "Preto", "Cereja"], colors)],
    variants: combos("rp-01", { key: "tamanho", values: sizesF }, { key: "cor", values: ["Vinho", "Preto", "Cereja"] }),
    details: { material: "Viscose (exemplo)", cuidados: "Lavar à mão, secar à sombra (exemplo)" }, tint: "#5a1a35", createdAt: "2026-06-02",
  }),
  product({
    id: "rp-02", slug: "camisa-seda-exemplo", name: "Camisa de cetim (peça de exemplo)", category: "roupas", gender: "feminino", price: 219,
    description: "Camisa de cetim com gola clássica e botões forrados. Peça de exemplo com dados provisórios.",
    options: [opt("tamanho", "Tamanho", sizesF), opt("cor", "Cor", ["Off-white", "Vinho"], colors)],
    variants: combos("rp-02", { key: "tamanho", values: sizesF }, { key: "cor", values: ["Off-white", "Vinho"] }),
    details: { material: "Poliéster acetinado (exemplo)" }, tint: "#e9dccf", createdAt: "2026-06-01",
  }),
  product({
    id: "rp-03", slug: "camisa-preta-masculina-exemplo", name: "Camisa preta masculina (peça de exemplo)", category: "roupas", gender: "masculino", price: 199,
    description: "Camisa de corte reto, manga longa, para noites que começam cedo. Peça de exemplo.",
    options: [opt("tamanho", "Tamanho", sizesM), opt("cor", "Cor", ["Preto", "Grafite", "Vinho"], colors)],
    variants: combos("rp-03", { key: "tamanho", values: sizesM }, { key: "cor", values: ["Preto", "Grafite", "Vinho"] }),
    details: { material: "Algodão (exemplo)" }, tint: "#241f27", createdAt: "2026-05-28",
  }),
  product({
    id: "rp-04", slug: "calca-alfaiataria-masculina-exemplo", name: "Calça de alfaiataria (peça de exemplo)", category: "roupas", gender: "masculino", price: 259,
    description: "Calça de alfaiataria com pregas e barra reta. Peça de exemplo.",
    options: [opt("tamanho", "Tamanho", ["38", "40", "42", "44", "46"]), opt("cor", "Cor", ["Preto", "Caramelo"], colors)],
    variants: combos("rp-04", { key: "tamanho", values: ["38", "40", "42", "44", "46"] }, { key: "cor", values: ["Preto", "Caramelo"] }),
    details: { material: "Lã fria (exemplo)" }, tint: "#8a5f3a", createdAt: "2026-05-20",
  }),
  product({
    id: "rp-05", slug: "blazer-unissex-exemplo", name: "Blazer oversized (peça de exemplo)", category: "roupas", gender: "unissex", price: 349,
    description: "Blazer oversized de ombros marcados, para ela e para ele. Peça de exemplo.",
    options: [opt("tamanho", "Tamanho", ["P", "M", "G", "GG"]), opt("cor", "Cor", ["Vinho", "Preto"], colors)],
    variants: combos("rp-05", { key: "tamanho", values: ["P", "M", "G", "GG"] }, { key: "cor", values: ["Vinho", "Preto"] }),
    details: { material: "Sarja (exemplo)" }, tint: "#3b0a22", createdAt: "2026-06-04",
  }),
  product({
    id: "rp-06", slug: "saia-cetim-exemplo", name: "Saia de cetim (peça de exemplo)", category: "roupas", gender: "feminino", price: 179,
    description: "Saia midi de cetim com fenda discreta. Peça de exemplo.",
    options: [opt("tamanho", "Tamanho", sizesF), opt("cor", "Cor", ["Rosé", "Preto", "Cereja"], colors)],
    variants: combos("rp-06", { key: "tamanho", values: sizesF }, { key: "cor", values: ["Rosé", "Preto", "Cereja"] }),
    details: { material: "Cetim (exemplo)" }, tint: "#c98f9a", createdAt: "2026-05-15",
  }),
  product({
    id: "ac-01", slug: "brinco-cereja-exemplo", name: "Brinco gota (peça de exemplo)", category: "acessorios", price: 89,
    description: "Brinco gota em metal com pedra lapidada. Peça de exemplo.",
    options: [opt("cor", "Acabamento", ["Dourado", "Prata"], colors)],
    variants: combos("ac-01", { key: "cor", values: ["Dourado", "Prata"] }),
    details: { material: "Metal com banho (exemplo)" }, tint: "#b5953f", createdAt: "2026-06-03",
  }),
  product({
    id: "ac-02", slug: "bolsa-mini-exemplo", name: "Bolsa mini de festa (peça de exemplo)", category: "acessorios", price: 239,
    description: "Bolsa mini com alça de corrente. Peça de exemplo.",
    options: [opt("cor", "Cor", ["Vinho", "Preto", "Rosé"], colors)],
    variants: combos("ac-02", { key: "cor", values: ["Vinho", "Preto", "Rosé"] }),
    details: { material: "Material sintético (exemplo)" }, tint: "#4a0f2b", createdAt: "2026-05-30",
  }),
  product({
    id: "ac-03", slug: "cinto-fino-exemplo", name: "Cinto fino (peça de exemplo)", category: "acessorios", price: 119,
    description: "Cinto fino com fivela quadrada. Peça de exemplo, com tamanho porque faz sentido.",
    options: [opt("tamanho", "Tamanho", ["P", "M", "G"]), opt("cor", "Cor", ["Preto", "Caramelo"], colors)],
    variants: combos("ac-03", { key: "tamanho", values: ["P", "M", "G"] }, { key: "cor", values: ["Preto", "Caramelo"] }),
    details: { material: "Couro sintético (exemplo)" }, tint: "#7a4b2a", createdAt: "2026-05-10",
  }),
  product({
    id: "ac-04", slug: "lenco-seda-exemplo", name: "Lenço estampado (peça de exemplo)", category: "acessorios", price: 99,
    description: "Lenço quadrado com estampa de ramos de cerejeira. Peça de exemplo.",
    options: [opt("cor", "Cor", ["Vinho", "Off-white"], colors)],
    variants: combos("ac-04", { key: "cor", values: ["Vinho", "Off-white"] }),
    details: { material: "Cetim (exemplo)" }, tint: "#e3cdd2", createdAt: "2026-05-05",
  }),
  product({
    id: "mq-01", slug: "batom-matte-exemplo", name: "Batom matte (peça de exemplo)", category: "maquiagem", price: 69,
    description: "Batom matte de longa duração. Peça de exemplo. A cor pode variar conforme a tela do seu aparelho.",
    options: [opt("tom", "Tom", ["Cereja Velvet", "Vinho Império", "Rosé Noite", "Nude Quente"], { "Cereja Velvet": "#a8102b", "Vinho Império": "#5e1230", "Rosé Noite": "#b86a78", "Nude Quente": "#c08a76" })],
    variants: combos("mq-01", { key: "tom", values: ["Cereja Velvet", "Vinho Império", "Rosé Noite", "Nude Quente"] }),
    details: { pesoOuVolume: "3,5 g (exemplo)" }, tint: "#a8102b", createdAt: "2026-06-05",
  }),
  product({
    id: "mq-02", slug: "gloss-exemplo", name: "Gloss espelhado (peça de exemplo)", category: "maquiagem", price: 59,
    description: "Gloss de brilho espelhado, sem pegajosidade. Peça de exemplo. A cor pode variar conforme a tela.",
    options: [opt("tom", "Tom", ["Transparente", "Cereja", "Rosé"], { Transparente: "#f3e6e8", Cereja: "#c22a46", Rosé: "#d79aa8" })],
    variants: combos("mq-02", { key: "tom", values: ["Transparente", "Cereja", "Rosé"] }),
    details: { pesoOuVolume: "6 ml (exemplo)" }, tint: "#d79aa8", createdAt: "2026-05-25",
  }),
  product({
    id: "mq-03", slug: "paleta-sombras-exemplo", name: "Paleta de sombras (peça de exemplo)", category: "maquiagem", price: 129,
    description: "Paleta com nove tons entre vinho, bronze e champanhe. Peça de exemplo. A cor pode variar conforme a tela.",
    options: [opt("tom", "Edição", ["Noite", "Dourada"], { Noite: "#4a0f2b", Dourada: "#c9a44a" })],
    variants: combos("mq-03", { key: "tom", values: ["Noite", "Dourada"] }),
    details: { pesoOuVolume: "9 × 1,2 g (exemplo)" }, tint: "#6b2a3f", createdAt: "2026-05-18",
  }),
  product({
    id: "mq-04", slug: "blush-exemplo", name: "Blush cremoso (peça de exemplo)", category: "maquiagem", price: 79,
    description: "Blush cremoso de acabamento natural. Peça de exemplo. A cor pode variar conforme a tela.",
    options: [opt("tom", "Tom", ["Cereja", "Pêssego", "Malva"], { Cereja: "#c43b55", Pêssego: "#e39a7b", Malva: "#b57b93" })],
    variants: combos("mq-04", { key: "tom", values: ["Cereja", "Pêssego", "Malva"] }),
    details: { pesoOuVolume: "5 g (exemplo)" }, tint: "#d98a92", createdAt: "2026-05-12",
  }),
  product({
    id: "cs-01", slug: "serum-facial-exemplo", name: "Sérum facial (peça de exemplo)", category: "cosmeticos", price: 149,
    description: "Sérum facial hidratante para usar antes da maquiagem. Peça de exemplo com dados provisórios.",
    options: [opt("volume", "Volume", ["30 ml", "50 ml"])],
    variants: combos("cs-01", { key: "volume", values: ["30 ml", "50 ml"] }),
    details: { ingredientes: "Água, glicerina, ácido hialurônico (lista de exemplo)", modoDeUso: "Aplicar no rosto limpo, de manhã e à noite (exemplo)", validade: "24 meses após fabricação (exemplo)", lote: "Exemplo" },
    tint: "#efe4da", createdAt: "2026-06-06",
  }),
  product({
    id: "cs-02", slug: "hidratante-corporal-exemplo", name: "Hidratante corporal (peça de exemplo)", category: "cosmeticos", price: 89,
    description: "Hidratante corporal de textura leve e perfume de cereja. Peça de exemplo.",
    options: [opt("volume", "Volume", ["200 ml", "400 ml"])],
    variants: combos("cs-02", { key: "volume", values: ["200 ml", "400 ml"] }),
    details: { ingredientes: "Água, manteiga de karité, óleo de amêndoas (lista de exemplo)", modoDeUso: "Aplicar sobre a pele seca, massageando (exemplo)", validade: "24 meses (exemplo)" },
    tint: "#f0cdd3", createdAt: "2026-05-22",
  }),
  product({
    id: "cs-03", slug: "perfume-exemplo", name: "Perfume de noite (peça de exemplo)", category: "cosmeticos", price: 259,
    description: "Fragrância de cereja negra, âmbar e baunilha. Peça de exemplo.",
    options: [opt("volume", "Volume", ["50 ml", "100 ml"])],
    variants: combos("cs-03", { key: "volume", values: ["50 ml", "100 ml"] }),
    details: { ingredientes: "Álcool, água, fragrância (lista de exemplo)", modoDeUso: "Borrifar no pulso e no pescoço (exemplo)", validade: "36 meses (exemplo)" },
    tint: "#2e0014", createdAt: "2026-05-08",
  }),
  product({
    id: "cs-04", slug: "mascara-capilar-exemplo", name: "Máscara capilar (peça de exemplo)", category: "cosmeticos", price: 79,
    description: "Máscara de nutrição para todos os tipos de cabelo. Peça de exemplo.",
    options: [opt("volume", "Volume", ["250 g"])],
    variants: combos("cs-04", { key: "volume", values: ["250 g"] }),
    details: { ingredientes: "Água, óleo de coco, queratina (lista de exemplo)", modoDeUso: "Aplicar nos fios úmidos e deixar agir por 5 minutos (exemplo)", validade: "24 meses (exemplo)" },
    tint: "#d8c2b2", createdAt: "2026-04-28",
  }),
];
