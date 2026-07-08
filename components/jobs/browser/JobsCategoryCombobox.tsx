"use client";

import type { JobFacet } from "@lib/algolia/jobs";
import { ChevronDown, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
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

function subscribeNarrowCategoryPicker(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia("(max-width: 1023px)");
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getNarrowCategoryPickerSnapshot() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function getNarrowCategoryPickerServerSnapshot() {
  return false;
}

function useNarrowCategoryPicker() {
  return useSyncExternalStore(
    subscribeNarrowCategoryPicker,
    getNarrowCategoryPickerSnapshot,
    getNarrowCategoryPickerServerSnapshot,
  );
}

/** Button-triggered category picker — only accepts values from the facet list. */
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState<JobFacet[]>([]);
  const [mounted, setMounted] = useState(false);
  const [panelPosition, setPanelPosition] = useState<PanelPosition | null>(
    null,
  );
  const isNarrow = useNarrowCategoryPicker();

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

  const labelUp = open || Boolean(selected);

  const close = useCallback(() => {
    setOpen(false);
    setPanelPosition(null);
    triggerRef.current?.focus({ preventScroll: true });
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
    if (!open || isNarrow) return;
    updatePanelPosition();
  }, [open, isNarrow, updatePanelPosition, categories.length]);

  useEffect(() => {
    if (!open || isNarrow) return;

    const handleReposition = () => updatePanelPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, isNarrow, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (listboxRef.current?.contains(target)) return;
      if (sheetRef.current?.contains(target)) return;
      close();
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, close]);

  useEffect(() => {
    if (!open || !isNarrow) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isNarrow]);

  function selectCategory(next?: string) {
    onChange(next);
    close();
  }

  function toggleOpen() {
    setOpen((current) => {
      const next = !current;
      if (next && !isNarrow) {
        updatePanelPosition();
      }
      return next;
    });
  }

  const optionButtons = (
    <>
      <li role="presentation">
        <button
          type="button"
          role="option"
          aria-selected={!value}
          onClick={() => selectCategory(undefined)}
          className="flex w-full items-center px-3 py-2.5 text-left text-[15px] text-[#1d1d1f] hover:bg-[#f5f5f7] active:bg-[#f5f5f7]"
        >
          All categories
        </button>
      </li>
      {categories.map((cat) => (
        <li key={cat.value} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={value === cat.value}
            onClick={() => selectCategory(cat.value)}
            className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-[15px] hover:bg-[#f5f5f7] active:bg-[#f5f5f7] ${
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
    </>
  );

  const desktopListbox =
    open && !isNarrow && categories.length > 0 && panelPosition ? (
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
        {optionButtons}
      </ul>
    ) : null;

  const mobileSheet =
    open && isNarrow && mounted ? (
      <div className="fixed inset-0 z-[200] lg:hidden" role="presentation">
        <button
          type="button"
          aria-label="Close category picker"
          className="absolute inset-0 bg-black/40"
          onClick={close}
        />
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={fieldLabel}
          className="absolute inset-x-0 bottom-0 flex max-h-[min(70vh,520px)] flex-col rounded-t-2xl bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.12)]"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
            <h2 className="text-base font-semibold text-[#1d1d1f]">
              {fieldLabel}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#86868b] hover:bg-[#f5f5f7]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label="Job categories"
            className="min-h-0 flex-1 overflow-y-auto py-1"
          >
            {optionButtons}
          </ul>
        </div>
      </div>
    ) : null;

  return (
    <div ref={containerRef} className={`relative min-w-0 ${className}`}>
      {labelClassName ? (
        <span className={labelClassName(labelUp)}>{fieldLabel}</span>
      ) : null}

      <div className="relative flex items-center">
        <button
          ref={triggerRef}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-label={selected ? `${fieldLabel}: ${selected.label}` : fieldLabel}
          onClick={toggleOpen}
          className={`cursor-pointer text-left ${inputClassName}`}
        >
          {selected?.label ?? (labelClassName ? "" : placeholder)}
        </button>

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
          className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#86868b] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </div>

      {mounted && desktopListbox ? createPortal(desktopListbox, document.body) : null}
      {mobileSheet ? createPortal(mobileSheet, document.body) : null}
    </div>
  );
}
