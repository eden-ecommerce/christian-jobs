"use client";

import { EventCard } from "@components/events/EventCard";
import { NsLink } from "@components/ns-link";
import { useFavourites } from "@lib/favourites/use-favourites";
import { NAMESPACE_PATH, apiUrl } from "@lib/config";
import type { EventHit } from "@lib/algolia/events";
import { Heart, Loader2 } from "lucide-react";
import useSWR from "swr";

async function fetchFavourites(ids: string[]): Promise<EventHit[]> {
  if (ids.length === 0) return [];
  // API_BASE_URL already includes the /events prefix in production, so the
  // path here is just "/api/favourites" (no namespace duplication).
  const res = await fetch(apiUrl("/api/favourites"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.events as EventHit[];
}

export function FavouritesPageClient() {
  const { ids, hydrated } = useFavourites();

  const { data: events, isLoading } = useSWR(
    hydrated && ids.length > 0 ? ["favourites", ...ids] : null,
    () => fetchFavourites(ids),
    { revalidateOnFocus: false },
  );

  if (!hydrated || (isLoading && ids.length > 0)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-sm">Loading saved events...</span>
      </div>
    );
  }

  if (ids.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Heart className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-foreground">No saved events yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the heart on any event to save it here.
          </p>
        </div>
        <NsLink
          href={NAMESPACE_PATH}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse events
        </NsLink>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {(events ?? []).map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
