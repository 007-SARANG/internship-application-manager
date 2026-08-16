"use client";

import {
  Application,
  ApplicationStatus,
  STATUS_BORDER,
  PRIORITY_STYLES,
} from "@/lib/types";
import { playSound } from "@/lib/soundFX";
import { triggerConfetti } from "@/lib/confetti";
import StatusBadge from "@/components/StatusBadge";

interface Props {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (app: Application, newStatus: ApplicationStatus) => void;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApplicationCard({
  app,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  return (
    <div
      onMouseEnter={() => playSound("hover")}
      className={`animate-fade-in-up group flex flex-col justify-between rounded-2xl border border-l-4 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900/90 dark:border-slate-800 ${
        STATUS_BORDER[app.status]
      } border-slate-200`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors">
              {app.role || "Untitled role"}
            </h3>
            <p className="mt-0.5 truncate text-sm font-semibold text-slate-600 dark:text-cyan-400">
              {app.company || "Unknown company"}
            </p>
          </div>

          {/* Custom Popover Status Badge */}
          <StatusBadge
            status={app.status}
            onChange={(newSt) => {
              playSound(newSt === "Offer" ? "offer" : "switch");
              if (newSt === "Offer") triggerConfetti();
              if (onStatusChange) onStatusChange(app, newSt);
            }}
          />
        </div>

        {/* Priority & Salary */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          {app.priority && (
            <span
              className={`rounded-md border px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${
                PRIORITY_STYLES[app.priority]
              }`}
            >
              ⚡ {app.priority} Priority
            </span>
          )}
          {app.salary && (
            <span className="rounded-md border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-900/70 dark:text-emerald-200">
              💰 {app.salary}
            </span>
          )}
        </div>

        {/* Details Grid */}
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="col-span-1 min-w-0">
            <dt className="font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Location
            </dt>
            <dd className="mt-0.5 truncate text-slate-700 dark:text-slate-300 font-medium">
              {app.location || "—"}
            </dd>
          </div>
          <div className="col-span-1">
            <dt className="font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Applied Date
            </dt>
            <dd className="mt-0.5 text-slate-700 dark:text-slate-300 font-medium">
              {formatDate(app.dateApplied)}
            </dd>
          </div>

          {app.contactName && (
            <div className="col-span-2 mt-1 rounded-lg bg-slate-100/80 p-2 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700">
              <dt className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                Contact Lead
              </dt>
              <dd className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {app.contactName}{" "}
                {app.contactEmail && (
                  <span className="text-slate-500 dark:text-slate-400">
                    ({app.contactEmail})
                  </span>
                )}
              </dd>
            </div>
          )}
        </dl>

        {app.notes && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            {app.notes}
          </p>
        )}
      </div>

      {/* Footer Controls */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3">
        {app.link ? (
          <a
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound("click")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-cyan-400 transition hover:underline"
          >
            <span>Posting Portal</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10"/>
            </svg>
          </a>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-600">No URL</span>
        )}

        <div className="flex gap-1.5">
          <button
            onClick={() => {
              playSound("click");
              onEdit(app);
            }}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          >
            Edit
          </button>
          <button
            onClick={() => {
              playSound("delete");
              onDelete(app.id);
            }}
            className="rounded-lg bg-rose-100 dark:bg-rose-950/80 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 transition hover:bg-rose-200 dark:hover:bg-rose-900/80 border border-rose-200 dark:border-rose-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
