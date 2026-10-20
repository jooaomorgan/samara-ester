# Cherry Vibes — Loja virtual (Fase 1: design e front-end)

Vitrine completa em React + TypeScript para a Cherry Vibes (moda feminina e masculina, acessórios, maquiagem e cosméticos). Nesta fase tudo roda no navegador com dados de exemplo; banco de dados, login da dona e pagamento (Mercado Pago) entram na Fase 2.

## Requisitos

- Node 20+ e Yarn 1.x (nunca use npm neste projeto).
- Python 3.11+ apenas para o backend FastAPI de template (não é usado pela vitrine na Fase 1).

## Instalação e comandos

```bash
cd frontend
yarn install
yarn start        # dev server em http://localhost:3000
yarn build        # build de produção (roda o lint do CRA junto)
yarn test         # testes unitários (Jest)
npx tsc --noEmit  # checagem de tipos
```

## Estrutura de pastas (frontend/src)

```
types/catalog.ts            tipos explícitos: Product, Variant, Category, CartItem, Order, ShippingRule, filtros
data/example-catalog.ts     produtos e categorias de exemplo (marcados isExample: true)
data/example-admin.ts       pedidos e regras de frete de exemplo
services/catalog.ts         CAMADA DE DADOS ÚNICA (catalogService, adminService) — trocar aqui na Fase 2
lib/filters.ts              busca, filtros, ordenação e facetas (puro, testado)
lib/format.ts               moeda BRL, datas, rótulos
store/cart.tsx, favorites.tsx  estado real em localStorage (Context)
hooks/                      usePersistedState, useCartLines, useSmoothScroll (Lenis)
components/brand/           Logo (marca provisória), CherryBranch, CherryIcon, ProductImage, ExampleBadge
components/layout/          Header, Footer, CartDrawer, StoreLayout, PageIntro
components/catalog/         ProductCard/Grid, FilterPanel, useCatalogFilters (filtros na URL)
components/product/         VariantSelector (adapta por categoria), ProductDetails
components/home/            Hero, CategoryDoors, Marquee, HowToBuy
pages/                      Home, Categoria, Produto, Busca, Favoritos, Carrinho, Checkout, institucionais, 404
admin/                      painel (/admin): visão geral, produtos, formulário por categoria, estoque, pedidos, frete
```

## Decisões de arquitetura

- **React 19 + TypeScript (CRA/craco)**: era a stack já disponível no ambiente e permite TypeScript estrito sem mudar o servidor de desenvolvimento. Não há SSR; por isso o `public/index.html` carrega metadados estáticos e cada página usa `react-helmet-async` para título/descrição próprios.
- **Camada de dados isolada**: todas as telas falam só com `services/catalog.ts` via React Query. Na Fase 2, cada função passa a chamar a API e nenhuma tela muda.
- **Filtros na URL** (`?genero=&tamanho=&cor=&tom=&max=&ordem=&q=`): links compartilháveis e botão voltar funcionando.
- **Variações flexíveis**: `options` (tamanho/cor/tom/volume) + `variants` com estoque por combinação. A página de produto renderiza o seletor adequado por categoria.

### Dependências adicionadas e motivo

| Pacote | Motivo |
|---|---|
| `typescript`, `@types/*` | tipos explícitos exigidos pelo briefing |
| `react-helmet-async` | metadados únicos por rota |
| `lenis` | rolagem suave (desligada com `prefers-reduced-motion`) |
| `framer-motion` (já existia) | revelação do herói, microinterações, scroll reveal |
| `react-router-dom`, `@tanstack/react-query`, `sonner`, `lucide-react` (já existiam) | rotas, cache de dados, toasts, ícones |

## Como trocar os dados de exemplo

1. Substitua os arrays em `data/example-catalog.ts` ou aponte `services/catalog.ts` para a API.
2. Mantenha os tipos de `types/catalog.ts`. Para fotos reais, preencha `images[].src` (proporção 4:5 recomendada; outras proporções são recortadas com `object-cover`, sem quebrar o layout).
3. Marque `isExample: false` para remover o selo "Exemplo".

## Identidade visual

- Paleta: vinho `#2E0014`, cereja `#B3122F`, flor `#E8B4C0`, off-white `#FAF7F2`, tinta `#1C1217` (tokens em `index.css`).
- Tipografia: Cormorant Garamond (títulos) e Jost (texto), via Google Fonts.
- **Logo**: o arquivo do logo não chegou ao ambiente. `components/brand/Logo.tsx` e `public/favicon.svg` são marcas provisórias em SVG seguindo a descrição (taça com cereja + nome). As cores acima são as estimativas do briefing, **não medidas** no arquivo. Ao receber o logo, substitua o componente e meça as cores.

## SEO

`index.html` com título, descrição, Open Graph, `lang="pt-BR"`, JSON-LD (Store), `noscript` com conteúdo real; `robots.txt` e `llms.txt` em `public/`. **`sitemap.xml` e `canonical` ficam pendentes do domínio de produção** (um sitemap com domínio inventado prejudicaria a indexação).

## O que falta para a Fase 2

- Banco de dados, armazenamento de fotos e login da dona (Supabase) ou o backend FastAPI/Mongo do template.
- Pedidos e estoque reais; webhook de confirmação do Mercado Pago (Pix e cartão), primeiro em modo de testes.
- Cálculo de frete por CEP; envio do formulário de contato.
- Textos finais: sobre, trocas, privacidade/LGPD, dados legais (CNPJ, endereço), canais de contato.
- Logo oficial, fotos reais e preços reais.
