# Cherry Vibes — vitrine integrada

Vitrine React + TypeScript conectada em tempo de execução à API do painel administrativo. O painel é a fonte única de dados para produtos, categorias, preços, estoque e configurações. A vitrine mantém o desenho existente em vinho, creme e cereja; nenhum deploy é necessário para publicar alterações de catálogo.

## Rodar localmente

```powershell
cd frontend
Copy-Item .env.example .env
# Defina REACT_APP_API_URL=http://127.0.0.1:8000 no .env após iniciar a API do painel.
corepack yarn install --frozen-lockfile
corepack yarn start
```

Abra `http://localhost:3000`. Para trabalhar apenas no visual, deixe `REACT_APP_API_URL` vazio: a vitrine mostra os produtos de exemplo marcados e não permite comprá-los. Para integrar, inicie também o backend do repositório `samara-ester-admin` com um MongoDB local e configure seu frontend/API conforme o README desse repositório.

## Configuração no Netlify

O `netlify.toml` usa `frontend/` como diretório do site, gera `build/`, mantém o fallback SPA e expõe `/sitemap.xml` por uma função que consulta a API. Configure estas variáveis no ambiente de build/runtime do site:

- `REACT_APP_API_URL`: origem HTTPS estável da API, sem `/api` (ex.: `https://api.seudominio.com`). Ela é pública e não deve conter credenciais.
- `REACT_APP_ADMIN_URL`: endereço HTTPS do painel. O caminho `/admin` da vitrine abre esse painel em produção; se vazio, mostra que falta configurá-lo.
- `STORE_API_URL`: origem da API para a função do sitemap; configure também `PUBLIC_SITE_URL` se usar domínio próprio.

Depois de alterar variáveis `REACT_APP_*`, faça um novo build do site. O sitemap atualiza seu cache em até 5 minutos; produtos e configurações são buscados na abertura, ao voltar para a aba e a cada 3 minutos. O cache público de configurações da API expira em 60 segundos. Em falha de rede, o último catálogo salvo é mostrado com aviso e botão de nova tentativa; o servidor ainda confere preço e estoque ao receber o checkout.

## Como os dados se integram

- A vitrine lê `GET /api/store/products`, `GET /api/store/products/{slug}`, `GET /api/store/categories` e `GET /api/store/settings`.
- O checkout envia `POST /api/store/orders`. O backend recalcula o preço, valida status, variação, estoque, forma de pagamento e frete, decrementa estoque e grava o pedido que aparece em **Administração → Pedidos**.
- Imagens do painel são carregadas por `GET /api/files/{caminho}`. A API exige armazenamento persistente; configure a chave de storage do backend antes de depender de novos uploads.
- Produtos de exemplo deixam de aparecer quando há qualquer produto real publicado. A vitrine identifica os exemplos quando ainda não existem produtos reais; itens de exemplo nunca podem ser comprados.
- O estoque hoje existe por produto no backend. A vitrine espelha esse total em cada combinação de tamanho/cor; controle independente de estoque por variação ainda exige mudança no modelo de dados.

## Testes e build

```powershell
corepack yarn build
corepack yarn test --watchAll=false --runInBand
```

Os testes de integração da API ficam no repositório do painel. Para cobrir o ciclo completo, use um MongoDB de teste isolado: criar produto no painel, confirmá-lo em `/api/store/products`, enviar o pedido pelo checkout/API, localizar o pedido em **Pedidos** e conferir o estoque em `/api/store/products`.

## SEO

Títulos e Open Graph continuam sendo atualizados por página com React Helmet. Como CRA não faz renderização no servidor, alguns crawlers sociais podem não executar as meta tags por produto; o sitemap dinâmico publica as URLs de produtos e categorias, mas não substitui SSR/prerenderização para esses crawlers. O canonical/domínio próprio depende de definir `PUBLIC_SITE_URL`.
