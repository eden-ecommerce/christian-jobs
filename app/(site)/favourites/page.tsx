import { FavouritesPageClient } from "@components/events/FavouritesPageClient";
import { NsLink } from "@components/ns-link";
import { NAMESPACE_PATH } from "@lib/config";
import type { Metadata } from "next";
import { ArrowLeft, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Your Saved Events",
  description: "Christian events you have saved on Eden.co.uk.",
  robots: { index: false, follow: true },
};

export default function FavouritesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Back link */}
      <NsLink
        href={NAMESPACE_PATH}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to events
      </NsLink>

      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100">
          <Heart className="h-5 w-5 fill-rose-500 text-rose-500" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your saved events</h1>
          <p className="text-sm text-muted-foreground">
            Events you&apos;ve hearted — saved on this device.
          </p>
        </div>
      </div>

      <FavouritesPageClient />
    </main>
  );
}
