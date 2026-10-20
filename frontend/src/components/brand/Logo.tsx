import { Link } from "react-router-dom";

export function CherryMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <path d="M14 14h30l-15 20z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M29 34v16M21 52h16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M33 22c2-6 7-9 12-9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="35" cy="25" r="4.2" fill="var(--cherry)" />
      <path d="M44 11c2-2 5-2 7 0-2 2-5 2-7 0z" fill="var(--cherry)" />
    </svg>
  );
}

export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 ${className}`} data-testid="logo-link" aria-label="Cherry Vibes — página inicial">
      <CherryMark className={`h-9 w-9 shrink-0 ${compact ? "hidden sm:block" : ""}`} />
      <span className="flex flex-col leading-none">
        <span className={`whitespace-nowrap font-serif tracking-[0.08em] font-light ${compact ? "text-xl" : "text-[1.45rem]"}`}>Cherry Vibes</span>
        {!compact && <span className="eyebrow mt-1 text-[0.55rem] opacity-80">Moda feminina e masculina</span>}
      </span>
    </Link>
  );
}
