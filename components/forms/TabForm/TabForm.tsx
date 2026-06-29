"use client";

import { cn } from "@lib/utils";
import type { ReactNode } from "react";

export type TabDefinition<TTab extends string> = {
  value: TTab;
  label: string;
};

type TabFormProps<TTab extends string> = {
  tabs: TabDefinition<TTab>[];
  activeTab: TTab;
  onTabChange: (tab: TTab) => void;
  onBeforeTabChange?: (from: TTab, to: TTab) => boolean | Promise<boolean>;
  children: ReactNode;
  className?: string;
};

export function TabForm<TTab extends string>({
  tabs,
  activeTab,
  onTabChange,
  onBeforeTabChange,
  children,
  className,
}: TabFormProps<TTab>) {
  const handleTabClick = (nextTab: TTab) => {
    if (nextTab === activeTab) return;

    void (async () => {
      if (onBeforeTabChange) {
        const allowed = await onBeforeTabChange(activeTab, nextTab);
        if (!allowed) return;
      }
      onTabChange(nextTab);
    })();
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div
        role="tablist"
        aria-label="Form sections"
        className="flex flex-wrap gap-2 border-b border-border pb-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={tab.value === activeTab}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab.value === activeTab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground",
            )}
            onClick={() => handleTabClick(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{children}</div>
    </div>
  );
}
