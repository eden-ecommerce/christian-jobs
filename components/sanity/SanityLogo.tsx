import Image from "next/image";
import {
  SANITY_ASSETS,
  SANITY_LINKS,
} from "@/data/sanity-defaults";

type LogoVariant = "standard" | "summerStandard";

type SanityLogoProps = {
  variant?: LogoVariant;
  lazyLoad?: boolean;
  className?: string;
  imgClassName?: string;
};

const logoSources: Record<LogoVariant, string> = {
  standard: SANITY_ASSETS.logoStandard,
  summerStandard: SANITY_ASSETS.logoSummer,
};

export const SanityLogo = ({
  variant = "standard",
  lazyLoad = false,
  className,
  imgClassName,
}: SanityLogoProps) => {
  return (
    <a href={SANITY_LINKS.home} className={className}>
      <Image
        priority={!lazyLoad}
        src={logoSources[variant]}
        alt="Eden.co.uk"
        width={126}
        height={84}
        className={imgClassName}
        unoptimized
      />
    </a>
  );
};
