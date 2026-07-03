"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

type Props = {
  label: string;
  active?: boolean;
  activeCount?: number;
  children: React.ReactNode;
  onClose?: () => void;
};

/** Accessible filter pill with popover dropdown and focus trap. */
export function FilterPopover({
  label,
  active = false,
  activeCount,
  children,
  onClose,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
    triggerRef.current?.focus({ preventScroll: true });
  }, [onClose]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };

    const handleReposition = () => updatePosition();

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
      window.clearTimeout(timer);
    };
  }, [open, close, updatePosition]);

  const panel =
    open && mounted ? (
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-label={`${label} filter`}
        style={{ top: position.top, left: position.left }}
        className="fixed z-[200] min-w-[220px] max-w-[min(320px,calc(100vw-2rem))] rounded-lg border border-border bg-popover p-3 shadow-lg"
      >
        {children}
      </div>
    ) : null;

  return (
    <div className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          active
            ? "border-[#2d6a4f]/25 bg-[#2d6a4f]/[0.06] text-[#3d6b52]"
            : "border-border bg-card text-foreground hover:border-[#2d6a4f]/50"
        }`}
      >
        {label}
        {activeCount && activeCount > 0 ? (
          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f]/15 px-1 text-[11px] font-semibold text-[#3d6b52]">
            {activeCount}
          </span>
        ) : null}
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {panel && createPortal(panel, document.body)}
    </div>
  );
}

export function FilterOption({
  type,
  name,
  label,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[#2d6a4f]"
      />
      <span className={checked ? "font-medium text-foreground" : "text-foreground"}>
        {label}
      </span>
    </label>
  );
}
