"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NAMESPACE_PATH } from "@lib/config";

export function SearchPagination({
  page,
  nbPages,
}: {
  page: number;
  nbPages: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  if (nbPages <= 1) return null;

  const goTo = (nextPage: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(nextPage + 1));
    router.push(`${NAMESPACE_PATH}/search?${next.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page === 0}
        className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </button>
      <span className="px-2 text-sm text-muted-foreground">
        Page {page + 1} of {nbPages}
      </span>
      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page >= nbPages - 1}
        className="flex items-center gap-1 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
