"use client";

import { ChevronRight } from "lucide-react";
import { JobsHeroSearchV3 } from "@components/jobs/browser/v3/JobsHeroSearchV3";
import { JobsHeroImageV3 } from "@components/jobs/browser/v3/JobsHeroImageV3";
import { JobsHeroLiveJobsRoundelV3 } from "@components/jobs/browser/v3/JobsHeroLiveJobsRoundelV3";
import { JobsHeroTitleV3 } from "@components/jobs/browser/v3/JobsHeroTitleV3";

const POST_JOB_HREF = "https://hub.eden.co.uk/dashboard/job-journey";

type Props = {
  onSearch: (
    query: string,
    location: { label: string; lat?: number; lng?: number },
  ) => void;
};

/**
 * V3 homepage hero — editorial split, image bleeds right, calm Apple-like rhythm.
 */
export function JobsHeroSectionV3({ onSearch }: Props) {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfd]">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-[#235A0E]/[0.04] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[#86868b]/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:mx-0 lg:max-w-none lg:px-0">
        <div className="relative grid items-center gap-6 py-8 sm:gap-8 sm:py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 lg:h-[calc(100svh-180px-20px)] lg:min-h-0 lg:py-8 xl:gap-16">
          <div className="relative z-10 min-w-0 w-full lg:pl-8 xl:pl-12 2xl:pl-16">
            <div className="max-w-xl lg:max-w-[540px] xl:max-w-[580px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#235A0E]">
                Christian Jobs
              </p>

              <JobsHeroTitleV3 />

              <p className="mt-4 max-w-md text-[18px] leading-relaxed text-[#6e6e73] sm:text-[19px] sm:leading-[1.45]">
                Find jobs at churches, Christian charities and organisations
                across the UK.
              </p>
            </div>

            <div className="mt-7 w-full sm:mt-8">
              <JobsHeroSearchV3 query="" location="" onSearch={onSearch} />
            </div>

            <a
              href={POST_JOB_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-1 text-[15px] font-medium text-[#235A0E] transition-colors hover:text-[#1a4509]"
            >
              Post a vacancy — it&apos;s absolutely free
              <ChevronRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>

          <div className="relative lg:h-full lg:min-h-0">
            <JobsHeroLiveJobsRoundelV3 className="right-[6%] top-[10%] sm:right-[10%] sm:top-[14%] lg:-left-5 lg:right-auto lg:top-[16%] xl:-left-7 xl:top-[14%]" />
            <JobsHeroImageV3 />
          </div>
        </div>
      </div>
    </section>
  );
}
