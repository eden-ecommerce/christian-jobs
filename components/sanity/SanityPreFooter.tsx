"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  AcceptedPaymentMethods,
  PreFooter,
  PreFooterInfo,
  TrustPilotReviews,
} from "@eden-ecommerce/common/blocks/PreFooter";
import { Cookie, Lock } from "lucide-react";
import { SANITY_ASSETS } from "@/data/sanity-defaults";

const PAYMENT_METHODS = [
  { key: "paypal", label: "PayPal" },
  { key: "visa", label: "Visa" },
  { key: "mastercard", label: "Mastercard" },
] as const;

type TrustpilotWindow = Window & {
  Trustpilot?: {
    loadFromElement: (element: HTMLElement, force?: boolean) => void;
  };
};

type TrustPilotWidgetProps = {
  heading?: string;
  subheading?: string;
};

const TrustPilotWidget = ({ heading, subheading }: TrustPilotWidgetProps) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptLoaded) {
      return;
    }

    const trustpilot = (window as TrustpilotWindow).Trustpilot;
    if (!trustpilot) {
      return;
    }

    if (desktopRef.current) {
      trustpilot.loadFromElement(desktopRef.current, true);
    }
    if (mobileRef.current) {
      trustpilot.loadFromElement(mobileRef.current, true);
    }
  }, [scriptLoaded]);

  return (
    <>
      <Script
        id="trustpilot"
        type="text/javascript"
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <style>
        {`
          .trustpilot-container {
            background-image: url(${SANITY_ASSETS.socialProofBackground});
          }

          @media (min-width: 1280px) {
            .trustpilot-container {
              background-image: url(${SANITY_ASSETS.socialProofBackgroundShallow});
            }
          }
        `}
      </style>
      <TrustPilotReviews
        heading={heading}
        subheading={subheading}
        widgetSlot={
          <>
            <div
              ref={desktopRef}
              className="trustpilot-widget hidden h-[140px] pl-1.5 pr-4 sm:block"
              data-locale="en-GB"
              data-template-id="53aa8912dec7e10d38f59f36"
              data-businessunit-id="4af4e1e0000064000504ce8b"
              data-style-height="140px"
              data-style-width="100%"
              data-theme="light"
              data-stars="4,5"
              data-review-languages="en"
            >
              <a
                href="https://uk.trustpilot.com/review/www.eden.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="trust pilot reviews"
              />
            </div>
            <div
              ref={mobileRef}
              className="trustpilot-widget block h-[340px] px-6 sm:hidden"
              data-locale="en-GB"
              data-template-id="539ad0ffdec7e10e686debd7"
              data-businessunit-id="4af4e1e0000064000504ce8b"
              data-style-height="340px"
              data-style-width="100%"
              data-theme="light"
              data-stars="4,5"
              data-review-languages="en"
            >
              <a
                href="https://uk.trustpilot.com/review/www.eden.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="trust pilot reviews"
              />
            </div>
          </>
        }
      />
    </>
  );
};

type SanityPreFooterProps = {
  socialProofHeading?: string;
  socialProofSubheading?: string;
};

export const SanityPreFooter = ({
  socialProofHeading,
  socialProofSubheading,
}: SanityPreFooterProps) => (
  <PreFooter
    trustPilotSlot={
      <TrustPilotWidget heading={socialProofHeading} subheading={socialProofSubheading} />
    }
    paymentMethodsSlot={
      <AcceptedPaymentMethods
        methods={PAYMENT_METHODS.map((method) => ({
          key: method.key,
          imageSlot: (
            <span className="flex h-9 min-w-[48px] items-center justify-center rounded border border-copy-200 px-2 text-xs font-medium text-copy-700">
              {method.label}
            </span>
          ),
        }))}
      />
    }
    securityInfoSlot={
      <PreFooterInfo
        title="We Keep Your Information Secure"
        subtitle="We use enterprise level encryption and 256-bit SSL."
        iconSlot={<Lock className="size-6 text-copy-950" aria-hidden />}
      />
    }
    cookiesInfoSlot={
      <PreFooterInfo
        title="Cookies"
        subtitle={
          <>
            We use cookies to enhance your shopping experience{" "}
            <button type="button" className="termly-display-preferences text-secondary-700 underline">
              Consent Preferences
            </button>
          </>
        }
        iconSlot={<Cookie className="size-6 text-copy-950" aria-hidden />}
      />
    }
  />
);
