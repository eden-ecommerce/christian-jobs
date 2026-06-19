import type { CloudflareLocation } from "@lib/location/types";

const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { text: "Bibles", href: "https://www.eden.co.uk/bibles" },
      { text: "Books", href: "https://www.eden.co.uk/books" },
      { text: "Music & Film", href: "https://www.eden.co.uk/music-and-film" },
      { text: "Gifts", href: "https://www.eden.co.uk/gifts" },
      { text: "Church Supplies", href: "https://www.eden.co.uk/church-supplies" },
    ],
  },
  {
    heading: "Help",
    links: [
      { text: "Contact us", href: "https://www.eden.co.uk/help" },
      { text: "Delivery", href: "https://www.eden.co.uk/help/delivery" },
      { text: "Returns", href: "https://www.eden.co.uk/help/returns" },
      { text: "Track your order", href: "https://www.eden.co.uk/account" },
    ],
  },
  {
    heading: "About",
    links: [
      { text: "Our story", href: "https://www.eden.co.uk/about" },
      { text: "Christian events", href: "https://www.eden.co.uk/events" },
      { text: "Blog", href: "https://www.eden.co.uk/blog" },
      { text: "Careers", href: "https://www.eden.co.uk/careers" },
    ],
  },
];

type FooterProps = {
  geo?: CloudflareLocation;
};

/** Eden.co.uk-style footer. */
export function Footer({ geo }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-primary">
              eden<span className="text-foreground">.co.uk</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The UK&apos;s favourite Christian bookshop — books, Bibles, gifts and a
              directory of Christian events near you.
            </p>
          </div>

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

        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Eden.co.uk. Event data provided for
            information only. Always confirm details with the event organiser.
          </p>
          {geo ? (
            <p className="mt-2 text-[11px] text-gray-400">
              Location detected via {geo.source === "cloudflare" ? "Cloudflare" : "default"}
              {" — "}
              {geo.city ?? "unknown city"}, {geo.country ?? "unknown country"}
              {" · "}
              {geo.latitude.toFixed(4)}, {geo.longitude.toFixed(4)}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
