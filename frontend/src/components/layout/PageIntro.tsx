import type { ReactNode } from "react";
import { Reveal } from "../motion/Reveal";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}

export function PageIntro({ eyebrow, title, lead, children }: PageIntroProps) {
  return (
    <section className="theme-dark relative grain overflow-hidden">
      <div className="container-x py-16 md:py-24">
        <Reveal>
          {eyebrow && <p className="eyebrow text-blossom">{eyebrow}</p>}
          <h1 className="display mt-4 text-4xl sm:text-5xl lg:text-6xl" data-testid="page-title">{title}</h1>
          {lead && <p className="mt-6 max-w-xl text-base text-cream/75 md:text-lg">{lead}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
