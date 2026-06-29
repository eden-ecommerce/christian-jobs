import { mapMegaMenu } from "@eden-ecommerce/lib/sanity/map-mega-menu";
import type { DesktopMegaNavItem } from "@eden-ecommerce/common/blocks/Navigation";
import type { HeaderNavItem } from "@eden-ecommerce/lib/sanity/header-types";
import { HEADER_MEGA_NAV_ENABLED } from "@/data/sanity-defaults";

export const mapNavForDesktopMegaNav = (items: HeaderNavItem[]): DesktopMegaNavItem[] =>
  items.map((item) => ({
    text: item.text,
    href: item.href,
    textColour: item.textColour,
    megaNav:
      HEADER_MEGA_NAV_ENABLED && item.megaNav
        ? {
            itemsPerColumns: item.megaNav.itemsPerColumns,
            megaMenuItems: mapMegaMenu(item.megaNav.megaNavBlocks),
          }
        : null,
  }));
