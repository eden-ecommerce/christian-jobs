import type { InfoBarItem } from "@eden-ecommerce/common/blocks/Header";
import type { Header } from "@eden-ecommerce/lib/sanity/get-header";
import type { LogoVariant } from "@eden-ecommerce/lib/sanity/header-types";
import type { MobileMegaNavItem } from "@eden-ecommerce/common/blocks/Navigation";
import { HEADER_MEGA_NAV_ENABLED, SANITY_HEADER_DEFAULTS, type SanityHeaderInfo } from "@/data/sanity-defaults";

export type MergedHeader = {
  phoneNumber: string;
  openHour: string;
  logoVariant: LogoVariant;
  socialProofRating: number;
  socialProofMaxRating: number;
  headerInfo: SanityHeaderInfo[];
  navigationBar: NonNullable<Header>["navigationBar"];
};

export const mergeHeaderWithDefaults = (liveHeader: Header | null): MergedHeader => {
  const defaults = SANITY_HEADER_DEFAULTS;

  return {
    phoneNumber: liveHeader?.phoneNumber ?? defaults.phoneNumber,
    openHour: liveHeader?.openHour ?? defaults.openHour,
    logoVariant: liveHeader?.logoVariant ?? defaults.logoVariant,
    socialProofRating: liveHeader?.socialProofRating ?? defaults.socialProofRating,
    socialProofMaxRating: liveHeader?.socialProofMaxRating ?? defaults.socialProofMaxRating,
    headerInfo:
      liveHeader?.headerInfo && liveHeader.headerInfo.length > 0 ?
        liveHeader.headerInfo
      : defaults.headerInfo,
    navigationBar:
      liveHeader?.navigationBar && liveHeader.navigationBar.length > 0 ?
        liveHeader.navigationBar
      : defaults.navigationBar.map((item) => ({
          text: item.text,
          href: item.link,
          textColour: item.textColour,
          megaNav: null,
        })),
  };
};

export const buildInfoBarItems = (
  header: MergedHeader,
  slots: {
    freeIcon: InfoBarItem["iconSlot"];
    ukIcon: InfoBarItem["iconSlot"];
    churchIcon: InfoBarItem["iconSlot"];
    trustpilotStarIcon: InfoBarItem["iconSlot"];
    trustpilotSmallStarIcon: InfoBarItem["iconSlot"];
    trustpilotHeading: InfoBarItem["heading"];
    trustpilotSubheading: InfoBarItem["subheading"];
  },
): InfoBarItem[] => [
  {
    heading: header.headerInfo[0]?.heading ?? SANITY_HEADER_DEFAULTS.headerInfo[0].heading,
    subheading: header.headerInfo[0]?.subheading ?? SANITY_HEADER_DEFAULTS.headerInfo[0].subheading,
    iconSlot: slots.freeIcon,
  },
  {
    heading: header.headerInfo[1]?.heading ?? SANITY_HEADER_DEFAULTS.headerInfo[1].heading,
    subheading: header.headerInfo[1]?.subheading ?? SANITY_HEADER_DEFAULTS.headerInfo[1].subheading,
    iconSlot: slots.ukIcon,
  },
  {
    heading: header.headerInfo[2]?.heading ?? SANITY_HEADER_DEFAULTS.headerInfo[2].heading,
    subheading: header.headerInfo[2]?.subheading ?? SANITY_HEADER_DEFAULTS.headerInfo[2].subheading,
    iconSlot: slots.churchIcon,
  },
  {
    heading: slots.trustpilotHeading,
    subheading: slots.trustpilotSubheading,
    iconSlot: slots.trustpilotStarIcon,
  },
];

export const mapNavForMobileMegaNav = (
  items: MergedHeader["navigationBar"],
): MobileMegaNavItem[] =>
  items.map((item) => ({
    text: item.text,
    href: item.href,
    textColour: item.textColour,
    megaNavBlocks:
      HEADER_MEGA_NAV_ENABLED
        ? (item.megaNav?.megaNavBlocks ?? []).map((block) => ({
            heading: block.heading,
            bottomLink: block.bottomLink,
            childLinks: block.childLinks.map((child) => ({
              text: child.text,
              href: child.href,
            })),
          }))
        : [],
  }));
