import { EdenHeader } from "@components/common/EdenHeader";
import { Footer } from "@components/common/Footer";
import { getCloudflareLocation } from "@lib/location/get-cloudflare-location.server";
import { QueryProvider } from "@providers/query-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ASSET_BASE_URL } from "@lib/constants";
import appleIcon from "@public/apple-icon.png";
import iconDark from "@public/icon-dark-32x32.png";
import iconLight from "@public/icon-light-32x32.png";
import iconSvg from "@public/icon.svg";
import "@app/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.eden.co.uk"),
  title: {
    default: "Christian Events Near You | Eden.co.uk",
    template: "%s | Eden Events",
  },
  description:
    "Find Christian events, conferences, training and gatherings across the UK. Search by location or browse by region, county and town.",
  openGraph: {
    siteName: "Eden Events",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    site: "@edencouk",
  },
  icons: {
    icon: [
      {
        url: iconLight.src,
        media: "(prefers-color-scheme: light)",
      },
      {
        url: iconDark.src,
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: iconSvg.src,
        type: "image/svg+xml",
      },
    ],
    apple: appleIcon.src,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const geo = await getCloudflareLocation();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background`}
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <QueryProvider>
          <EdenHeader />
          <div className="flex-1">{children}</div>
          <Footer geo={geo} />
        </QueryProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
