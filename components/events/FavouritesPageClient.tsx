"use client";

import { useEffect, useState } from "react";
import { EventCard } from "@components/events/EventCard";
import { NsLink } from "@components/ns-link";
import { useFavourites } from "@lib/favourites/use-favourites";
import { NAMESPACE_PATH } from "@lib/config";
import { cn } from "@lib/utils";
import type { EventHit } from "@lib/algolia/events";
import { Heart, Loader2 } from "lucide-react";
import useSWR from "swr";

async function fetchFavourites(ids: string[]): Promise<EventHit[]> {
  if (ids.length === 0) return [];
  // Root-relative, namespaced URL. The favourites route lives under the
  // namespace (app/events/api/favourites) because the Cloudflare Worker only
  // forwards /events/* to this deployment — a top-level /api/* path is
  // unreachable through the eden.co.uk proxy. A relative URL resolves against
  // the current page origin in every environment:
  //   dev  -> http://localhost:3000/events/api/favourites
  //   prod -> https://www.eden.co.uk/events/api/favourites
  const res = await fetch(`${NAMESPACE_PATH}/api/favourites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.events as EventHit[];
}

/**
 * Wraps an EventCard on the favourites page. When the user un-favourites this
 * event (its heart is toggled off anywhere), the card plays a fun shrink + fade
 * exit animation, then notifies the parent to remove it from the list.
 */
function FavouriteEventCard({
  event,
  onRemoved,
}: {
  event: EventHit;
  onRemoved: (id: string) => void;
}) {
  const { isFav } = useFavourites();
  const [leaving, setLeaving] = useState(false);

  const favoured = isFav(event.id);

  useEffect(() => {
    if (!favoured) setLeaving(true);
  }, [favoured]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        leaving
          ? "scale-90 -rotate-2 opacity-0"
          : "scale-100 rotate-0 opacity-100",
      )}
      onTransitionEnd={() => {
        if (leaving) onRemoved(event.id);
      }}
      aria-hidden={leaving}
    >
      <EventCard event={event} />
    </div>
  );
}

export function FavouritesPageClient() {
  const { ids, hydrated } = useFavourites();

  const { data: events, isLoading } = useSWR(
    hydrated && ids.length > 0 ? ["favourites", ...ids] : null,
    () => fetchFavourites(ids),
    { revalidateOnFocus: false },
  );

  // Displayed list is decoupled from `ids`/SWR so a removed card stays mounted
  // long enough to animate out. New fetched events are appended; removals are
  // handled by each card's exit animation via handleRemoved.
  const [displayed, setDisplayed] = useState<EventHit[]>([]);

  useEffect(() => {
    if (!events) return;
    setDisplayed((prev) => {
      const seen = new Set(prev.map((e) => e.id));
      const additions = events.filter((e) => !seen.has(e.id));
      return additions.length > 0 ? [...prev, ...additions] : prev;
    });
  }, [events]);

  const handleRemoved = (id: string) => {
    setDisplayed((prev) => prev.filter((e) => e.id !== id));
  };

  // Initial loading: only while we have favourites but nothing rendered yet.
  if (!hydrated || (isLoading && ids.length > 0 && displayed.length === 0)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-sm">Loading saved events...</span>
      </div>
    );
  }

  // Empty state: no favourites left and nothing animating out.
  if (ids.length === 0 && displayed.length === 0) {
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
      {displayed.map((event) => (
        <FavouriteEventCard
          key={event.id}
          event={event}
          onRemoved={handleRemoved}
        />
      ))}
    </div>
  );
}
