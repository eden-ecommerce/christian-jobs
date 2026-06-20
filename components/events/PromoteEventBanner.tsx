"use client" // FavouritesCard reads localStorage via useFavourites

import { useFavourites } from "@lib/favourites/use-favourites";
import { ArrowRight, Heart, Megaphone } from "lucide-react";
import Link from "next/link";
import { NAMESPACE_PATH } from "@lib/config";

const PROMOTE_HREF = "https://hub.eden.co.uk/dashboard/event-journey";

/**
 * Prominent CTA encouraging event organisers to list their event for free.
 * Rendered on the home page, search page, and event detail page.
 */
export function PromoteEventBanner() {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Megaphone
            className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Promote your event — it&apos;s free
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Reach thousands of Christians looking for events near them. Add
              your event to the Eden directory in minutes.
            </p>
          </div>
        </div>
        <a
          href={PROMOTE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Add your event
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/**
 * Card shown alongside PromoteEventBanner when the user has saved events.
 * Reads localStorage — renders nothing until hydrated or when no favourites.
 */
export function FavouritesCard() {
  const { ids, hydrated } = useFavourites();

  if (!hydrated || ids.length === 0) return null;

  return (
    <Link
      href={`${NAMESPACE_PATH}/favourites`}
      className="flex flex-col justify-between rounded-xl border border-rose-200 bg-rose-50 px-6 py-5 transition-colors hover:border-rose-300 hover:bg-rose-100"
    >
      <div className="flex items-start gap-3">
        <Heart
          className="mt-0.5 h-5 w-5 shrink-0 fill-rose-500 text-rose-500"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Your saved events
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            You have{" "}
            <span className="font-medium text-rose-600">
              {ids.length} {ids.length === 1 ? "event" : "events"}
            </span>{" "}
            saved to your favourites.
          </p>
        </div>
      </div>
      <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-rose-600">
        View saved events <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </p>
    </Link>
  );
}

/**
 * Compact sidebar variant — fits inside the event detail aside panel.
 */
export function PromoteEventSidebarCta() {
  return (
    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Organising an event?
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        List your event for free and reach thousands of Christians.
      </p>
      <a
        href={PROMOTE_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Promote your event — free
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );
}
