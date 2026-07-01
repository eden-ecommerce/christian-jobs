"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
};

const DETAIL_INSET = 16;
const DETAIL_HEIGHT = `calc(100vh - ${DETAIL_INSET * 2}px)`;

type Layout =
  | { mode: "flow" }
  | { mode: "fixed"; left: number; width: number }
  | { mode: "hidden" };

/**
 * Detail pane that sits beside the list at page top, then pins to the viewport
 * while scrolling results — avoids sticky top-offset gaps once the header scrolls away.
 */
export function JobsDetailStickyPane({ children }: Props) {
  const slotRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>({ mode: "flow" });

  const measure = useCallback(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const slotRect = slot.getBoundingClientRect();
    const rowRect = slot.parentElement?.getBoundingClientRect();
    if (!rowRect) return;

    const paneBottom = window.innerHeight - DETAIL_INSET;
    const resultsEnded = rowRect.bottom <= paneBottom;

    // Results block scrolled entirely off the top.
    if (rowRect.bottom <= DETAIL_INSET) {
      setLayout({ mode: "hidden" });
      return;
    }

    if (slotRect.top <= DETAIL_INSET) {
      // Pinned — release before featured carousels / blog content below.
      if (resultsEnded) {
        setLayout({ mode: "hidden" });
        return;
      }
      setLayout({
        mode: "fixed",
        left: slotRect.left,
        width: slotRect.width,
      });
      return;
    }

    setLayout({ mode: "flow" });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const paneStyle: CSSProperties | undefined =
    layout.mode === "fixed"
      ? {
          position: "fixed",
          top: DETAIL_INSET,
          left: layout.left,
          width: layout.width,
          height: DETAIL_HEIGHT,
          zIndex: 20,
        }
      : undefined;

  const paneClass =
    layout.mode === "flow" ? "h-[calc(100vh-2rem)]" : "h-full";

  if (layout.mode === "hidden") {
    return (
      <div
        ref={slotRef}
        className="min-w-0 flex-[3] shrink-0 self-start"
        aria-hidden="true"
      />
    );
  }

  return (
    <div ref={slotRef} className="min-w-0 flex-[3] self-start">
      <div className={paneClass} style={paneStyle}>
        {children}
      </div>
    </div>
  );
}
