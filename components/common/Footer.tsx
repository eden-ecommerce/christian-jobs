import { EdenLogo } from "@components/common/EdenLogo";
import type { CloudflareLocation } from "@lib/location/types";

const FOOTER_COLUMNS = [
  {
    heading: "About us",
    links: [
      { text: "About Eden", href: "https://www.eden.co.uk/about" },
      { text: "Return info", href: "https://www.eden.co.uk/help/returns" },
      { text: "Privacy policy", href: "https://www.eden.co.uk/privacy" },
      { text: "Christian Jobs App", href: "https://www.eden.co.uk/jobs" },
      { text: "Christian Courses", href: "https://www.eden.co.uk/courses" },
    ],
  },
  {
    heading: "Help & support",
    links: [
      { text: "Payment methods", href: "https://www.eden.co.uk/help/payment" },
      { text: "Help & support", href: "https://www.eden.co.uk/help" },
      { text: "Christian.Work", href: "https://christian.work" },
      { text: "Bible.compare", href: "https://bible.compare" },
      { text: "Modern slavery", href: "https://www.eden.co.uk/modern-slavery" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { text: "Eden blog", href: "https://www.eden.co.uk/blog" },
      { text: "Contact us", href: "https://www.eden.co.uk/contact" },
      { text: "Christian Events", href: "https://www.eden.co.uk/events" },
      { text: "Christian.Gifts", href: "https://christian.gifts" },
      { text: "Promote your event — free", href: "https://hub.eden.co.uk/dashboard/event-journey" },
    ],
  },
  {
    heading: "Partners",
    links: [
      { text: "Delivery info", href: "https://www.eden.co.uk/help/delivery" },
      { text: "Christian Jobs", href: "https://www.eden.co.uk/jobs" },
      { text: "Christian.events", href: "https://christian.events" },
      { text: "Christian360.com", href: "https://christian360.com" },
    ],
  },
];

const STATS = [
  { value: "22 years", label: "Serving UK Church" },
  { value: "175,000", label: "Christian Products Available" },
  { value: "3,500,000+", label: "Visitors / year" },
  { value: "215,000+", label: "Bibles supplied / year" },
  { value: "3,000,000+", label: "Orders fulfilled" },
];

type FooterProps = {
  geo?: CloudflareLocation;
};

export function Footer({ geo }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-[#f5f5f0] text-foreground">
      {/* Main link grid */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <a href="https://www.eden.co.uk" aria-label="Eden home">
              <EdenLogo className="h-12 w-auto" />
            </a>
            <p className="mt-3 max-w-[180px] text-xs leading-relaxed text-muted-foreground">
              The UK&apos;s favourite Christian bookshop — Bibles, books, gifts and Christian events.
            </p>
          </div>

          {/* Four link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="text-sm font-semibold text-foreground">{col.heading}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap justify-center gap-x-10 gap-y-4 sm:justify-between">
            {STATS.map((s) => (
              <li key={s.label} className="text-center">
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-200 bg-[#1a3d2b] px-4 py-4 text-center">
        <p className="text-xs text-white/70">
          &copy; {new Date().getFullYear()} Eden.co.uk. Event data provided for
          information only. Always confirm details with the event organiser.
        </p>
        {geo ? (
          <p className="mt-1 text-[11px] text-white/40">
            {geo.city ?? "unknown city"}, {geo.country ?? "unknown country"}
            {" · "}
            {geo.latitude.toFixed(4)}, {geo.longitude.toFixed(4)}
            {" · via "}
            {geo.source === "cloudflare" ? "Cloudflare" : "default"}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
