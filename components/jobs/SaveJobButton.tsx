"use client";

import { useSavedJobs } from "@lib/jobs/use-saved-jobs";
import { Bookmark } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  jobId: string;
  /** "icon" = small icon only (card), "full" = icon + label (detail page) */
  variant?: "icon" | "full";
  className?: string;
};

export function SaveJobButton({ jobId, variant = "icon", className = "" }: Props) {
  const { hydrated, toggle, isSaved } = useSavedJobs();
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const confirmationTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(
    () => () => {
      if (confirmationTimeoutRef.current) {
        window.clearTimeout(confirmationTimeoutRef.current);
      }
    },
    [],
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const wasSaved = hydrated && isSaved(jobId);
    toggle(jobId);

    const message = wasSaved ? "Removed from saved jobs" : "Job saved";
    setConfirmation(message);
    if (confirmationTimeoutRef.current) {
      window.clearTimeout(confirmationTimeoutRef.current);
    }
    confirmationTimeoutRef.current = window.setTimeout(() => {
      setConfirmation(null);
    }, 2500);
  };

  const saved = hydrated && isSaved(jobId);

  if (variant === "full") {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={handleClick}
          aria-label={saved ? "Remove from saved jobs" : "Save this job"}
          aria-pressed={saved}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            saved
              ? "bg-primary/10 text-primary hover:bg-primary/20"
              : "border border-border bg-card text-foreground hover:border-primary hover:text-primary"
          } ${className}`}
        >
          <Bookmark
            className="h-4 w-4"
            fill={saved ? "currentColor" : "none"}
            aria-hidden="true"
          />
          {saved ? "Saved" : "Save job"}
        </button>
        {confirmation ? (
          <p
            role="status"
            aria-live="polite"
            className="absolute left-0 top-full z-10 mt-2 whitespace-nowrap rounded-md bg-[#235A0E] px-3 py-1.5 text-xs font-medium text-white shadow-sm"
          >
            {confirmation}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? "Remove from saved jobs" : "Save this job"}
        aria-pressed={saved}
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors ${
          saved
            ? "bg-[#2d6a4f] text-white"
            : "bg-[#F3F4F6] text-muted-foreground hover:bg-[#E5E7EB] hover:text-[#2d6a4f]"
        } ${className}`}
      >
        <Bookmark
          className="h-4 w-4"
          fill={saved ? "currentColor" : "none"}
          aria-hidden="true"
        />
      </button>
      {confirmation ? (
        <p
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute right-0 top-full z-20 mt-2 whitespace-nowrap rounded-md bg-[#235A0E] px-2.5 py-1 text-[11px] font-medium text-white shadow-sm"
        >
          {confirmation}
        </p>
      ) : null}
    </div>
  );
}
