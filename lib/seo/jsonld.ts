/**
 * schema.org JSON-LD builders for Eden Events.
 *
 * All types follow https://schema.org/Event and are validated against
 * Google's Rich Results requirements:
 * https://developers.google.com/search/docs/appearance/structured-data/event
 */

import type { EventHit } from "@lib/algolia/events";

const EDEN_URL = "https://www.eden.co.uk";
const EVENTS_URL = `${EDEN_URL}/events`;

/** Build a schema.org Event object for a single EventHit. */
export function buildEventJsonLd(event: EventHit): Record<string, unknown> {
  // Attendance mode
  const attendanceMode = event.online
    ? "https://schema.org/OnlineEventAttendanceMode"
    : "https://schema.org/OfflineEventAttendanceMode";

  // Location
  const location = event.online
    ? {
        "@type": "VirtualLocation",
        url: event.externalUrl ?? EDEN_URL,
      }
    : {
        "@type": "Place",
        name: event.locationName ?? undefined,
        address: {
          "@type": "PostalAddress",
          streetAddress: event.locationStreet ?? undefined,
          addressLocality: event.locationCity ?? undefined,
          addressRegion: event.locationState ?? undefined,
          postalCode: event.locationPostalCode ?? undefined,
          addressCountry: event.locationCountry ?? "GB",
        },
        ...(event.lat != null && event.lng != null
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: event.lat,
                longitude: event.lng,
              },
            }
          : {}),
      };

  // Offers
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    url: event.externalUrl ?? `${EVENTS_URL}/${event.id}`,
    availability: "https://schema.org/InStock",
  };
  if (event.price) {
    const numericPrice = parseFloat(event.price.replace(/[^0-9.]/g, ""));
    if (!isNaN(numericPrice)) {
      offers.price = numericPrice;
      offers.priceCurrency = "GBP";
    }
    if (/free/i.test(event.price)) {
      offers.price = 0;
      offers.priceCurrency = "GBP";
    }
  }

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description?.slice(0, 500) || undefined,
    url: `${EVENTS_URL}/${event.id}`,
    eventAttendanceMode: attendanceMode,
    eventStatus: "https://schema.org/EventScheduled",
    location,
    offers,
  };

  if (event.date) ld.startDate = event.date;
  if (event.endDate) ld.endDate = event.endDate;
  if (event.thumbnailUrl) ld.image = [event.thumbnailUrl];

  if (event.organisationName) {
    ld.organizer = {
      "@type": "Organization",
      name: event.organisationName,
      url: event.organisationSlug
        ? `${EDEN_URL}/o/${event.organisationSlug}`
        : EDEN_URL,
    };
  }

  return ld;
}

/** Build a schema.org ItemList for a list of events (used on listing pages). */
export function buildEventListJsonLd(
  events: EventHit[],
  listName: string,
  listUrl: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: listUrl,
    numberOfItems: events.length,
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${EVENTS_URL}/${event.id}`,
      name: event.title,
    })),
  };
}

/** Build a BreadcrumbList JSON-LD from an array of { name, url } pairs. */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Render a JSON-LD script tag. Pass the output to <script> in a Next.js page. */
export function jsonLdScriptProps(
  data: Record<string, unknown>
): { type: string; dangerouslySetInnerHTML: { __html: string } } {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  };
}
