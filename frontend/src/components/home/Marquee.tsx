import { CherryIcon } from "../brand/CherryIcon";

const words = ["Cherry Vibes", "Moda feminina e masculina", "Maquiagem", "Cosméticos", "Acessórios", "Calçados", "Noite de coquetel"];

export function Marquee() {
  const row = [...words, ...words];
  return (
    <div className="theme-dark overflow-hidden border-y border-[var(--line-dark)] py-5" aria-hidden="true" data-testid="brand-marquee">
      <div className="marquee-track gap-10">
        {row.map((w, i) => (
          <span key={i} className="inline-flex items-center gap-10 whitespace-nowrap font-serif text-2xl font-light tracking-[0.06em] text-cream/80 md:text-3xl">
            {w}
            <CherryIcon className="h-4 w-4 text-cherry" filled />
          </span>
        ))}
      </div>
    </div>
  );
}
