"use client";

import type { JobFacet } from "@lib/algolia/jobs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function SidebarFilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-[#E5E7EB] pt-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between py-0.5 text-left"
      >
        <span className="text-sm font-bold text-foreground">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open ? <div className="mt-2 space-y-0.5">{children}</div> : null}
    </div>
  );
}

function SidebarRadioIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
        checked ? "border-[#2d6a4f]" : "border-[#D1D5DB]"
      }`}
      aria-hidden="true"
    >
      {checked ? <span className="h-2 w-2 rounded-full bg-[#2d6a4f]" /> : null}
    </span>
  );
}

type FilterOptionItem = {
  label: string;
  value: string;
  count?: number;
};

export function SidebarCheckboxOption({
  label,
  checked,
  count,
  onToggle,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1 py-1.5 text-sm transition-colors hover:bg-[#F9FAFB]">
      <span className="flex min-w-0 items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="h-4 w-4 shrink-0 rounded border-[#D1D5DB] accent-[#2d6a4f]"
        />
        <span className={checked ? "font-semibold text-[#2d6a4f]" : "text-foreground"}>
          {label}
        </span>
      </span>
      {count !== undefined ? (
        <span className="shrink-0 pl-2 text-xs tabular-nums text-muted-foreground">
          ({count})
        </span>
      ) : null}
    </label>
  );
}

export function SidebarCheckboxGroup({
  options,
  values,
  onToggle,
}: {
  options: FilterOptionItem[];
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <>
      {options.map((option) => (
        <SidebarCheckboxOption
          key={option.value}
          label={option.label}
          count={option.count}
          checked={values.includes(option.value)}
          onToggle={() => onToggle(option.value)}
        />
      ))}
    </>
  );
}

type RadioOption = FilterOptionItem;

export function SidebarRadioOption({
  label,
  checked,
  count,
  onSelect,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full cursor-pointer items-center justify-between rounded-lg px-1 py-1.5 text-left text-sm transition-colors hover:bg-[#F9FAFB]"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <SidebarRadioIndicator checked={checked} />
        <span className={checked ? "font-semibold text-[#2d6a4f]" : "text-foreground"}>
          {label}
        </span>
      </span>
      {count !== undefined ? (
        <span className="shrink-0 pl-2 text-xs tabular-nums text-muted-foreground">
          ({count})
        </span>
      ) : null}
    </button>
  );
}

export function SidebarRadioGroup({
  allLabel,
  value,
  options,
  onChange,
}: {
  allLabel: string;
  value?: string;
  options: RadioOption[];
  onChange: (value: string | undefined) => void;
}) {
  return (
    <>
      <SidebarRadioOption
        label={allLabel}
        checked={!value}
        onSelect={() => onChange(undefined)}
      />
      {options.map((option) => (
        <SidebarRadioOption
          key={option.value}
          label={option.label}
          count={option.count}
          checked={value === option.value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </>
  );
}

export function mergeFacetOptions(
  facets: JobFacet[],
  fallback: readonly { label: string; value: string }[],
): RadioOption[] {
  const source =
    facets.length > 0
      ? facets
      : fallback.map((option) => ({ ...option, count: 0 }));

  return source.map((option) => ({
    label: option.label,
    value: option.value,
    count: option.count,
  }));
}

export function toggleFilterValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
