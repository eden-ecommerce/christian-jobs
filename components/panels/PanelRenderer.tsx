import { assertNever } from "@lib/assert-never";

// TEMPORARILY DISABLED: real component comes from the private
// `@christian-360/next-design` package. To re-enable, restore the import below,
// add the dependency back to package.json, and delete the placeholder.
//
// import { ThinBanner } from "@christian-360/next-design/storefront/thin-banner";

type ThinBannerProps = {
  title: string;
  backgroundColour?: string;
  buttonColour?: string;
  buttonText?: string;
  textColour?: string;
  linkValue?: string;
};

function ThinBanner({
  title,
  backgroundColour,
  buttonColour,
  buttonText,
  textColour,
  linkValue,
}: ThinBannerProps) {
  return (
    <div
      className="flex items-center justify-center gap-4 px-4 py-2 text-sm"
      style={{ backgroundColor: backgroundColour, color: textColour }}
    >
      <span>{title}</span>
      {buttonText ? (
        <a
          href={linkValue ?? "#"}
          className="rounded-md px-3 py-1 font-medium underline"
          style={{ color: buttonColour }}
        >
          {buttonText}
        </a>
      ) : null}
    </div>
  );
}

export type ThinBannerPanel = {
  _type: "thinBanner";
  bannerText?: string;
  backgroundColour?: string;
  bannerTextColour?: string;
  buttonText?: string;
  buttonTextColour?: string;
  link?: { linkValue?: string };
};

export type Panel = ThinBannerPanel;

type Props = {
  panel: Panel;
};

/** Maps CMS panel documents to UI — add new panel types as switch cases. */
export function PanelRenderer({ panel }: Props) {
  const type = panel._type;

  switch (type) {
    case "thinBanner":
      return (
        <ThinBanner
          title={panel.bannerText ?? ""}
          backgroundColour={panel.backgroundColour}
          buttonColour={panel.buttonTextColour}
          buttonText={panel.buttonText}
          textColour={panel.bannerTextColour}
          linkValue={panel.link?.linkValue}
        />
      );
    default:
      return assertNever(type);
  }
}
