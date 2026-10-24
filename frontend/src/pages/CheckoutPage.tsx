import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { PageIntro } from "../components/layout/PageIntro";
import { useCartLines } from "../hooks/useCartLines";
import { useCart } from "../store/cart";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { createStoreOrder, type StoreOrderResult } from "../services/catalog";
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
type PaymentMethod = "pix" | "cartao" | "whatsapp";
type CheckoutValues = Record<FieldName, string> & { observacoes: string };
const NO_PAYMENT_METHODS: PaymentMethod[] = [];

function validate(values: CheckoutValues) {
  const errors: Partial<Record<FieldName, string>> = {};
  fields.forEach((field) => { if (!values[field.name].trim()) errors[field.name] = "Preencha este campo."; });
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Digite um e-mail válido, como nome@exemplo.com.";
  if (values.telefone && !/^[+\d\s().-]{10,20}$/.test(values.telefone)) errors.telefone = "Informe um telefone com DDD.";
  if (values.cep && !/^\d{5}-?\d{3}$/.test(values.cep)) errors.cep = "Use o formato 00000-000.";
  if (values.estado && !/^[A-Za-z]{2}$/.test(values.estado.trim())) errors.estado = "Use a sigla, como SP ou RJ.";
  return errors;
}

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: "Pix",
  cartao: "Cartão",
  whatsapp: "Combinar pelo WhatsApp",
};

