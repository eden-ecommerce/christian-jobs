"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

type Props = {
  url: string;
  title: string;
  /** "icon" = compact circle button for detail headers */
  variant?: "default" | "icon";
};

export function ShareButton({ url, title, variant = "default" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Cancelled or unsupported — fall through to clipboard copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? "Link copied" : "Share this job"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[#F3F4F6] hover:text-foreground"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[#2d6a4f]" aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
      ) : (
        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
