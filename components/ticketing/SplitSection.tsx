import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@lib/utils";

type SplitSectionProps = {
  reverse?: boolean;
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  media: ReactNode;
  footer?: ReactNode;
};

/** Alternating two-column feature row that hosts any media (phone or browser). */
export function SplitSection({
  reverse,
  eyebrow,
  title,
  description,
  bullets,
  media,
  footer,
}: SplitSectionProps) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn("flex justify-center", reverse ? "lg:order-2" : "lg:order-1")}>
        {media}
      </div>

      <div className={cn(reverse ? "lg:order-1" : "lg:order-2")}>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
        <h2 className="mt-3 text-balance font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
        {bullets && bullets.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-3">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-foreground">{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {footer ? <div className="mt-7">{footer}</div> : null}
      </div>
    </div>
  );
}
