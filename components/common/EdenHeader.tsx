"use client";

import { EdenLogo } from "@components/common/EdenLogo";
import { HeaderSearch } from "@components/common/HeaderSearch";
import { NsLink } from "@components/ns-link";
import { NAMESPACE_PATH } from "@lib/config";
import { ShoppingBag, HelpCircle, User, Phone } from "lucide-react";

const NAV_LINKS = [
  { text: "Christian Books", href: "https://www.eden.co.uk/books" },
  { text: "Bibles", href: "https://www.eden.co.uk/bibles" },
  { text: "Children & Youth", href: "https://www.eden.co.uk/children" },
  { text: "Church Supplies", href: "https://www.eden.co.uk/church-supplies" },
  { text: "Home & Living", href: "https://www.eden.co.uk/home-and-living" },
  { text: "Christian Gifts", href: "https://www.eden.co.uk/gifts" },
  { text: "Cards", href: "https://www.eden.co.uk/cards" },
  { text: "Top 50", href: "https://www.eden.co.uk/top-50" },
  { text: "Christian Jobs", href: "https://www.eden.co.uk/jobs" },
  { text: "Christian Events", href: NAMESPACE_PATH, internal: true },
];

const USP_ITEMS = [
  { text: "FREE delivery on orders over £15" },
  { text: "Serving over 2 million Christians in the UK" },
  { text: "Excellent 4.8 out of 5 on Trustpilot" },
];

export function EdenHeader() {
  return (
    <header className="bg-white">
      {/* USP strip — dark green */}
      <div className="bg-[#1a3d2b] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center divide-x divide-white/20 px-4">
          {USP_ITEMS.map((item) => (
            <p key={item.text} className="px-4 py-2 text-center text-[11px] font-medium sm:text-xs">
              {item.text}
            </p>
          ))}
        </div>
      </div>

      {/* Brand row */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:py-4">
          {/* Logo */}
          <a href="https://www.eden.co.uk" className="shrink-0" aria-label="Eden home">
            <EdenLogo className="h-12 w-auto sm:h-14" />
          </a>

          {/* Live instant search */}
          <HeaderSearch />

          {/* Phone + actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <a
              href="tel:03452223336"
              className="hidden items-center gap-2 text-foreground lg:flex"
              aria-label="Call us on 0345 222 3336"
            >
              <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="text-left">
                <p className="text-sm font-semibold leading-tight">0345 222 3336</p>
                <p className="text-[11px] text-muted-foreground">Weekdays 8.30–17.30</p>
              </div>
            </a>

            <div className="hidden h-8 w-px bg-border lg:block" aria-hidden="true" />

            <a
              href="https://www.eden.co.uk/help"
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-foreground hover:text-primary"
            >
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
              <span className="hidden text-[11px] font-medium sm:block">Help</span>
            </a>

            <a
              href="https://www.eden.co.uk/account"
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-foreground hover:text-primary"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              <span className="hidden text-[11px] font-medium sm:block">Login</span>
            </a>

            <a
              href="https://www.eden.co.uk/shop/basket.php"
              className="flex flex-col items-center gap-0.5 px-2 py-1 text-foreground hover:text-primary"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              <span className="hidden text-[11px] font-medium sm:block">Basket</span>
            </a>
          </div>
        </div>
      </div>

      {/* Primary green nav */}
      <nav className="bg-primary text-primary-foreground shadow-sm" aria-label="Main navigation">
        <div className="mx-auto flex max-w-7xl items-center overflow-x-auto px-2 sm:px-4">
          {NAV_LINKS.map((link) =>
            link.internal ? (
              <NsLink
                key={link.text}
                href={link.href}
                className="shrink-0 whitespace-nowrap px-3 py-3 text-sm font-medium underline-offset-2 hover:underline"
              >
                {link.text}
              </NsLink>
            ) : (
              <a
                key={link.text}
                href={link.href}
                className="shrink-0 whitespace-nowrap px-3 py-3 text-sm font-medium underline-offset-2 hover:underline"
              >
                {link.text}
              </a>
            ),
          )}
        </div>
      </nav>
    </header>
  );
}
