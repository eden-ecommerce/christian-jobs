import Image from "next/image";
import { Phone } from "lucide-react";
import { Header, InfoBar } from "@eden-ecommerce/common/blocks/Header";
import { MobileMegaNav } from "@eden-ecommerce/common/blocks/Navigation";
import { SanityDesktopMegaNav } from "@/components/sanity/SanityDesktopMegaNav";
import { HeaderChromeProvider } from "@/components/sanity/header-chrome-context";
import { SanityHeaderActions } from "@/components/sanity/SanityHeaderActions";
import {
  SANITY_ASSETS,
  SANITY_LINKS,
} from "@/data/sanity-defaults";
import {
  buildInfoBarItems,
  mapNavForMobileMegaNav,
  mergeHeaderWithDefaults,
} from "@/components/sanity/map-header-props";
import { mapNavForDesktopMegaNav } from "@/components/sanity/map-nav-for-meganav";
import { SanityHeaderSearch } from "@/components/sanity/SanityHeaderSearch";
import { SanityLogo } from "@/components/sanity/SanityLogo";
// import { isSanityEnvConfigured } from "@lib/env-configured.server";
// import { getHeader } from "@lib/sanity/get-header";

export const SanityHeader = async () => {
  // @todo Re-enable when CMS navigationBar is ready to ship.
  // const liveHeader = isSanityEnvConfigured() ? await getHeader() : null;
  const liveHeader = null;
  const header = mergeHeaderWithDefaults(liveHeader);
  const mobileNavItems = mapNavForMobileMegaNav(header.navigationBar);

  return (
    <HeaderChromeProvider>
    <Header
      phoneNumber={header.phoneNumber}
      openHour={header.openHour}
      phoneIconSlot={<Phone className="size-8 shrink-0 text-primary-900" aria-hidden />}
      infoBarSlot={
        <InfoBar
          trustpilotRating={header.socialProofRating}
          trustpilotMaxRating={header.socialProofMaxRating}
          trustpilotMobileSlot={
            <Image
              src={SANITY_ASSETS.trustpilotMobile}
              width={97}
              height={25}
              alt="On Trustpilot"
              unoptimized
            />
          }
          infos={buildInfoBarItems(header, {
            freeIcon: (
              <Image src={SANITY_ASSETS.free} width={28} height={28} alt="Free" priority unoptimized />
            ),
            ukIcon: (
              <Image src={SANITY_ASSETS.uk} width={28} height={28} alt="UK" priority unoptimized />
            ),
            churchIcon: (
              <Image src={SANITY_ASSETS.church} width={28} height={28} alt="Church" priority unoptimized />
            ),
            trustpilotStarIcon: (
              <Image
                src={SANITY_ASSETS.trustpilotStar}
                width={31}
                height={28}
                alt="Trustpilot star"
                priority
                unoptimized
              />
            ),
            trustpilotSmallStarIcon: (
              <Image
                src={SANITY_ASSETS.trustpilotSmallStar}
                alt="star"
                width={14}
                height={14}
                priority
                unoptimized
              />
            ),
            trustpilotHeading: (
              <span>
                Excellent {header.socialProofRating} out of {header.socialProofMaxRating}&nbsp;
                <Image
                  className="inline"
                  src={SANITY_ASSETS.trustpilotSmallStar}
                  alt="star"
                  width={14}
                  height={14}
                  priority
                  unoptimized
                />{" "}
                Trustpilot
              </span>
            ),
            trustpilotSubheading: (
              <ul className="flex gap-1">
                {[0, 1, 2, 3, 4].map((index) => (
                  <li key={index} className="bg-[#219653]">
                    <Image
                      src={SANITY_ASSETS.trustpilotSmallStar}
                      alt="star"
                      width={14}
                      height={14}
                      priority
                      unoptimized
                    />
                  </li>
                ))}
              </ul>
            ),
          })}
        />
      }
      logoSlot={<SanityLogo variant={header.logoVariant} imgClassName="w-full" />}
      searchSlot={<SanityHeaderSearch />}
      actionsSlot={
        <SanityHeaderActions
          phoneNumber={header.phoneNumber}
          mobileNavSlot={
            <MobileMegaNav
              navigationBar={mobileNavItems}
              logoSlot={<SanityLogo variant={header.logoVariant} imgClassName="w-[76px] h-auto object-cover" />}
              phoneNumber={header.phoneNumber}
              openHour={header.openHour}
              helpHref={SANITY_LINKS.headerHelp}
            />
          }
        />
      }
      navMenuSlot={
        <SanityDesktopMegaNav
          navigationBar={mapNavForDesktopMegaNav(header.navigationBar)}
          className="[grid-area:navMenu]"
        />
      }
    />
    </HeaderChromeProvider>
  );
};
