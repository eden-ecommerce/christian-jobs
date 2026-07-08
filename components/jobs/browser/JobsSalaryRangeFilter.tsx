"use client";

import {
  SALARY_FROM_OPTIONS,
  SALARY_TO_OPTIONS,
} from "@lib/jobs/search-params";
import { ChevronDown } from "lucide-react";

type Props = {
  minSalary?: number;
  maxSalary?: number;
  onChange: (changes: { minSalary?: number; maxSalary?: number }) => void;
  compact?: boolean;
};

function SalarySelect({
  label,
  value,
  options,
  onChange,
  compact = false,
}: {
  label: string;
  value?: string;
  options: readonly { label: string; value: string }[];
  onChange: (value: string | undefined) => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "min-w-0 flex-1" : undefined}>
      <label
        className={
          compact
            ? "mb-1 block text-xs font-medium text-muted-foreground"
            : "mb-1.5 block text-xs font-medium text-muted-foreground"
        }
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(event) =>
            onChange(event.target.value ? event.target.value : undefined)
          }
          aria-label={`Salary ${label.toLowerCase()}`}
          className={
            compact
              ? "h-9 w-full cursor-pointer appearance-none rounded-lg border border-border bg-background py-0 pl-2.5 pr-8 text-sm text-foreground outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
              : "h-10 w-full cursor-pointer appearance-none rounded-xl border border-[#E5E7EB] bg-white py-0 pl-3 pr-8 text-sm text-foreground outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/15"
          }
        >
          {options.map((option) => (
            <option key={option.value || "default"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/** From/to salary range picker for job search filters. */
export function JobsSalaryRangeFilter({
  minSalary,
  maxSalary,
  onChange,
  compact = false,
}: Props) {
  const activeMinSalary = minSalary ? String(minSalary) : undefined;
  const activeMaxSalary = maxSalary ? String(maxSalary) : undefined;

  return (
    <div className={compact ? "flex gap-2" : "space-y-3"}>
      <SalarySelect
        label="From"
        value={activeMinSalary}
        options={SALARY_FROM_OPTIONS}
        compact={compact}
        onChange={(value) => {
          const nextMin = value ? Number(value) : undefined;
          onChange({
            minSalary: nextMin,
            maxSalary:
              nextMin && maxSalary && nextMin > maxSalary ? undefined : maxSalary,
          });
        }}
      />
      <SalarySelect
        label="To"
        value={activeMaxSalary}
        options={SALARY_TO_OPTIONS}
        compact={compact}
        onChange={(value) => {
          const nextMax = value ? Number(value) : undefined;
          onChange({
            maxSalary: nextMax,
            minSalary:
              nextMax && minSalary && nextMax < minSalary ? undefined : minSalary,
          });
        }}
      />
    </div>
  );
}
