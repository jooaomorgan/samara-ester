import { motion, useReducedMotion } from "framer-motion";
import { useFavorites } from "../../store/favorites";

export function CherryIcon({ filled, className = "h-5 w-5" }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M12 3c2 3 5 4 8 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 3c-1 4-4 7-4 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 3c2 4 4 7 4 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="16" r="4" fill={filled ? "var(--cherry)" : "none"} stroke="currentColor" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="4" fill={filled ? "var(--cherry)" : "none"} stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function FavoriteButton({ productId, name, className = "" }: { productId: string; name: string; className?: string }) {
  const { has, toggle } = useFavorites();
  const reduce = useReducedMotion();
  const active = has(productId);
  return (
    <motion.button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productId); }}
      whileTap={reduce ? undefined : { scale: 0.85 }}
      aria-pressed={active}
      aria-label={active ? `Remover ${name} dos favoritos` : `Adicionar ${name} aos favoritos`}
      data-testid={`favorite-toggle-${productId}`}
      className={`grid h-11 w-11 place-items-center rounded-full border border-[var(--line-light)] bg-cream/85 text-ink backdrop-blur-sm transition-colors duration-200 ${active ? "text-cherry" : ""} ${className}`}
    >
      <motion.span key={String(active)} initial={reduce ? false : { scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 18 }} className="grid place-items-center">
        <CherryIcon filled={active} />
      </motion.span>
    </motion.button>
  );
}
