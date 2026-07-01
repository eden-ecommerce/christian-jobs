"use client";

import Image from "next/image";
import { JobsHeroGlowV3 } from "@components/jobs/browser/v3/JobsHeroGlowV3";
import { publicAssetPath } from "@lib/config";

const HERO_BACKGROUND = publicAssetPath("/assets/jobs/v3-hero/background.png");
const HERO_FOREGROUND = publicAssetPath("/assets/jobs/v3-hero/foreground.png");

/** Figma Frame 23 (752×755) — percentage positions scale with the hero container. */
const FIGMA = {
  sky: {
    box: "absolute -left-[6.12%] -top-[30.2%] h-[141.19%] w-[126.46%]",
    img: "absolute left-[-68.11%] top-[0.02%] h-[100.03%] w-[168.16%] max-w-none",
  },
  body: {
    box: "absolute left-[30.24%] top-[21.57%] h-[88.74%] w-[59.52%]",
    img: "absolute left-[-203.11%] top-[-57.68%] h-[157.68%] w-[354.02%] max-w-none",
  },
  glow: {
    box: "absolute left-[calc(50%-45.18%)] top-[calc(50%-12.01%)] flex h-[177.73%] w-[204.51%] -translate-x-1/2 -translate-y-1/2 items-center justify-center mix-blend-lighten",
    inner: "relative h-[96.62%] w-[54.72%]",
  },
  arm: {
    box: "absolute left-[65.96%] top-[20.4%] z-[2] h-[33.25%] w-[25.27%]",
    img: "absolute left-[-652.84%] top-[-162.57%] h-[444.43%] w-[879.28%] max-w-none",
  },
} as const;

/** Hero photo — Figma four-layer stack with animated glow ribbon. */
export function JobsHeroImageV3() {
  return (
    <div className="relative mx-auto aspect-[752/755] w-full max-w-xl overflow-hidden rounded-[28px] bg-[#87CEEB] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.16)] ring-1 ring-black/[0.05] lg:mx-0 lg:ml-auto lg:aspect-auto lg:h-full lg:max-w-none lg:rounded-[32px] lg:rounded-tr-none">
      {/* Sky plate (Figma 17:172) */}
      <div className={`${FIGMA.sky.box} overflow-hidden`} aria-hidden="true">
        <Image
          src={HERO_BACKGROUND}
          alt=""
          width={4096}
          height={2731}
          priority
          unoptimized
          className={FIGMA.sky.img}
        />
      </div>

      {/* Person body under glow (Figma 17:173) */}
      <div className={`${FIGMA.body.box} overflow-hidden`} aria-hidden="true">
        <Image
          src={HERO_FOREGROUND}
          alt=""
          width={4096}
          height={2731}
          unoptimized
          className={FIGMA.body.img}
        />
      </div>

      {/* Glow ribbon (Figma 17:174) */}
      <div className={`${FIGMA.glow.box} pointer-events-none`} aria-hidden="true">
        <div className={`${FIGMA.glow.inner} flex-none rotate-[117.28deg]`}>
          <JobsHeroGlowV3 />
        </div>
      </div>

      {/* Raised arm over glow (Figma 17:175) */}
      <div className={`${FIGMA.arm.box} overflow-hidden`} aria-hidden="true">
        <Image
          src={HERO_FOREGROUND}
          alt=""
          width={4096}
          height={2731}
          unoptimized
          className={FIGMA.arm.img}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-l from-transparent via-transparent to-[#fbfbfd]/20 lg:bg-gradient-to-r lg:from-[#fbfbfd]/30 lg:via-transparent lg:to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
