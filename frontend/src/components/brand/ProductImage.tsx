import type { ProductImage as ProductImageType } from "../../types/catalog";
import { CherryMark } from "./Logo";

export function ExampleBadge({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span
      data-testid="example-badge"
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.2em] ${dark ? "border-blossom/50 text-blossom" : "border-cherry/40 text-cherry"} ${className}`}
      title="Produto provisório, usado só para montar a loja"
    >
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
      Exemplo
    </span>
  );
}

interface ProductImageProps {
  image: ProductImageType;
  priority?: boolean;
  className?: string;
  sizes?: string;
  showLabel?: boolean;
}

const isLightTint = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
};

export function ProductImage({ image, priority = false, className = "", sizes = "(min-width: 1024px) 25vw, 50vw", showLabel = true }: ProductImageProps) {
  if (image.src) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        width={800}
        height={1000}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`block aspect-[4/5] h-auto w-full object-cover ${className}`}
      />
    );
  }
  const tone = isLightTint(image.tint) ? "text-ink/70" : "text-cream/80";
  return (
    <div
      role="img"
      aria-label={image.alt}
      data-testid="product-image-placeholder"
      className={`relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden ${tone} ${className}`}
      style={{ background: `linear-gradient(160deg, color-mix(in oklch, ${image.tint} 55%, white) 0%, color-mix(in oklch, ${image.tint} 85%, #1c1217) 100%)` }}
    >
      <CherryMark className="h-[22%] w-[22%]" />
      {showLabel && <span className="absolute inset-x-0 bottom-3 text-center text-[0.6rem] uppercase tracking-[0.22em]">Foto provisória</span>}
    </div>
  );
}
