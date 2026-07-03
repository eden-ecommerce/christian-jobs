"use client";

import type { JobFacet } from "@lib/algolia/jobs";
import { ChevronDown, Search, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Props = {
  id?: string;
  categories: JobFacet[];
  value?: string;
  onChange: (value: string | undefined) => void;
  className?: string;
  inputClassName?: string;
  labelClassName?: (floating: boolean) => string;
  /** Floating label text — defaults to "Category". */
  fieldLabel?: string;
  placeholder?: string;
  /** When true, fetches categories from /api/jobs/filters if the list is empty. */
  fetchWhenEmpty?: boolean;
};

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

/** Searchable category picker — only accepts values from the facet list. */
export function JobsCategoryCombobox({
  id,
  categories: categoriesProp,
  value,
  onChange,
  className = "",
  inputClassName = "",
  labelClassName,
  fieldLabel = "Category",
  placeholder = "All categories",
  fetchWhenEmpty = false,
}: Props) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Prevents blur from clearing a value selected in the same tick. */
  const selectingRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState<JobFacet[]>([]);
  const [mounted, setMounted] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(
    null,
  );

  const categories = categoriesProp.length ? categoriesProp : fetchedCategories;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!fetchWhenEmpty || categoriesProp.length) return;
    let cancelled = false;
    void fetch("/api/jobs/filters")
      .then((res) => res.json())
      .then((data: { categories?: JobFacet[] }) => {
        if (!cancelled && Array.isArray(data.categories)) {
          setFetchedCategories(data.categories);
        }
      })
      .catch(() => {
        // Facets unavailable — leave list empty.
      });
    return () => {
      cancelled = true;
    };
  }, [categoriesProp.length, fetchWhenEmpty]);

  const selected = useMemo(
    () => categories.find((cat) => cat.value === value),
    [categories, value],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((cat) =>
      cat.label.toLowerCase().includes(term),
    );
  }, [categories, query]);

  const displayValue = open ? query : (selected?.label ?? "");

  const labelUp = focused || Boolean(selected) || query.trim() !== "";

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setPanelPosition(null);
  }, []);

  const updatePanelPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setPanelPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePanelPosition();
  }, [open, updatePanelPosition, filtered.length]);

  useEffect(() => {
    if (!open) return;

    const handleReposition = () => updatePanelPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updatePanelPosition]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (listboxRef.current?.contains(target)) return;
      if (emptyStateRef.current?.contains(target)) return;
      close();
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [close]);

  function selectCategory(next?: string) {
    selectingRef.current = true;
    onChange(next);
    close();
    inputRef.current?.blur();
  }

  function handleInputChange(next: string) {
    setQuery(next);
    setOpen(true);
    if (!next.trim()) {
      onChange(undefined);
    }
  }

  function handleBlur() {
    setFocused(false);
    setQuery("");
    if (!selectingRef.current && !value && query.trim()) {
      onChange(undefined);
    }
    selectingRef.current = false;
    window.setTimeout(() => setOpen(false), 120);
  }

  const listbox =
    open && filtered.length > 0 && panelPosition ? (
      <ul
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-label="Job categories"
        style={{
          position: "fixed",
          top: panelPosition.top,
          left: panelPosition.left,
          width: panelPosition.width,
          zIndex: 120,
        }}
        className="max-h-60 overflow-y-auto rounded-xl border border-[#E5E7EB] bg-white py-1 shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      >
        {!query.trim() ? (
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectCategory(undefined)}
              className="flex w-full items-center px-3 py-2.5 text-left text-[15px] text-[#1d1d1f] hover:bg-[#f5f5f7]"
            >
              All categories
            </button>
          </li>
        ) : null}
        {filtered.map((cat) => (
          <li key={cat.value} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={value === cat.value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectCategory(cat.value)}
              className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[15px] hover:bg-[#f5f5f7] ${
                value === cat.value
                  ? "bg-[#235A0E]/5 font-medium text-[#235A0E]"
                  : "text-[#1d1d1f]"
              }`}
            >
              <span className="truncate">{cat.label}</span>
              {cat.count ? (
                <span className="shrink-0 text-xs text-[#86868b]">
                  {cat.count}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  const emptyState =
    open && query.trim() && filtered.length === 0 && panelPosition ? (
      <div
        ref={emptyStateRef}
        style={{
          position: "fixed",
          top: panelPosition.top,
          left: panelPosition.left,
          width: panelPosition.width,
          zIndex: 120,
        }}
        className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-sm text-[#86868b] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      >
        <Search className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
        No matching categories
      </div>
    ) : null;

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      {labelClassName ? (
        <label htmlFor={id} className={labelClassName(labelUp)}>
          {fieldLabel}
        </label>
      ) : null}

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          type="text"
          name="job-category"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-label={fieldLabel}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore="true"
          data-lpignore="true"
          value={displayValue}
          placeholder={labelClassName ? "" : placeholder}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
            if (selected) setQuery("");
          }}
          onBlur={handleBlur}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              close();
              inputRef.current?.blur();
            }
            if (event.key === "Enter" && filtered.length === 1) {
              event.preventDefault();
              selectCategory(filtered[0]?.value);
            }
          }}
          className={`cursor-pointer focus:cursor-text ${inputClassName}`}
        />

        {selected ? (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => selectCategory(undefined)}
            aria-label="Clear category"
            className="absolute right-8 flex h-6 w-6 items-center justify-center rounded-full text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : null}

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868b]"
          aria-hidden="true"
        />
      </div>

      {mounted && listbox ? createPortal(listbox, document.body) : null}
      {mounted && emptyState ? createPortal(emptyState, document.body) : null}
    </div>
  );
}
