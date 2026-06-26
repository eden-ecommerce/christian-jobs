"use client";

import { JobDetailPanel, type JobDetailData } from "@components/jobs/browser/JobDetailPanel";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  data: JobDetailData | null;
  loading: boolean;
  error?: string | null;
  selectedId?: string;
  onClose: () => void;
  onSelectSimilar?: (jobId: string) => void;
  onPrefetch?: (jobId: string) => void;
};

/** Full-screen mobile job detail with slide-in animation. */
export function JobsMobileDetail({
  open,
  data,
  loading,
  error,
  selectedId,
  onClose,
  onSelectSimilar,
  onPrefetch,
}: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#F9FAFB] md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Job details"
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          aria-label="Back to job list"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
      </div>

      <div className="min-h-0 flex-1 animate-in slide-in-from-right duration-300">
        <JobDetailPanel
          data={data}
          loading={loading}
          error={error}
          selectedId={selectedId}
          onSelectSimilar={onSelectSimilar}
          onPrefetch={onPrefetch}
        />
      </div>
    </div>
  );
}
