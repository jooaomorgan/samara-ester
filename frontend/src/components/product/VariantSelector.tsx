import { motion, useReducedMotion } from "framer-motion";
import type { OptionKey, Product, Variant } from "../../types/catalog";

interface VariantSelectorProps {
  product: Product;
  selection: Partial<Record<OptionKey, string>>;
  onChange: (key: OptionKey, value: string) => void;
}

function isAvailable(product: Product, selection: Partial<Record<OptionKey, string>>, key: OptionKey, value: string) {
  return product.variants.some((v) => {
    if (v.selection[key] !== value || v.stock === 0) return false;
    return Object.entries(selection).every(([k, val]) => k === key || !val || v.selection[k as OptionKey] === val);
  });
}

export function findVariant(product: Product, selection: Partial<Record<OptionKey, string>>): Variant | undefined {
  return product.variants.find((v) => product.options.every((o) => v.selection[o.key] === selection[o.key]));
}

export function VariantSelector({ product, selection, onChange }: VariantSelectorProps) {
  const reduce = useReducedMotion();
  return (
    <div className="space-y-7" data-testid="variant-selector">
      {product.options.map((opt) => {
        const isSwatch = opt.key === "tom" || (opt.key === "cor" && opt.values.some((v) => v.swatch));
        return (
          <fieldset key={opt.key}>
            <legend className="flex w-full items-baseline justify-between text-xs uppercase tracking-[0.18em] text-ink-muted">
              <span>{opt.label}</span>
              {selection[opt.key] && <span className="normal-case tracking-normal text-ink" data-testid={`selected-${opt.key}`}>{selection[opt.key]}</span>}
            </legend>
            <div className={`mt-3 flex flex-wrap ${isSwatch ? "gap-3" : "gap-2"}`}>
              {opt.values.map((val) => {
                const active = selection[opt.key] === val.value;
                const available = isAvailable(product, selection, opt.key, val.value);
                return (
                  <motion.button
                    key={val.value}
                    type="button"
                    whileTap={reduce ? undefined : { scale: 0.94 }}
                    onClick={() => onChange(opt.key, val.value)}
                    aria-pressed={active}
                    aria-label={isSwatch ? `${val.value}${available ? "" : " (esgotado)"}` : undefined}
                    title={isSwatch ? val.value : undefined}
                    data-testid={`option-${opt.key}-${val.value}`}
                    className={
                      isSwatch
                        ? `relative grid h-11 w-11 place-items-center rounded-full border transition-colors duration-200 ${active ? "border-ink" : "border-transparent"} ${available ? "" : "opacity-40"}`
                        : `min-h-11 min-w-11 border px-4 text-sm transition-colors duration-200 ${active ? "border-ink bg-ink text-cream" : "border-[var(--line-light)]"} ${available ? "" : "text-ink-muted line-through"}`
                    }
                  >
                    {isSwatch ? <span className="h-8 w-8 rounded-full border border-[var(--line-light)]" style={{ background: val.swatch }} /> : val.value}
                    {isSwatch && !available && <span className="absolute h-px w-9 rotate-45 bg-ink" aria-hidden="true" />}
                  </motion.button>
                );
              })}
            </div>
            {opt.key === "tom" && <p className="mt-3 text-xs text-ink-muted" data-testid="shade-disclaimer">A cor pode variar conforme a tela do seu aparelho.</p>}
          </fieldset>
        );
      })}
    </div>
  );
}
