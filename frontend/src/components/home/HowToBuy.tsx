import { Link } from "react-router-dom";
import { Reveal } from "../motion/Reveal";

const steps = [
  { title: "Escolha e separe", text: "Favorite o que gostar e adicione à sacola. Tudo fica salvo no seu navegador." },
  { title: "Finalize e pague", text: "Pix ou cartão pelo Mercado Pago. O pagamento será ativado na próxima fase da loja." },
  { title: "Receba e troque se precisar", text: "A política de trocas será definida pela loja e publicada aqui antes das vendas começarem." },
];

export function HowToBuy() {
  return (
    <section id="como-comprar" className="theme-dark relative grain" aria-labelledby="como-comprar-title" data-testid="how-to-buy">
      <div className="container-x grid gap-12 py-20 md:grid-cols-[1fr_1.4fr] md:py-28">
        <Reveal>
          <h2 id="como-comprar-title" className="display text-4xl sm:text-5xl">Como comprar</h2>
          <p className="mt-6 max-w-sm text-sm text-cream/70">Simples como pedir um drink: escolha, confirme e aguarde. Dúvidas? <Link to="/contato" className="link-underline text-blossom">Fale com a gente</Link>.</p>
        </Reveal>
        <ol className="divide-y divide-[var(--line-dark)] border-y border-[var(--line-dark)]">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.1} className="grid gap-2 py-7 md:grid-cols-[1fr_2fr] md:gap-8">
              <h3 className="font-serif text-2xl font-light">{s.title}</h3>
              <p className="text-sm text-cream/75">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
