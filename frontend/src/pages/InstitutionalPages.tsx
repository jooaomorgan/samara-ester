import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { PageIntro } from "../components/layout/PageIntro";
import { CherryBranch } from "../components/brand/CherryBranch";
import { useStoreSettings } from "../hooks/useStoreSettings";

function Prose({ children }: { children: React.ReactNode }) {
  return <section className="bg-cream"><div className="container-x max-w-3xl space-y-6 py-14 text-base leading-relaxed text-ink md:py-20 [&_h2]:display [&_h2]:mt-10 [&_h2]:text-3xl [&_p]:text-ink-muted">{children}</div></section>;
}

function Provisional({ children = "Esta informação ainda precisa ser preenchida pela loja antes da abertura das vendas." }: { children?: string }) {
  return <p className="border-l-2 border-cherry pl-4 text-sm" data-testid="provisional-notice"><strong className="text-ink">Informação pendente.</strong> {children}</p>;
}

function StoreText({ value }: { value?: string }) {
  return <p className="whitespace-pre-line" data-testid="store-managed-copy">{value}</p>;
}

export function AboutPage() {
  const { data: settings } = useStoreSettings();
  const copy = settings?.paginas.sobre || "";
  const storeName = settings?.loja.nome || "Cherry Vibes";
  return (
    <>
      <Seo title="Sobre" description={copy || "Conheça a loja e a seleção publicada no catálogo."} />
      <PageIntro eyebrow={storeName} title="Sobre a loja" lead={settings?.loja.slogan || "A história e a proposta da loja serão informadas por sua administradora."} />
      <Prose>{copy ? <StoreText value={copy} /> : <Provisional />}</Prose>
    </>
  );
}

export function ExchangesPage() {
  const { data: settings } = useStoreSettings();
  const copy = settings?.paginas.entrega_trocas || "";
  return (
    <>
      <Seo title="Entrega, trocas e devoluções" description={copy || "Consulte as condições informadas pela loja."} />
      <PageIntro eyebrow="Ajuda" title="Entrega, trocas e devoluções" lead={settings?.checkout.mensagem_entrega || "As condições de entrega e retirada serão exibidas aqui."} />
      <Prose>{copy ? <StoreText value={copy} /> : <Provisional />}</Prose>
    </>
  );
}

export function PrivacyPage() {
  const { data: settings } = useStoreSettings();
  const copy = settings?.paginas.politicas || "";
  return (
    <>
      <Seo title="Privacidade e políticas" description={copy || "As políticas da loja serão preenchidas pela administradora."} />
      <PageIntro eyebrow="Transparência" title="Privacidade e políticas" lead="O checkout encaminha ao painel da loja os dados necessários para registrar o pedido." />
      <Prose>
        {copy ? <StoreText value={copy} /> : (
          <>
            <Provisional>O texto de privacidade e as demais políticas precisam ser preenchidos pela loja.</Provisional>
            <p>Favoritos e itens da sacola ficam armazenados neste navegador. Ao enviar um pedido, nome, telefone, endereço, itens, pagamento e observações são enviados à API da loja para atendimento.</p>
          </>
        )}
      </Prose>
    </>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const { data: settings } = useStoreSettings();
  const copy = settings?.paginas.contato || "";
  const phone = settings?.loja.whatsapp?.replace(/\D/g, "");
  return (
    <>
      <Seo title="Contato" description={copy || "Canais de contato informados pela loja."} />
      <PageIntro eyebrow="Fale com a gente" title="Contato" lead={settings?.loja.horario || "Os canais de atendimento serão informados pela loja."} />
      <section className="bg-cream">
        <div className="container-x grid gap-12 py-14 md:grid-cols-2 md:py-20">
          <div className="space-y-5">
            {copy ? <p className="whitespace-pre-line" data-testid="store-managed-copy">{copy}</p> : <Provisional>Preencha os canais de atendimento nas configurações da loja.</Provisional>}
            {phone && <a href={"https://wa.me/" + phone} target="_blank" rel="noreferrer" className="btn btn-ink" data-testid="store-whatsapp-link">Conversar pelo WhatsApp</a>}
            {settings?.loja.email && <a href={"mailto:" + settings.loja.email} className="link-underline block text-sm" data-testid="store-email-link">{settings.loja.email}</a>}
            {settings?.loja.endereco && <p className="text-sm text-ink-muted">{settings.loja.endereco}</p>}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="space-y-5" data-testid="contact-form">
            {[["nome", "Nome", "text"], ["email", "E-mail", "email"]].map(([name, label, type]) => (
              <div key={name}>
                <label htmlFor={"c-" + name} className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-muted">{label}</label>
                <input id={"c-" + name} name={name} type={type} required className="field" data-testid={"contact-" + name} />
              </div>
            ))}
            <div>
              <label htmlFor="c-mensagem" className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-muted">Mensagem</label>
              <textarea id="c-mensagem" name="mensagem" required rows={5} className="field py-3" data-testid="contact-message" />
            </div>
            <button type="submit" className="btn btn-ink" data-testid="contact-submit">Conferir mensagem</button>
            {sent && <p role="status" className="border-l-2 border-cherry pl-3 text-sm text-ink-muted" data-testid="contact-pending-notice">Esta vitrine não envia mensagens. Use os canais de atendimento informados pela loja.</p>}
          </form>
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


