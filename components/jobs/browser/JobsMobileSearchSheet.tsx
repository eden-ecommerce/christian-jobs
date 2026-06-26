"use client";

import { useRecentJobSearches } from "@hooks/jobs/use-recent-job-searches";
import {
  filterKeywordSuggestions,
  filterLocationSuggestions,
} from "@lib/jobs/search-suggestions";
import { ArrowLeft, Clock, MapPin, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Mode = "what" | "where";

type Props = {
  open: boolean;
  initialMode: Mode;
  query: string;
  location: string;
  onClose: () => void;
  onSearch: (
    query: string,
    location: { label: string; lat?: number; lng?: number },
  ) => void;
};

/** Full-screen mobile search sheet (Indeed-style, one page per field). */
export function JobsMobileSearchSheet({
  open,
  initialMode,
  query,
  location,
  onClose,
  onSearch,
}: Props) {
  const { recents, removeRecent } = useRecentJobSearches();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [keyword, setKeyword] = useState(query);
  const [locationLabel, setLocationLabel] = useState(location);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setKeyword(query);
    setLocationLabel(location);
    setCoords(null);
  }, [open, initialMode, query, location]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [open, mode]);

  const submitSearch = useCallback(
    (
      nextQuery: string,
      nextLocation: { label: string; lat?: number; lng?: number },
    ) => {
      onSearch(nextQuery, nextLocation);
      onClose();
    },
    [onClose, onSearch],
  );

  function submitKeyword() {
    submitSearch(keyword.trim(), { label: location.trim() });
  }

  function submitLocation() {
    submitSearch(query.trim(), {
      label: locationLabel.trim(),
      lat: coords?.lat,
      lng: coords?.lng,
    });
  }

  if (!open || !mounted) return null;

  const keywordSuggestions = filterKeywordSuggestions(keyword);
  const locationSuggestions = filterLocationSuggestions(locationLabel);
  const showRecents = mode === "what" && !keyword.trim() && recents.length > 0;

  const panel = (
    <div
      className="fixed inset-0 z-[200] flex flex-col bg-white lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={mode === "what" ? "Search jobs" : "Search location"}
    >
      <div className="flex items-center gap-2 border-b border-[#E5E7EB] px-2 py-2">
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-[#F3F4F6]"
          aria-label="Close search"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative min-w-0 flex-1">
          {mode === "what" ? (
            <>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="search"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitKeyword();
                  }
                }}
                placeholder="Job title, keywords, or company"
                aria-label="Job title, keywords, or company"
                autoComplete="off"
                enterKeyHint="search"
                className="h-12 w-full rounded-xl border-2 border-[#2d6a4f] bg-white pl-11 pr-10 text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
              {keyword ? (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-[#F3F4F6]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </>
          ) : (
            <>
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="search"
                value={locationLabel}
                onChange={(e) => {
                  setLocationLabel(e.target.value);
                  setCoords(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitLocation();
                  }
                }}
                placeholder={'City, postcode or "remote"'}
                aria-label="City, postcode or remote"
                autoComplete="off"
                enterKeyHint="search"
                className="h-12 w-full rounded-xl border-2 border-[#2d6a4f] bg-white pl-11 pr-10 text-base text-foreground outline-none placeholder:text-muted-foreground"
              />
              {locationLabel ? (
                <button
                  type="button"
                  onClick={() => {
                    setLocationLabel("");
                    setCoords(null);
                  }}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-[#F3F4F6]"
                  aria-label="Clear location"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {mode === "what" ? (
          <>
            {showRecents ? (
              <section className="mb-6">
                <h2 className="mb-2 text-sm font-bold text-foreground">
                  Recent searches
                </h2>
                <ul className="divide-y divide-[#E5E7EB]">
                  {recents.map((item) => (
                    <li key={`${item.query}-${item.location}`}>
                      <div className="flex items-center gap-3 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            submitSearch(item.query, { label: item.location })
                          }
                          className="flex min-w-0 flex-1 items-start gap-3 text-left"
                        >
                          <Clock
                            className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-base font-medium text-foreground">
                              {item.query || "All jobs"}
                            </span>
                            {item.location ? (
                              <span className="mt-0.5 block truncate text-sm text-[#2d6a4f]">
                                {item.location}
                              </span>
                            ) : null}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRecent(item)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-[#F3F4F6]"
                          aria-label="Remove recent search"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h2 className="mb-2 text-sm font-bold text-foreground">
                Search suggestions
              </h2>
              <ul className="divide-y divide-[#E5E7EB]">
                {keywordSuggestions.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => submitSearch(item.label, { label: location })}
                      className="flex w-full items-center gap-3 py-3.5 text-left active:bg-[#F9FAFB]"
                    >
                      <Search
                        className="h-5 w-5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-base text-foreground">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <section>
            <h2 className="mb-2 text-sm font-bold text-foreground">Locations</h2>
            <ul className="divide-y divide-[#E5E7EB]">
              {locationSuggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationLabel(item.label);
                      if (item.lat !== undefined && item.lng !== undefined) {
                        setCoords({ lat: item.lat, lng: item.lng });
                      } else {
                        setCoords(null);
                      }
                      submitSearch(query.trim(), {
                        label: item.label,
                        lat: item.lat,
                        lng: item.lng,
                      });
                    }}
                    className="flex w-full items-center gap-3 py-3.5 text-left active:bg-[#F9FAFB]"
                  >
                    <MapPin
                      className="h-5 w-5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-base text-foreground">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {mode === "where" ? (
        <div className="shrink-0 border-t border-[#E5E7EB] bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={submitLocation}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2d6a4f] text-base font-semibold text-white"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            Search
          </button>
        </div>
      ) : null}
    </div>
  );

  return createPortal(panel, document.body);
}
