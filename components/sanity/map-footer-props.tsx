import Image from "next/image";
import type { ReactNode } from "react";
import type { FooterInfoItem as LibFooterInfoItem } from "@eden-ecommerce/lib/sanity/get-footer";
import type { FooterInfoItem as CommonFooterInfoItem } from "@eden-ecommerce/common/blocks/Footer";
import type { ImageWithAlt } from "@eden-ecommerce/lib/sanity/image";
import { getSanityImage } from "@eden-ecommerce/lib/sanity/image";
import {
  type SanityFooterInfo,
} from "@/data/sanity-defaults";

const resolveFooterImageUrl = (image: unknown): string | undefined => {
  if (typeof image === "string" && image.startsWith("http")) {
    return image;
  }

  if (typeof image === "object" && image !== null) {
    const details = getSanityImage(image as ImageWithAlt, { width: 220, height: 70 });
    return details.url;
  }

  return undefined;
};

const mapStaticFooterInfo = (info: SanityFooterInfo): CommonFooterInfoItem => {
  const imageUrl = info.imageUrl;

  return {
    heading: info.heading,
    subheading: info.subheading,
    imageSlot:
      imageUrl && info.imageAlt ? (
        <Image
          unoptimized
          width={220}
          height={70}
          loading="lazy"
          src={imageUrl}
          alt={info.imageAlt}
          className="h-auto max-w-full object-contain"
        />
      ) : undefined,
  };
};

const mapLiveFooterInfo = (info: LibFooterInfoItem): CommonFooterInfoItem => {
  const imageUrl = resolveFooterImageUrl(info.image);

  return {
    heading: info.heading,
    subheading: info.subheading,
    imageSlot:
      imageUrl && info.imageAlt ? (
        <Image
          unoptimized
          width={220}
          height={70}
          loading="lazy"
          src={imageUrl}
          alt={info.imageAlt}
          className="h-auto max-w-full object-contain"
        />
      ) : undefined,
  };
};

export const mapStaticFooterInfoItems = (items: SanityFooterInfo[]): CommonFooterInfoItem[] =>
  items.map(mapStaticFooterInfo);

export const mapLiveFooterInfoItems = (items: LibFooterInfoItem[]): CommonFooterInfoItem[] =>
  items.map(mapLiveFooterInfo);
