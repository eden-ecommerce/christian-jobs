import type { MobileNavItem } from "@eden-ecommerce/common/blocks/Navigation";
import type { HeaderNavItem } from "@eden-ecommerce/lib/sanity/header-types";

export const mapNavForMobileNav = (items: HeaderNavItem[]): MobileNavItem[] =>
  items.map((item) => ({
    text: item.text,
    href: item.href,
    textColour: item.textColour,
    children:
      item.megaNav && item.megaNav.megaNavBlocks.length > 0
        ? item.megaNav.megaNavBlocks.flatMap((block) =>
            block.childLinks.map((child) => ({
              text: child.text,
              href: child.href,
            })),
          )
        : undefined,
  }));
