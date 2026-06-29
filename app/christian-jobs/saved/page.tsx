import { SavedJobsPageClient } from "@components/jobs/SavedJobsPageClient";
import { NAMESPACE_PATH } from "@lib/config";
import { NsLink } from "@components/ns-link";
import type { Metadata } from "next";
import { ArrowLeft, Bookmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Saved Jobs",
  description: "Christian jobs you have saved on Eden.co.uk.",
  robots: { index: false, follow: true },
};

export default function SavedJobsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Back link */}
      <NsLink
        href={NAMESPACE_PATH ?? "/christian-jobs"}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to jobs
      </NsLink>

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Bookmark className="h-5 w-5 fill-primary text-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your saved jobs</h1>
          <p className="text-sm text-muted-foreground">
            Jobs you&apos;ve bookmarked — saved on this device.
          </p>
        </div>
      </div>

      <SavedJobsPageClient />
    </main>
  );
}
