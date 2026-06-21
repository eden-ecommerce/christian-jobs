import {
  EdenHeader,
  Footer,
} from "@eden-ecommerce/site-chrome/components";
import { QueryProvider } from "@providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@app/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eden.co.uk"),
  title: {
    default: "Christian Jobs | Eden.co.uk",
    template: "%s | Eden Christian Jobs",
  },
  description:
    "Find meaningful Christian jobs at churches, charities and faith-based organisations across the UK. Search by location or browse by category.",
  openGraph: {
    siteName: "Christian Jobs — Eden.co.uk",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@edencouk",
  },
  // Use Eden's own favicon so the browser tab matches the main site.
  icons: {
    icon: "https://www.eden.co.uk/favicon.ico",
    shortcut: "https://www.eden.co.uk/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a3d2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <QueryProvider>
          <EdenHeader
            namespacePath="/christian-jobs"
            namespaceLinkText="Christian Jobs"
            extraNavLinks={[{ text: "Jobs Blog", href: "/blog" }]}
            algoliaAppId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}
            algoliaSearchKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY}
          />
          <div className="flex-1">{children}</div>
          <Footer />
        </QueryProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
