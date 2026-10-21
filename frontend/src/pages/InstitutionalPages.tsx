import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { PageIntro } from "../components/layout/PageIntro";
import { CherryBranch } from "../components/brand/CherryBranch";

function Prose({ children }: { children: React.ReactNode }) {
  return <section className="bg-cream"><div className="container-x max-w-3xl space-y-6 py-14 text-base leading-relaxed text-ink md:py-20 [&_h2]:display [&_h2]:mt-10 [&_h2]:text-3xl [&_p]:text-ink-muted">{children}</div></section>;
}

function Provisional() {
  return <p className="border-l-2 border-cherry pl-4 text-sm" data-testid="provisional-notice"><strong className="text-ink">Texto provisório.</strong> Esta página será escrita pela loja antes das vendas começarem.</p>;
}

export function AboutPage() {
  return (
    <>
      <Seo title="Sobre" description="Cherry Vibes é uma loja de moda feminina e masculina, acessórios, maquiagem, cosméticos e calçados com clima de noite de coquetel." />
      <PageIntro eyebrow="A marca" title="Noite de coquetel, todos os dias" lead="Cherry Vibes nasce da ideia de que vestir e se maquiar pode ter o mesmo clima de uma noite bem acompanhada: leve, romântico e um pouco brincalhão." />
      <Prose>
        <Provisional />
        <h2>O que vendemos</h2>
        <p>Roupas femininas e masculinas, acessórios, maquiagem, cosméticos e calçados. As peças serão escolhidas uma a uma pela dona da loja.</p>
        <h2>Quem somos</h2>
        <p>A história da marca, a cidade de origem e o rosto por trás da Cherry Vibes serão contados aqui pela própria dona.</p>
      </Prose>
    </>
  );
}

export function ExchangesPage() {
  return (
    <>
      <Seo title="Trocas e devoluções" description="Como funcionarão trocas e devoluções na Cherry Vibes." />
      <PageIntro eyebrow="Ajuda" title="Trocas e devoluções" lead="A política oficial será definida pela loja. Abaixo, a estrutura que ela vai preencher." />
      <Prose>
        <Provisional />
        <h2>Prazo para troca</h2>
        <p>Prazo em dias corridos a partir do recebimento, conforme o Código de Defesa do Consumidor (arrependimento em até 7 dias para compras online).</p>
        <h2>Condições</h2>
        <p>Peças sem uso, com etiqueta. Maquiagem e cosméticos lacrados, por higiene.</p>
        <h2>Como solicitar</h2>
        <p>Pelo canal de contato da loja, informando o número do pedido.</p>
      </Prose>
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <Seo title="Privacidade e LGPD" description="Como a Cherry Vibes trata dados pessoais, conforme a LGPD." />
      <PageIntro eyebrow="Transparência" title="Privacidade e LGPD" lead="Nesta fase, não há cadastro, pedidos, pagamentos ou envio de mensagens. Favoritos e sacola ficam no armazenamento local deste navegador." />
      <Prose>
        <Provisional />
        <h2>O que fica no seu aparelho</h2>
        <p>Favoritos e itens da sacola são guardados no armazenamento local do navegador e podem ser apagados por você a qualquer momento.</p>
        <h2>Recursos de terceiros</h2>
        <p>A vitrine carrega fontes pelo Google Fonts e imagens pelo Unsplash e Pexels. Ao solicitar esses arquivos, seu navegador compartilha dados técnicos da conexão com esses provedores, que podem tratá-los conforme as próprias políticas de privacidade.</p>
        <h2>O que virá na Fase 2</h2>
        <p>Dados de cadastro, endereço e pagamento serão tratados com base legal, finalidade clara e direitos de acesso, correção e exclusão, conforme a LGPD. O texto completo e o contato do encarregado serão publicados pela loja.</p>
      </Prose>
    </>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <Seo title="Contato" description="Fale com a Cherry Vibes." />
      <PageIntro eyebrow="Fale com a gente" title="Contato" lead="Os canais oficiais (WhatsApp, e-mail e redes) serão informados pela loja." />
      <section className="bg-cream">
        <div className="container-x grid gap-12 py-14 md:grid-cols-2 md:py-20">
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-5" data-testid="contact-form">
            {[["nome", "Nome", "text"], ["email", "E-mail", "email"]].map(([name, label, type]) => (
              <div key={name}>
                <label htmlFor={`c-${name}`} className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-muted">{label}</label>
                <input id={`c-${name}`} name={name} type={type} required className="field" data-testid={`contact-${name}`} />
              </div>
            ))}
            <div>
              <label htmlFor="c-mensagem" className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-muted">Mensagem</label>
              <textarea id="c-mensagem" name="mensagem" required rows={5} className="field py-3" data-testid="contact-message" />
            </div>
            <button type="submit" className="btn btn-ink" data-testid="contact-submit">Enviar mensagem</button>
            {sent && <p role="status" className="border-l-2 border-cherry pl-3 text-sm text-ink-muted" data-testid="contact-pending-notice">O envio de mensagens será ativado na Fase 2. Nada foi enviado agora.</p>}
          </form>
          <div className="relative hidden md:block">
            <CherryBranch className="absolute -right-10 top-0 w-full text-wine/60" />
          </div>
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <>
      <Seo title="Página não encontrada" description="Essa página não existe." noIndex />
      <section className="theme-dark relative grain min-h-[70svh] overflow-hidden" data-testid="not-found-page">
        <CherryBranch className="pointer-events-none absolute -right-10 -top-6 w-[min(80vw,520px)] text-cream/50" />
        <div className="container-x relative flex min-h-[70svh] flex-col justify-center py-20">
          <p className="eyebrow text-blossom">Erro 404</p>
          <h1 className="display mt-4 text-5xl sm:text-6xl lg:text-7xl">Essa taça está vazia.</h1>
          <p className="mt-6 max-w-md text-cream/75">A página que você procurou não existe ou mudou de lugar.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-cherry" data-testid="not-found-home-link">Voltar ao início</Link>
            <Link to="/busca" className="btn btn-ghost-light" data-testid="not-found-search-link">Buscar uma peça</Link>
          </div>
        </div>
      </section>
    </>
  );
}
