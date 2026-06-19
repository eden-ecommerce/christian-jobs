import { EventCard } from "@components/events/EventCard";
import { HomeLocationSearch } from "@components/events/HomeLocationSearch";
import { IntegrationEnvError } from "@components/common/IntegrationEnvError";
import { NsLink } from "@components/ns-link";
import { buttonVariants } from "@components/ui/button";
import { NAMESPACE_PATH } from "@lib/config";
import { getCategoryFacets, searchEvents } from "@lib/algolia/events";
import { getLocationStats, getRegions } from "@lib/locations";
import { ArrowRight, MapPin, Search } from "lucide-react";

export const revalidate = 1800;

export default async function EventsHomePage() {
  const [upcoming, { categories, totalCount, uncategorisedCount }] = await Promise.all([
    searchEvents({ hitsPerPage: 6 }),
    getCategoryFacets(),
  ]);

  const regions = getRegions();
  const stats = getLocationStats();

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-border bg-accent/40">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary">
            <MapPin className="h-3.5 w-3.5" /> UK Christian Events Directory
          </span>
          <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Find Christian events happening near you
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Conferences, training, worship nights and community gatherings from
            churches and charities across the UK. Search by town or browse by
            region.
          </p>

          <div className="mx-auto mt-8 max-w-2xl">
            <HomeLocationSearch />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Browsing {stats.towns.toLocaleString()} towns across {stats.regions}{" "}
            UK nations and {stats.counties} counties.
          </p>
          <div className="mt-4">
            <NsLink
              href={`${NAMESPACE_PATH}/search`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Search className="h-4 w-4" />
              Advanced search
            </NsLink>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Categories */}
        {categories.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-foreground">
              Browse by category
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {/* See All chip */}
              <NsLink
                href={`${NAMESPACE_PATH}/search`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                See all
                <span className="text-xs text-muted-foreground">{totalCount}</span>
              </NsLink>

              {categories.map((cat) => (
                <NsLink
                  key={cat.value}
                  href={`${NAMESPACE_PATH}/search?category=${encodeURIComponent(cat.value)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {cat.label}
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                </NsLink>
              ))}

              {/* Uncategorised chip — only shown when there are events without a category */}
              {uncategorisedCount > 0 ? (
                <NsLink
                  href={`${NAMESPACE_PATH}/search?uncategorised=true`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Uncategorised
                  <span className="text-xs text-muted-foreground">{uncategorisedCount}</span>
                </NsLink>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Browse by region */}
        <section className="mb-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Browse by location
            </h2>
            <NsLink
              href={`${NAMESPACE_PATH}/browse`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              All locations <ArrowRight className="h-4 w-4" />
            </NsLink>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {regions.map((region) => (
              <NsLink
                key={region.slug}
                href={`${NAMESPACE_PATH}/browse/${region.slug}`}
                className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary"
              >
                <span className="text-base font-semibold text-foreground">
                  {region.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  {region.counties.length} counties
                </span>
              </NsLink>
            ))}
          </div>
        </section>

        {/* Upcoming events */}
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming events
            </h2>
            <NsLink
              href={`${NAMESPACE_PATH}/search`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              See all <ArrowRight className="h-4 w-4" />
            </NsLink>
          </div>

          {upcoming.hits.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.hits.map((event) => (
                <EventCard key={event.objectID} event={event} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-border p-10 text-center">
              {upcoming.configured ? (
                <p className="text-sm text-muted-foreground">
                  No events to show right now. Please check back soon.
                </p>
              ) : (
                <IntegrationEnvError integration="algolia" className="border-0 bg-transparent" />
              )}
              <NsLink
                href={`${NAMESPACE_PATH}/browse`}
                className={`${buttonVariants({ variant: "outline" })} mt-4`}
              >
                Browse by location
              </NsLink>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
