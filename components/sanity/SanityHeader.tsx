import { ArrowUpRight } from "lucide-react";
import { SanityHeaderActions } from "@/components/sanity/SanityHeaderActions";
import { SanityLogo } from "@/components/sanity/SanityLogo";
import { SavedJobsHeaderLink } from "@/components/jobs/SavedJobsHeaderLink";
import { NAMESPACE_PATH } from "@/constants/app";
import { SANITY_LINKS } from "@/data/sanity-defaults";

const jobsHomeHref = NAMESPACE_PATH ?? "/";

export const SanityHeader = () => {
  return (
    <header
      id="eden-header"
      className="sticky top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <SanityLogo
            imgClassName="h-9 w-auto sm:h-10"
            href={jobsHomeHref}
          />
          <a
            href={SANITY_LINKS.home}
            className="group inline-flex items-center gap-1 text-[13px] font-medium text-primary-900 transition-colors hover:text-primary-950 sm:text-sm"
          >
            <span className="truncate">Go to Eden.co.uk</span>
            <ArrowUpRight
              className="size-3.5 shrink-0 transition-transform group-hover:-translate-y-px group-hover:translate-x-px sm:size-4"
              aria-hidden
            />
          </a>
        </div>

        <ul className="flex shrink-0 items-center gap-3 sm:gap-5">
          <SavedJobsHeaderLink />
          <SanityHeaderActions />
        </ul>
      </div>
    </header>
  );
};
