"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { JobsHeroSearchTabsV8 } from "@components/jobs/browser/v8/JobsHeroSearchTabsV8";
import type { JobsLocationTabSubmit } from "@components/jobs/browser/v8/JobsLocationTabV8";
import { JobsHeroPageTitle } from "@components/jobs/browser/JobsHeroPageTitle";
import { JobsHeroTitleV3 } from "@components/jobs/browser/v3/JobsHeroTitleV3";
import { jobsHomepageContainerClassName } from "@components/jobs/browser/jobs-homepage-layout";
import { usePrefersReducedMotion } from "@hooks/jobs/use-prefers-reduced-motion";
import type { CategoryFacet } from "@lib/algolia/jobs";
import { publicAssetPath } from "@lib/config";
import { useLayoutEffect, useRef } from "react";

const POST_JOB_HREF = "https://hub.eden.co.uk/dashboard/job-journey";
const HERO_IMAGE = publicAssetPath("/assets/jobs/v5-hero/aerial-town-dusk.png");

type Props = {
  categories: CategoryFacet[];
  resultsPath: string;
  onLocationSearch: (values: JobsLocationTabSubmit) => void;
};

/**
 * V8 homepage hero — Category / Location tabs; Work Type lives inside Location.
 */
export function JobsHeroSectionV8({
  categories,
  resultsPath,
  onLocationSearch,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (reduceMotion) {
      root.classList.remove("jobs-hero-entering", "jobs-hero-enter-active");
      return;
    }

    root.classList.add("jobs-hero-entering");

    const frame = requestAnimationFrame(() => {
      root.classList.add("jobs-hero-enter-active");
    });

    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      className={`bg-[#fbfbfd] pb-6 pt-5 sm:pb-8 sm:pt-6 ${
        reduceMotion ? "" : "jobs-hero-entering"
      }`}
    >
      <div className={jobsHomepageContainerClassName}>
        <div className="jobs-hero-scale-in relative rounded-[24px] ring-1 ring-black/[0.06] sm:rounded-[28px] lg:rounded-[32px]">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
            aria-hidden="true"
          >
            <Image
              src={HERO_IMAGE}
              alt=""
              fill
              priority
              unoptimized
              className="object-cover object-center"
              sizes="(max-width: 1536px) 100vw, 1536px"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/65" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#235A0E]/35 via-transparent to-transparent" />
          </div>

          <div className="relative min-h-[440px] sm:min-h-[500px] lg:min-h-[580px]">
            <div className="relative flex min-h-[inherit] flex-col items-center justify-between px-5 py-8 text-center sm:px-8 sm:py-10 lg:px-12 lg:py-12">
              <div className="mx-auto max-w-2xl pt-2 sm:pt-4 lg:pt-6">
                <div className="jobs-hero-fade-up" style={{ animationDelay: "120ms" }}>
                  <JobsHeroPageTitle variant="onImage" />
                </div>

                <div className="jobs-hero-fade-up" style={{ animationDelay: "220ms" }}>
                  <JobsHeroTitleV3 variant="onImage" />
                </div>

                <p
                  className="jobs-hero-fade-up mx-auto mt-3 max-w-lg text-[17px] leading-relaxed text-white/85 sm:text-[18px] sm:leading-[1.45]"
                  style={{ animationDelay: "320ms" }}
                >
                  Find jobs at churches, Christian charities and organisations
                  across the UK.
                </p>
              </div>

              <div className="mt-8 w-full max-w-4xl sm:mt-10">
                <div
                  className="jobs-hero-fade-up"
                  style={{ animationDelay: "400ms" }}
                >
                  <JobsHeroSearchTabsV8
                    categories={categories}
                    resultsPath={resultsPath}
                    onLocationSearch={onLocationSearch}
                  />
                </div>

                <a
                  href={POST_JOB_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jobs-hero-fade-up group mt-4 inline-flex items-center gap-1 text-[15px] font-medium text-white/90 transition-colors hover:text-white"
                  style={{ animationDelay: "520ms" }}
                >
                  Post a vacancy — it&apos;s absolutely free
                  <ChevronRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
