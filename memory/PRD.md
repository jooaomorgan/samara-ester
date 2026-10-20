# Cherry Vibes — PRD

## Problema original
Construir o front-end completo e o design da loja virtual Cherry Vibes (moda feminina e masculina, acessórios, maquiagem, cosméticos), pt-BR, celular primeiro. Fase 1 sem banco, login ou pagamento; nada simulado como salvo ou pago. Fase 2 (só quando pedida): Supabase/banco, Mercado Pago (Pix e cartão), frete, deploy.

## Premissas declaradas
- Público: feminino e masculino jovem-adulto (18–35), compra pelo celular, Brasil inteiro (confirmado pelo usuário).
- Stack: React 19 + TypeScript no ambiente atual (confirmado). Backend FastAPI/Mongo do template fica ocioso na Fase 1.
- O arquivo do logo não chegou ao ambiente: marca provisória em SVG; cores do briefing NÃO foram medidas em arquivo.
- Skills `/mnt/skills` não existem no ambiente; só `farm-seo-setup` foi lida e aplicada.

## Arquitetura
- `types/catalog.ts` tipos; `data/example-*.ts` dados de exemplo; `services/catalog.ts` camada de dados única (React Query nas telas).
- Estado real em localStorage: `store/cart.tsx`, `store/favorites.tsx`.
- Filtros na URL (`useCatalogFilters`), lógica pura testada em `lib/filters.ts`.
- Motion: framer-motion (herói on-load, microinterações) + GSAP ScrollTrigger (reveals discretos, cascata das portas, batch da grade da home) + Lenis (rolagem suave). Tudo desligado com `prefers-reduced-motion`.

## Implementado (jun/2026)
- Home: herói com revelação por linhas e parallax leve, portas das 4 áreas (cascata scrub), marquee, novidades (batch reveal), como comprar, ajuda, rodapé.
- Listagem por categoria com filtros (gênero, tamanho, cor, tom, preço), ordenação, busca global (/busca), estados vazios.
- Página de produto adaptativa (tamanho/cor, tom com amostras + aviso de tela, volume), estoque por combinação, adicionar à sacola, favoritar, JSON-LD Product.
- Favoritos, sacola (drawer + página), checkout com validação, frete de exemplo, botão de pagamento desabilitado com aviso.
- Institucionais (sobre, trocas, privacidade/LGPD, contato) com textos provisórios marcados; 404.
- Painel /admin (visão geral, produtos, formulário por categoria com upload só de interface, estoque, pedidos, frete) com banner "Fase 1 — nada é gravado".
- SEO: metadados estáticos + por rota, OG, noscript, robots.txt, llms.txt. Sitemap/canonical pendentes de domínio.
- Verificação: tsc sem erros, build CRA (lint) sem avisos, 11 testes Jest, teste E2E do agente de testes (iteração 1, tudo passou), capturas em celular e desktop.
- Animação de rolagem com a taça/cereja (referência do cliente) foi implementada e depois REMOVIDA a pedido do usuário; herói editorial restaurado.

## Pendências / backlog
- P0 (Fase 2): banco + fotos + login da dona; pedidos/estoque reais; Mercado Pago (Pix/cartão) em testes com webhook; frete por CEP; formulário de contato; deploy.
- P1: logo oficial (medir cores), fotos reais, textos finais (sobre, trocas, LGPD, dados legais, contato), sitemap.xml e canonical com domínio real.
- P2: galeria de produto com zoom, filtros por faixa de preço com controle deslizante, recomendações.
