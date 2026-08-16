"use client";

import { useEffect, useRef, useState } from "react";
import { ApplicationStatus, STATUSES, STATUS_DOT } from "@/lib/types";

interface Props {
  status: ApplicationStatus;
  onChange?: (newStatus: ApplicationStatus) => void;
  readOnly?: boolean;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { bgLight: string; textLight: string; borderLight: string; bgDark: string; textDark: string; borderDark: string }
> = {
  Wishlist: {
    bgLight: "bg-slate-100",
    textLight: "text-slate-700",
    borderLight: "border-slate-300",
    bgDark: "dark:bg-slate-800/90",
    textDark: "dark:text-slate-200",
    borderDark: "dark:border-slate-700",
  },
  Applied: {
    bgLight: "bg-blue-50",
    textLight: "text-blue-700",
    borderLight: "border-blue-200",
    bgDark: "dark:bg-blue-950/80",
    textDark: "dark:text-blue-300",
    borderDark: "dark:border-blue-800/60",
  },
  "Online Assessment": {
    bgLight: "bg-amber-50",
    textLight: "text-amber-800",
    borderLight: "border-amber-200",
    bgDark: "dark:bg-amber-950/80",
    textDark: "dark:text-amber-300",
    borderDark: "dark:border-amber-800/60",
  },
  Interview: {
    bgLight: "bg-purple-50",
    textLight: "text-purple-700",
    borderLight: "border-purple-200",
    bgDark: "dark:bg-purple-950/80",
    textDark: "dark:text-purple-300",
    borderDark: "dark:border-purple-800/60",
  },
  Offer: {
    bgLight: "bg-emerald-50",
    textLight: "text-emerald-700",
    borderLight: "border-emerald-300",
    bgDark: "dark:bg-emerald-950/80",
    textDark: "dark:text-emerald-300",
    borderDark: "dark:border-emerald-800/60",
  },
  Rejected: {
    bgLight: "bg-rose-50",
    textLight: "text-rose-700",
    borderLight: "border-rose-200",
    bgDark: "dark:bg-rose-950/80",
    textDark: "dark:text-rose-300",
    borderDark: "dark:border-rose-800/60",
  },
};

export default function StatusBadge({ status, onChange, readOnly = false, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Wishlist;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        disabled={readOnly}
        onClick={() => !readOnly && setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-150 font-semibold shadow-xs ${
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs"
        } ${cfg.bgLight} ${cfg.textLight} ${cfg.borderLight} ${cfg.bgDark} ${cfg.textDark} ${cfg.borderDark} ${
          !readOnly ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : "cursor-default"
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
        <span>{status}</span>
        {!readOnly && (
          <svg
            className={`h-3 w-3 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Floating Menu Popover */}
      {open && (
        <div className="animate-fade-in-up absolute right-0 z-50 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Change Stage
          </div>
          {STATUSES.map((s) => {
            const isSelected = s === status;
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (onChange) onChange(s);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} />
                  {s}
                </span>
                {isSelected && <span className="text-blue-600 dark:text-cyan-400">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
