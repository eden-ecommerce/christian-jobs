import { PostVacancyCTA } from "@components/jobs/components/PostVacancyCTA";

/** Compact page hero — title, subtitle and free-posting USP. */
export function JobsPageHero() {
  return (
    <section className="border-b border-[#E5E7EB]/80 bg-white">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="min-w-0 lg:flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2rem]">
              Find your Christian job
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Search roles at churches, charities and Christian organisations.
            </p>
          </div>

          <div className="w-full overflow-visible lg:w-auto lg:max-w-sm lg:shrink-0">
            <PostVacancyCTA />
          </div>
        </div>
      </div>
    </section>
  );
}
