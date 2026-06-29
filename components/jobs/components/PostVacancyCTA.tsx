"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const POST_JOB_HREF = "https://hub.eden.co.uk/dashboard/job-journey";

/** Animated post-a-vacancy CTA with price countdown. */
export function PostVacancyCTA() {
  const [entered, setEntered] = useState(false);
  const [price, setPrice] = useState("£99");
  const [showSubLabel, setShowSubLabel] = useState(false);

  useEffect(() => {
    // Delay one frame so the off-screen start state paints before animating in.
    const timeout = window.setTimeout(() => setEntered(true), 80);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let value = 99;
    let interval: number | undefined;

    const startTimeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        value -= 3;
        if (value <= 0) {
          if (interval) window.clearInterval(interval);
          setPrice("FREE");
          setShowSubLabel(true);
        } else {
          setPrice(`£${value}`);
        }
      }, 26);
    }, 900);

    return () => {
      window.clearTimeout(startTimeout);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`w-full transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        entered ? "translate-x-0 opacity-100" : "translate-x-16 opacity-0"
      }`}
    >
      <a
        href={POST_JOB_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full overflow-hidden rounded-[14px] border border-[#E5E7EB]/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]"
      >
      <div className="flex items-center gap-3 px-4 py-3.5 sm:gap-3.5 sm:px-5 sm:py-[18px]">
        <div className="min-w-0 flex-1 text-left">
          <h3 className="text-[15px] font-bold text-foreground">Post a vacancy</h3>
          <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">
            Reach thousands of job seekers at churches &amp; charities
          </p>
        </div>

        <div className="shrink-0 text-right">
          <span
            className={`block min-w-[52px] text-right font-black leading-none text-[#2d6a4f] transition-colors duration-300 ${
              price === "FREE" ? "text-xl sm:text-[22px]" : "text-2xl sm:text-[26px]"
            }`}
          >
            {price}
          </span>
          <span
            className={`mt-px block text-right text-[10px] text-[#bbb] transition-opacity duration-400 ${
              showSubLabel ? "opacity-100 delay-200" : "opacity-0"
            }`}
          >
            It&apos;s absolutely free
          </span>
        </div>

        <ArrowRight
          className="h-[18px] w-[18px] shrink-0 text-[#2d6a4f] transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
      </a>
    </div>
  );
}
