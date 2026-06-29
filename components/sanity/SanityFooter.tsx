import Image from "next/image";
import { Footer } from "@eden-ecommerce/common/blocks/Footer";
import {
  SANITY_ASSETS,
  SANITY_FOOTER_DEFAULTS,
  SANITY_SOCIAL_LINKS,
} from "@/data/sanity-defaults";
import {
  mapLiveFooterInfoItems,
  mapStaticFooterInfoItems,
} from "@/components/sanity/map-footer-props";
import { SanityLogo } from "@/components/sanity/SanityLogo";
import { isSanityEnvConfigured } from "@lib/env-configured.server";
import { getFooter } from "@eden-ecommerce/lib/sanity/get-footer";

const socialIcons = {
  facebook: SANITY_ASSETS.facebook,
  twitter: SANITY_ASSETS.twitter,
} as const;

export const SanityFooter = async () => {
  const liveFooter = isSanityEnvConfigured() ? await getFooter() : null;

  const footerLinks = liveFooter?.footerLinks ?? SANITY_FOOTER_DEFAULTS.footerLinks;
  const footerInfo = liveFooter
    ? mapLiveFooterInfoItems(liveFooter.footerInfo)
    : mapStaticFooterInfoItems(SANITY_FOOTER_DEFAULTS.footerInfo);

  return (
    <Footer
      footerLinks={footerLinks}
      footerInfo={footerInfo}
      logoSlot={<SanityLogo lazyLoad />}
      socialSlot={
        <ul className="flex w-full justify-end gap-2">
          {SANITY_SOCIAL_LINKS.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                className="flex size-8 items-center justify-center rounded-full border border-copy-300"
              >
                <Image
                  unoptimized
                  src={socialIcons[link.type]}
                  height={16}
                  width={16}
                  alt={link.type}
                  loading="lazy"
                  className="max-h-4 max-w-4 p-0 text-copy-950"
                />
              </a>
            </li>
          ))}
        </ul>
      }
    />
  );
};
