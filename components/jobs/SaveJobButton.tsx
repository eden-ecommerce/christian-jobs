"use client";

import { useSavedJobs } from "@lib/jobs/use-saved-jobs";
import { Bookmark } from "lucide-react";

type Props = {
  jobId: string;
  /** "icon" = small icon only (card), "full" = icon + label (detail page) */
  variant?: "icon" | "full";
  className?: string;
};

export function SaveJobButton({ jobId, variant = "icon", className = "" }: Props) {
  const { hydrated, toggle, isSaved } = useSavedJobs();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(jobId);
  };

  const saved = hydrated && isSaved(jobId);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={saved ? "Remove from saved jobs" : "Save this job"}
        aria-pressed={saved}
        className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
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
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved jobs" : "Save this job"}
      aria-pressed={saved}
      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
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
  );
}
