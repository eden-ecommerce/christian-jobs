import type { Metadata } from "next";
import { Search } from "lucide-react";
import { NsLink } from "@components/ns-link";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { Breadcrumbs } from "@components/events/Breadcrumbs";
import { EventCard } from "@components/events/EventCard";
import { EventSearchFilters } from "@components/events/EventSearchFilters";
import { EventsActiveFilterBar } from "@components/events/EventsActiveFilterBar";
import { SearchPagination } from "@components/events/SearchPagination";
import { PortableText } from "@components/ui/PortableText";
import {
  searchEvents,
  type EventSort,
  type SearchEventsParams,
} from "@lib/algolia/events";
import { DEFAULT_LOCATION_RADIUS_METERS } from "@lib/algolia/constants";
import { dateFromMs, dateToMs } from "@lib/date-range";
import { NAMESPACE_PATH } from "@lib/config";
import { getSearchPageContent } from "@lib/sanity/get-search-page";
import { isSanityEnvConfigured } from "@lib/env-configured.server";

export const metadata: Metadata = {
  title: "Search Christian events",
};

type SearchParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const query = one(sp.q) ?? "";
  const place = one(sp.place) ?? "";
  const latRaw = one(sp.lat);
  const lngRaw = one(sp.lng);
  const category = one(sp.category);
  const org = one(sp.org);
  const onlineRaw = one(sp.online);
  const radiusRaw = one(sp.radius);
  const pageRaw = one(sp.page);
  const fromRaw = one(sp.from);
  const toRaw = one(sp.to);
  const sortRaw = one(sp.sort) as EventSort | undefined;

  const lat = latRaw ? Number(latRaw) : undefined;
  const lng = lngRaw ? Number(lngRaw) : undefined;
  const hasGeo =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng);

  const page = pageRaw ? Math.max(0, Number(pageRaw) - 1) : 0;
  const sort: EventSort = sortRaw ?? (hasGeo ? "distance" : "date_asc");

  const params: SearchEventsParams = {
    query,
    category,
    organisationType: org,
    sort,
    page,
    hitsPerPage: 12,
    dateFrom: dateFromMs(fromRaw),
    dateTo: dateToMs(toRaw),
  };
  if (hasGeo) {
    params.lat = lat;
    params.lng = lng;
    params.radiusMeters = radiusRaw
      ? Number(radiusRaw)
      : DEFAULT_LOCATION_RADIUS_METERS;
  }
  if (onlineRaw === "true") params.online = true;
  if (onlineRaw === "false") params.online = false;

  const [result, pageContent] = await Promise.all([
    searchEvents(params),
    isSanityEnvConfigured() ? getSearchPageContent() : Promise.resolve(null),
  ]);

  const headline = place
    ? `Events near ${place}`
    : query
      ? `Results for "${query}"`
      : pageContent?.title ?? "All Christian events";

  if (!result.configured) {
    return (
      <main className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: "Events", href: NAMESPACE_PATH }, { label: "Search" }]}
        />
        <div className="mt-8">
          <IntegrationEnvError integration="algolia" />
        </div>
      </main>
    );
  }

  const noResults = result.hits.length === 0;

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: "Events", href: NAMESPACE_PATH }, { label: "Search" }]}
      />

      {/* Sanity page title + markdown description */}
      <div className="mt-4 flex flex-col gap-1">
        <h1 className="text-pretty text-2xl font-bold text-foreground sm:text-3xl">
          {headline}
        </h1>
        {pageContent?.description ? (
          <div className="prose prose-sm max-w-2xl text-muted-foreground">
            <PortableText value={pageContent.description} />
          </div>
        ) : null}
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {result.nbHits.toLocaleString()}{" "}
          {result.nbHits === 1 ? "event" : "events"} found
        </p>
      </div>

      <div className="mt-3">
        <EventsActiveFilterBar />
      </div>

      {/* Filters on the left, results on the right — full width, minimal whitespace */}
      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <EventSearchFilters
          categories={result.facets.categories}
          categoryLvl1={result.facets.categoryLvl1}
          categoryLvl2={result.facets.categoryLvl2}
          categoryLvl3={result.facets.categoryLvl3}
          categoryLvl4={result.facets.categoryLvl4}
          organisationTypes={result.facets.organisationTypes}
          hasGeo={hasGeo}
        />

        <div>
          {noResults ? (
            <>
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-12 text-center">
                <Search
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-base font-medium text-foreground">
                  No events match your search
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Try widening your distance, clearing filters, or browsing by
                  region instead.
                </p>
                <NsLink
                  href={`${NAMESPACE_PATH}/browse`}
                  className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Browse by location
                </NsLink>
              </div>

              {/* Promoted event carousels when no results */}
              <NoResultsCarousels />
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {result.hits.map((event) => (
                  <EventCard key={event.objectID} event={event} />
                ))}
              </div>
              <SearchPagination
                page={result.page}
                nbPages={result.nbPages}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

/** Shown below the "no results" message — fetches a general set of upcoming events as a carousel. */
async function NoResultsCarousels() {
  const { hits } = await searchEvents({ hitsPerPage: 6 });
  if (hits.length === 0) return null;
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Upcoming events you might like
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {hits.map((event) => (
          <EventCard key={event.objectID} event={event} />
        ))}
      </div>
    </section>
  );
}
