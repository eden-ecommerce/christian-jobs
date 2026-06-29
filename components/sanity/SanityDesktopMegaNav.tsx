"use client";

import { DesktopMegaNav } from "@eden-ecommerce/common/blocks/Navigation";
import type { DesktopMegaNavItem } from "@eden-ecommerce/common/blocks/Navigation";
import { useHeaderChrome } from "@/components/sanity/header-chrome-context";

type SanityDesktopMegaNavProps = {
  navigationBar: DesktopMegaNavItem[];
  className?: string;
};

export const SanityDesktopMegaNav = ({ navigationBar, className }: SanityDesktopMegaNavProps) => {
  const { searchFocused } = useHeaderChrome();

  return (
    <DesktopMegaNav
      navigationBar={navigationBar}
      className={className}
      suppressWhenSearchFocused={searchFocused}
    />
  );
};