export default function CheckoutPage() {
  const { lines, subtotal } = useCartLines();
  const { clear } = useCart();
  const { data: settings } = useStoreSettings();
  const [values, setValues] = useState<CheckoutValues>(() => ({
    nome: "", email: "", telefone: "", cep: "", endereco: "", numero: "", cidade: "", estado: "", observacoes: "",
  }));
  const [touched, setTouched] = useState(false);
  const [shipping, setShipping] = useState("");
  const [payment, setPayment] = useState<PaymentMethod | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [order, setOrder] = useState<StoreOrderResult | null>(null);

  const methods = settings?.checkout.formas_pagamento ?? NO_PAYMENT_METHODS;
  const rules = settings?.checkout.regras_entrega || [];
  const selectedRule = rules.find((rule) => rule.id === shipping);
  const shippingPrice = selectedRule
    ? selectedRule.gratis_acima != null && subtotal >= selectedRule.gratis_acima ? 0 : selectedRule.preco
    : 0;
  const errors = validate(values);
  const address = useMemo(
    () => [values.endereco, values.numero, values.cidade, values.estado, values.cep].map((part) => part.trim()).filter(Boolean).join(", "),
    [values.endereco, values.numero, values.cidade, values.estado, values.cep],
  );
  const storeReady = Boolean(settings?.loja_aberta && !settings.vendas_pausadas);
  const hasExampleItems = lines.some((line) => line.product.isExample);
  const formComplete = Object.keys(errors).length === 0 && lines.length > 0 && !hasExampleItems && methods.includes(payment as PaymentMethod) && (!rules.length || Boolean(selectedRule));

  useEffect(() => {
    if (methods.length && !methods.includes(payment as PaymentMethod)) setPayment(methods[0] as PaymentMethod);
  }, [methods, payment]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(true);
    setSubmitError("");
    if (hasExampleItems) {
      setSubmitError("Itens de demonstração não podem gerar pedidos. Aguarde produtos reais publicados pela loja.");
      return;
    }
    if (!formComplete || !payment || !storeReady) return;

    setSubmitting(true);
    try {
      const response = await createStoreOrder({
        cliente_nome: values.nome.trim(),
        cliente_telefone: values.telefone.trim(),
        cliente_email: values.email.trim(),
        forma_pagamento: payment,
        observacoes: values.observacoes.trim(),
        entrega_id: selectedRule?.id,
        endereco_entrega: address,
        itens: lines.map((line) => ({
          produto_id: line.product.id,
          quantidade: line.quantity,
          tamanho: line.variant.selection.tamanho,
          cor: line.variant.selection.cor,
          preco_esperado: line.product.price,
        })),
      });
      setOrder(response);
      clear();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Checkout" description="Informe os dados para registrar seu pedido na loja." noIndex />
      <PageIntro eyebrow="Etapa final" title="Checkout" lead="Seu pedido será registrado no painel. A confirmação do preço e do estoque acontece no servidor." />
      <section className="bg-cream">
        <div className="container-x py-10 md:py-16">
          {order ? (
            <section className="mx-auto max-w-2xl border border-[var(--line-light)] bg-white p-8 text-center md:p-12" role="status" data-testid="checkout-success">
              <p className="eyebrow text-ink-muted">Pedido recebido</p>
              <h2 className="display mt-3 text-4xl">Pedido #{order.numero}</h2>
              <p className="mt-4 text-sm text-ink-muted">A loja recebeu seu pedido. O total confirmado pelo servidor é {formatBRL(order.total)}.</p>
              {order.frete > 0 && <p className="mt-2 text-xs text-ink-muted">Entrega: {formatBRL(order.frete)}</p>}
              {order.frete === 0 && !selectedRule && <p className="mt-2 text-xs text-ink-muted">A entrega será confirmada pela loja.</p>}
              <Link to="/" className="btn btn-ink mt-8" data-testid="checkout-success-home">Continuar comprando</Link>
            </section>
          ) : lines.length === 0 ? (
            <div className="py-12 text-center" data-testid="checkout-empty">
              <p className="font-serif text-2xl">Sua sacola está vazia.</p>
              <Link to="/" className="btn btn-ink mt-6" data-testid="checkout-empty-cta">Voltar para a vitrine</Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} method="post" className="grid gap-12 lg:grid-cols-[1fr_400px]" data-testid="checkout-form">
              <div className="space-y-12">
                <fieldset>
                  <legend className="display text-3xl">Seus dados e entrega</legend>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {fields.map((field) => {
                      const error = touched ? errors[field.name] : undefined;
                      return (
                        <div key={field.name} className={field.name === "endereco" || field.name === "nome" ? "sm:col-span-2" : ""}>
                          <label htmlFor={"f-" + field.name} className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-muted">{field.label}</label>
                          <input
                            id={"f-" + field.name}
                            name={field.name}
                            type={field.type}
                            autoComplete={field.auto}
                            inputMode={field.name === "telefone" || field.name === "cep" ? "tel" : undefined}
                            value={values[field.name]}
                            onChange={(event) => setValues((previous) => ({ ...previous, [field.name]: event.target.value }))}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? "e-" + field.name : undefined}
                            required
                            className="field"
                            data-testid={"checkout-" + field.name}
                          />
                          {error && <p id={"e-" + field.name} className="mt-1 text-xs text-cherry" data-testid={"checkout-error-" + field.name}>{error}</p>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5">
                    <label htmlFor="f-observacoes" className="mb-1.5 block text-xs uppercase tracking-[0.16em] text-ink-muted">Observações</label>
                    <textarea
                      id="f-observacoes"
                      name="observacoes"
                      rows={4}
                      maxLength={500}
                      value={values.observacoes}
                      onChange={(event) => setValues((previous) => ({ ...previous, observacoes: event.target.value }))}
                      className="field py-3"
                      data-testid="checkout-observacoes"
                    />
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="display text-3xl">Entrega</legend>
                  <p className="mt-2 text-xs text-ink-muted">
                    {settings?.checkout.mensagem_entrega || "O endereço acima será enviado à loja para combinar a entrega."}
                  </p>
                  {rules.length ? (
                    <div className="mt-5 space-y-2">
                      {rules.map((rule) => {
                        const free = rule.gratis_acima != null && subtotal >= rule.gratis_acima;
                        return (
                          <label key={rule.id} className={"flex cursor-pointer items-center gap-4 border p-4 transition-colors duration-200 " + (shipping === rule.id ? "border-ink bg-white" : "border-[var(--line-light)]")}>
                            <input type="radio" name="frete" value={rule.id} checked={shipping === rule.id} onChange={() => setShipping(rule.id)} className="h-4 w-4 accent-[var(--cherry)]" data-testid={"shipping-" + rule.id} />
                            <span className="flex-1">
                              <span className="block text-sm">{rule.nome}</span>
                              <span className="block text-xs text-ink-muted">{rule.regioes}{rule.prazo ? " · " + rule.prazo : ""}</span>
                            </span>
                            <span className="text-sm">{free ? "Grátis" : formatBRL(rule.preco)}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-4 border border-dashed border-[var(--line-light)] p-4 text-sm text-ink-muted" role="status" data-testid="checkout-delivery-unconfigured">
                      A loja ainda não informou valores de entrega; o frete será combinado após o pedido.
                    </p>
                  )}
                  {touched && rules.length > 0 && !selectedRule && <p className="mt-2 text-xs text-cherry" role="alert" data-testid="checkout-error-frete">Escolha uma opção de entrega.</p>}
                  {settings?.checkout.retirada && <p className="mt-4 text-sm text-ink-muted">{settings.checkout.retirada}</p>}
                </fieldset>

                <fieldset>
                  <legend className="display text-3xl">Pagamento</legend>
                  {settings?.checkout.mensagem_pagamento && <p className="mt-2 text-xs text-ink-muted">{settings.checkout.mensagem_pagamento}</p>}
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {methods.map((method) => (
                      <label key={method} className={"flex cursor-pointer items-center gap-4 border p-4 transition-colors duration-200 " + (payment === method ? "border-ink bg-white" : "border-[var(--line-light)]")}>
                        <input type="radio" name="pagamento" value={method} checked={payment === method} onChange={() => setPayment(method)} className="h-4 w-4 accent-[var(--cherry)]" data-testid={"payment-" + method} />
                        <span className="block text-sm">{PAYMENT_LABELS[method]}</span>
                      </label>
                    ))}
                  </div>
                  {!methods.length && <p className="mt-4 text-sm text-ink-muted" role="status" data-testid="checkout-payment-unconfigured">As formas de pagamento ainda não foram configuradas pela loja.</p>}
                  {settings?.checkout.chave_pix && payment === "pix" && (
                    <p className="mt-4 border border-[var(--line-light)] bg-white p-4 text-sm" data-testid="checkout-pix-key">
                      Chave Pix informada pela loja: <strong>{settings.checkout.chave_pix}</strong>
                    </p>
                  )}
                </fieldset>
              </div>

              <aside className="h-fit border border-[var(--line-light)] bg-white p-6 lg:sticky lg:top-28" data-testid="order-summary">
                <h2 className="font-serif text-2xl font-light">Resumo do pedido</h2>
                <ul className="mt-5 divide-y divide-[var(--line-light)] text-sm">
                  {lines.map((line) => (
                    <li key={line.variantId} className="flex justify-between gap-4 py-3">
                      <span>{line.quantity}× {line.product.name}<span className="block text-xs text-ink-muted">{variantLabel(line.variant)}</span></span>
                      <span className="whitespace-nowrap">{formatBRL(line.product.price * line.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2 border-t border-[var(--line-light)] pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-ink-muted">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink-muted">Frete</dt><dd data-testid="summary-shipping">{selectedRule ? formatBRL(shippingPrice) : "a combinar"}</dd></div>
                  <div className="flex justify-between font-serif text-2xl"><dt>Total estimado</dt><dd data-testid="summary-total">{formatBRL(subtotal + shippingPrice)}</dd></div>
                </dl>

                {hasExampleItems && (
                  <p className="mt-4 border border-dashed border-cherry/50 bg-cream p-4 text-xs text-ink-muted" role="status" data-testid="checkout-example-items">
                    Itens de demonstração aparecem apenas para visualizar a vitrine; eles não podem ser comprados.
                  </p>
                )}
                {!storeReady && (
                  <p className="mt-6 border border-dashed border-cherry/50 bg-cream p-4 text-xs text-ink-muted" role="status" data-testid="checkout-store-closed">
                    {settings?.vendas_pausadas && settings.mensagem_pausa
                      ? settings.mensagem_pausa
                      : "A loja ainda não está configurada para receber pedidos."}
                  </p>
                )}
                {!formComplete && touched && <p className="mt-3 text-xs text-cherry" role="status" data-testid="checkout-validation-result">Revise os campos e as opções destacados acima.</p>}
                {submitError && <p className="mt-4 border-l-2 border-cherry pl-3 text-sm text-cherry" role="alert" data-testid="checkout-submit-error">{submitError}</p>}
                <button type="submit" disabled={submitting} className="btn btn-cherry mt-4 w-full" data-testid="checkout-pay-button">
                  {submitting ? "Enviando pedido…" : "Confirmar pedido"}
                </button>
                <p className="mt-2 text-center text-[0.68rem] text-ink-muted">O preço e o estoque são confirmados pela loja antes de registrar o pedido.</p>
              </aside>
            </form>
          )}
        </div>
      </section>
    </>
  );
}



