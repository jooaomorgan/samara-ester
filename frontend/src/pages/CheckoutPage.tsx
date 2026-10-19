import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { PageIntro } from "../components/layout/PageIntro";
import { useCartLines } from "../hooks/useCartLines";
import { adminService } from "../services/catalog";
import { formatBRL, variantLabel } from "../lib/format";

const fields = [
  { name: "nome", label: "Nome completo", auto: "name", type: "text" },
  { name: "email", label: "E-mail", auto: "email", type: "email" },
  { name: "telefone", label: "Celular (WhatsApp)", auto: "tel", type: "tel" },
  { name: "cep", label: "CEP", auto: "postal-code", type: "text" },
  { name: "endereco", label: "Endereço", auto: "address-line1", type: "text" },
  { name: "numero", label: "Número e complemento", auto: "address-line2", type: "text" },
  { name: "cidade", label: "Cidade", auto: "address-level2", type: "text" },
  { name: "estado", label: "Estado (UF)", auto: "address-level1", type: "text" },
] as const;

type FieldName = (typeof fields)[number]["name"];

function validate(values: Record<FieldName, string>) {
  const errors: Partial<Record<FieldName, string>> = {};
  fields.forEach((f) => { if (!values[f.name].trim()) errors[f.name] = "Preencha este campo."; });
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Digite um e-mail válido, como nome@exemplo.com.";
  if (values.cep && !/^\d{5}-?\d{3}$/.test(values.cep)) errors.cep = "Use o formato 00000-000.";
  if (values.estado && !/^[A-Za-z]{2}$/.test(values.estado.trim())) errors.estado = "Use a sigla, como SP ou RJ.";
  return errors;
}

