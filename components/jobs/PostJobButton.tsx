import { Plus } from "lucide-react";

export const POST_JOB_HREF = "https://hub.eden.co.uk/dashboard/job-journey";

/** Compact post-a-vacancy CTA for headers and toolbars. */
export function PostJobButton() {
  return (
    <a
      href={POST_JOB_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#2d6a4f] px-3 py-1.5 text-xs font-semibold text-white shadow-soft-sm transition-opacity hover:opacity-90"
    >
      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      Post
    </a>
  );
}
