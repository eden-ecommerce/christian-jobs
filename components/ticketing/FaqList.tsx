import { Plus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-2xl border border-border bg-card px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span className="font-serif text-base font-semibold text-foreground">
              {item.question}
            </span>
            <Plus className="size-4 shrink-0 text-primary transition-transform group-open:rotate-45" />
          </summary>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
