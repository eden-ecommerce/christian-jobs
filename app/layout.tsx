import { SanityFooter, SanityHeader } from "@/components/sanity";
import { SanityPreFooterSection } from "@/components/sanity/SanityPreFooterSection";
import { IntegrationEnvError } from "@/components/common/IntegrationEnvError";
import { QueryProvider } from "@providers/query-provider";
import { UserBeaconProvider } from "@providers/user-beacon-provider";
import { isDeployEnvConfigured, isGtmEnvConfigured } from "@lib/env-configured";
import { getTermlyResourceBlockerUrl } from "@lib/termly/constants";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { ASSET_BASE_URL, PRODUCTION_ORIGIN } from "@/constants/app";
import iconSvg from "@public/icon.svg";
import "@app/globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const metadataOrigin = ASSET_BASE_URL ?? PRODUCTION_ORIGIN;

export const metadata: Metadata = {
  ...(metadataOrigin ? { metadataBase: new URL(metadataOrigin) } : {}),
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
  icons: {
    icon: [
      {
        url: "https://www.eden.co.uk/favicon.ico",
      },
      {
        url: iconSvg.src,
        type: "image/svg+xml",
      },
    ],
    shortcut: "https://www.eden.co.uk/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a3d2b",
};

const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isDeployEnvConfigured()) {
    return (
      <html
        lang="en"
        className={`light ${outfit.variable}`}
      >
        <body className="flex min-h-screen items-center justify-center p-6 font-sans antialiased">
          <IntegrationEnvError integration="deploy" className="max-w-lg" />
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className={`light ${outfit.variable} bg-background`}
    >
      <head>
        <Script
          id="termly-script"
          type="text/javascript"
          src={getTermlyResourceBlockerUrl()}
          strategy="afterInteractive"
        />
        {gtmId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
              `}
          </Script>
        ) : null}
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        <QueryProvider>
          <UserBeaconProvider enabledMVTTracking={isGtmEnvConfigured()}>
            <SanityHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <footer>
              <SanityPreFooterSection />
              <SanityFooter />
            </footer>
          </UserBeaconProvider>
        </QueryProvider>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