export default function CheckoutPage() {
  const { lines, subtotal } = useCartLines();
  const { data: rules = [] } = useQuery({ queryKey: ["shipping-rules"], queryFn: adminService.listShippingRules });
  const [values, setValues] = useState<Record<FieldName, string>>(() => Object.fromEntries(fields.map((f) => [f.name, ""])) as Record<FieldName, string>);
  const [touched, setTouched] = useState(false);
  const [shipping, setShipping] = useState<string>("");
  const [payment, setPayment] = useState<"pix" | "cartao">("pix");

  const errors = validate(values);
  const rule = rules.find((r) => r.id === shipping);
  const shippingPrice = rule ? (rule.freeAbove && subtotal >= rule.freeAbove ? 0 : rule.price) : 0;
  const formComplete = Object.keys(errors).length === 0 && !!rule && lines.length > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
  };

  return (
    <>
      <Seo title="Checkout" description="Finalize sua compra na Cherry Vibes." noIndex />
      <PageIntro eyebrow="Etapa final" title="Checkout" lead="Preencha seus dados e escolha a entrega. O pagamento com Pix e cartão (Mercado Pago) será ativado na próxima fase." />
      <section className="bg-cream">
        <div className="container-x py-10 md:py-16">
          {lines.length === 0 ? (
            <div className="py-12 text-center" data-testid="checkout-empty">
              <p className="font-serif text-2xl">Sua sacola está vazia.</p>
              <Link to="/" className="btn btn-ink mt-6" data-testid="checkout-empty-cta">Voltar para a vitrine</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-[1fr_400px]" data-testid="checkout-form">
              <div className="space-y-12">
                <fieldset>
                  <legend className="display text-3xl">Seus dados e entrega</legend>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {fields.map((f) => {
                      const err = touched ? errors[f.name] : undefined;
                      return (
                        <div key={f.name} className={f.name === "endereco" || f.name === "nome" ? "sm:col-span-2" : ""}>
                          <label htmlFor={`f-${f.name}`} className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-muted">{f.label}</label>
                          <input id={`f-${f.name}`} name={f.name} type={f.type} autoComplete={f.auto} value={values[f.name]} onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))} aria-invalid={!!err} aria-describedby={err ? `e-${f.name}` : undefined} className="field" data-testid={`checkout-${f.name}`} />
                          {err && <p id={`e-${f.name}`} className="mt-1 text-xs text-cherry" data-testid={`checkout-error-${f.name}`}>{err}</p>}
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="display text-3xl">Frete</legend>
                  <p className="mt-2 text-xs text-ink-muted">Valores de exemplo. O cálculo real por CEP entra na Fase 2.</p>
                  <div className="mt-5 space-y-2">
                    {rules.map((r) => (
                      <label key={r.id} className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors duration-200 ${shipping === r.id ? "border-ink bg-white" : "border-[var(--line-light)]"}`}>
                        <input type="radio" name="frete" value={r.id} checked={shipping === r.id} onChange={() => setShipping(r.id)} className="h-4 w-4 accent-[var(--cherry)]" data-testid={`shipping-${r.id}`} />
                        <span className="flex-1">
                          <span className="block text-sm">{r.label}</span>
                          <span className="block text-xs text-ink-muted">{r.regions} · {r.deadlineDays}</span>
                        </span>
                        <span className="text-sm">{r.freeAbove && subtotal >= r.freeAbove ? "Grátis" : formatBRL(r.price)}</span>
                      </label>
                    ))}
                  </div>
                  {touched && !rule && <p className="mt-2 text-xs text-cherry" data-testid="checkout-error-frete">Escolha uma opção de frete.</p>}
                </fieldset>

                <fieldset>
                  <legend className="display text-3xl">Pagamento</legend>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {([["pix", "Pix", "Aprovação na hora"], ["cartao", "Cartão de crédito", "Parcelamento a definir pela loja"]] as const).map(([value, label, desc]) => (
                      <label key={value} className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors duration-200 ${payment === value ? "border-ink bg-white" : "border-[var(--line-light)]"}`}>
                        <input type="radio" name="pagamento" value={value} checked={payment === value} onChange={() => setPayment(value)} className="h-4 w-4 accent-[var(--cherry)]" data-testid={`payment-${value}`} />
                        <span><span className="block text-sm">{label}</span><span className="block text-xs text-ink-muted">{desc}</span></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <aside className="h-fit border border-[var(--line-light)] bg-white p-6 lg:sticky lg:top-28" data-testid="order-summary">
                <h2 className="font-serif text-2xl font-light">Resumo do pedido</h2>
                <ul className="mt-5 divide-y divide-[var(--line-light)] text-sm">
                  {lines.map((l) => (
                    <li key={l.variantId} className="flex justify-between gap-4 py-3">
                      <span>{l.quantity}× {l.product.name}<span className="block text-xs text-ink-muted">{variantLabel(l.variant)}</span></span>
                      <span className="whitespace-nowrap">{formatBRL(l.product.price * l.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2 border-t border-[var(--line-light)] pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-ink-muted">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-muted">Frete</dt><dd data-testid="summary-shipping">{rule ? formatBRL(shippingPrice) : "escolha acima"}</dd></div>
                  <div className="flex justify-between font-serif text-2xl"><dt>Total</dt><dd data-testid="summary-total">{formatBRL(subtotal + shippingPrice)}</dd></div>
                </dl>

                <div className="mt-6 border border-dashed border-cherry/50 bg-cream p-4 text-xs text-ink-muted" role="status" data-testid="payment-pending-notice">
                  <strong className="block text-ink">Pagamento ainda não ativado.</strong>
                  A conclusão do pedido e a cobrança via Mercado Pago ({payment === "pix" ? "Pix" : "cartão"}) ficam disponíveis quando o pagamento for ativado, na Fase 2. Nenhum pedido é criado agora.
                </div>

                <button type="submit" className="btn btn-ghost-dark mt-4 w-full" data-testid="checkout-validate-button">Conferir dados</button>
                {touched && (
                  <p className="mt-2 text-xs" aria-live="polite" data-testid="checkout-validation-result">
                    {formComplete ? "Dados completos. Falta só o pagamento ser ativado." : "Revise os campos destacados acima."}
                  </p>
                )}
                <button type="button" disabled aria-disabled="true" aria-describedby="pagamento-indisponivel" className="btn btn-cherry mt-3 w-full" data-testid="checkout-pay-button">
                  Pagar com Mercado Pago
                </button>
                <p id="pagamento-indisponivel" className="mt-2 text-center text-[0.68rem] uppercase tracking-[0.16em] text-ink-muted">Disponível quando o pagamento for ativado</p>
              </aside>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
