import { isSanityEnvConfigured } from "@lib/env-configured.server";
import { getFooter } from "@eden-ecommerce/lib/sanity/get-footer";
import { SANITY_FOOTER_DEFAULTS } from "@/data/sanity-defaults";
import { SanityPreFooter } from "@/components/sanity/SanityPreFooter";

export const SanityPreFooterSection = async () => {
  const liveFooter = isSanityEnvConfigured() ? await getFooter() : null;

  return (
    <SanityPreFooter
      socialProofHeading={
        liveFooter?.socialProofHeading ?? SANITY_FOOTER_DEFAULTS.socialProofHeading
      }
      socialProofSubheading={
        liveFooter?.socialProofSubheading ?? SANITY_FOOTER_DEFAULTS.socialProofSubheading
      }
    />
  );
};
