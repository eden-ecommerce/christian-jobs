"use client";

import { useEffect, useRef, useState } from "react";

const DRAW_DELAY_MS = 300;
const DRAW_DURATION_MS = 2600;

/** Figma ribbon fill path (viewBox 0 0 904.355 1370.51). */
const GLOW_FILL_PATH =
  "M31.9362 209.457C31.1805 228.009 30.1794 246.146 42.0671 260.667C55.7232 274.781 77.4694 266.617 92.4583 259.817C163.325 222.177 219.688 164.533 279.953 113.425C309.738 87.8243 339.986 60.9032 372.577 40.5916C388.047 31.1218 411.014 20.8554 412.262 39.184C414.743 57.0962 410.149 74.9344 405.059 95.2926C385.235 172.247 366.56 250.648 369.237 331.704C371.046 371.797 380.445 414.502 407.826 447.037C434.94 479.717 475.064 496.843 513.74 507.013C528.578 510.915 543.298 513.876 558.423 516.369C632.93 529.576 708.977 540.478 774.237 573.496C849.596 605.775 823.677 698.112 813.736 769.014C787.616 918.167 799.063 1074.12 840.492 1218.74C849.994 1252.79 860.531 1285.51 872.827 1319.71C861.539 1285.16 851.982 1252.18 843.426 1217.97C806.075 1072.4 798.04 918.495 826.006 770.988C831.955 733.585 840.485 697.209 840.657 657.654C843.148 618.182 816.429 577.155 781.479 560.451C711.814 524.72 636.174 514.198 561.019 500.635C546.283 498.188 532.029 495.305 517.81 491.565C440.012 476.824 383.015 410.512 384.384 330.946C381.211 253.319 398.696 175.101 417.393 98.4747C422.262 77.1032 427.268 59.8985 423.903 36.8177C423.249 33.6984 422.301 30.8829 420.984 28.3757C419.6 25.6402 417.057 22.4836 414.175 20.6506C408.31 16.7098 400.884 17.0185 395.704 18.1359C384.418 20.7239 375.868 25.7948 366.858 31.2905C333.109 53.1775 303.596 80.6069 274.181 106.922C214.926 159.33 159.889 218.169 91.1379 257.084C76.5297 264.244 56.0417 272.297 43.1885 259.586C31.5176 246.259 31.6334 227.986 31.9362 209.457Z";

/**
 * Mask geometry, in the same viewBox units as the fill path. The reveal band
 * sits just below the padded mask region (nothing shown), then slides
 * straight up past the top of it (everything shown) — since the ribbon's
 * thick entry point sits low (y ~1300) and its thin fading tip sits near the
 * top (y ~20), an upward sweep reads as the ribbon being drawn from its
 * thick end to its faded tip.
 */
const MASK_X = -100;
const MASK_Y = -150;
const MASK_WIDTH = 1104.355;
const MASK_HEIGHT = 1670.51;
const REVEAL_BAND_HEIGHT = 4000;
/** Reveal band's `y` at the start (bottom edge of the mask — nothing shown)
 * and end (top edge of the mask — everything shown) of the draw. */
const REVEAL_Y_START = MASK_Y + MASK_HEIGHT;
const REVEAL_Y_END = MASK_Y;

/** Smooth ease, mirroring the feel of a finger dragging a line into place. */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Exact Figma glow — filled ribbon with a soft draw-on-load reveal. */
export function JobsHeroGlowV3() {
  const revealRef = useRef<SVGRectElement>(null);
  const [drawComplete, setDrawComplete] = useState(false);

  useEffect(() => {
    const revealBand = revealRef.current;
    if (!revealBand) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setDrawComplete(true);
      return;
    }

    // Elements referenced purely as <mask> content aren't part of the normal
    // render tree, so a CSS `transform` (e.g. via the Web Animations API)
    // silently fails to paint there. Drive the reveal by writing the SVG `y`
    // attribute directly on each frame instead, which always paints.
    let frameId: number;
    let startTime: number | null = null;

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DRAW_DURATION_MS, 1);
      const eased = easeInOutCubic(progress);
      const y = REVEAL_Y_START + (REVEAL_Y_END - REVEAL_Y_START) * eased;
      revealBand.setAttribute("y", `${y}`);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      } else {
        setDrawComplete(true);
      }
    };

    const timeout = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(step);
    }, DRAW_DELAY_MS);

    return () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 904.355 1370.51"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-[-1.78%_-3.75%_-3.92%_-3.77%] h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="jobsHeroGlowFill"
            x1="426.043"
            y1="-319.897"
            x2="-335.504"
            y2="1031.75"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="8.12711%" stopColor="#8EFF04" />
            <stop offset="32.2365%" stopColor="#F3FDE1" />
            <stop offset="48.9941%" stopColor="#F0FFCF" />
            <stop offset="90.6937%" stopColor="#ACE665" />
          </linearGradient>
          <filter
            id="jobsHeroGlowFilter"
            x="0"
            y="0"
            width="904.355"
            height="1370.51"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="19.2803" />
            <feGaussianBlur stdDeviation="15.7639" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.630208 0 0 0 0 0.969551 0 0 0 0 0 0 0 0 0.98 0"
            />
            <feBlend
              mode="plus-lighter"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2.37289" />
            <feGaussianBlur stdDeviation="9.88704" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.764984 0 0 0 0 1 0 0 0 0 0.328525 0 0 0 0.28 0"
            />
            <feBlend
              mode="plus-lighter"
              in2="effect1_dropShadow"
              result="effect2_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect2_dropShadow"
              result="shape"
            />
          </filter>
          <filter
            id="jobsHeroGlowRevealBlur"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="45" />
          </filter>
          <mask
            id="jobsHeroGlowMask"
            maskUnits="userSpaceOnUse"
            x={MASK_X}
            y={MASK_Y}
            width={MASK_WIDTH}
            height={MASK_HEIGHT}
          >
            <rect
              x={MASK_X}
              y={MASK_Y}
              width={MASK_WIDTH}
              height={MASK_HEIGHT}
              fill="black"
            />
            <rect
              ref={revealRef}
              x={MASK_X}
              y={REVEAL_Y_START}
              width={MASK_WIDTH}
              height={REVEAL_BAND_HEIGHT}
              fill="white"
              filter="url(#jobsHeroGlowRevealBlur)"
            />
            <rect
              x={MASK_X}
              y={MASK_Y}
              width={MASK_WIDTH}
              height={MASK_HEIGHT}
              fill="white"
              opacity={drawComplete ? 1 : 0}
            />
          </mask>
        </defs>

        <g style={{ mixBlendMode: "lighten" }} mask="url(#jobsHeroGlowMask)">
          <path
            d={GLOW_FILL_PATH}
            fill="url(#jobsHeroGlowFill)"
            filter="url(#jobsHeroGlowFilter)"
          />
        </g>
      </svg>
    </div>
  );
}
