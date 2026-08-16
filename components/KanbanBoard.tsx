"use client";

import { Application, ApplicationStatus, STATUSES, STATUS_DOT } from "@/lib/types";
import { playSound } from "@/lib/soundFX";
import { triggerConfetti } from "@/lib/confetti";
import StatusBadge from "@/components/StatusBadge";

interface Props {
  apps: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange: (app: Application, newStatus: ApplicationStatus) => void;
  onAddInStatus: (status: ApplicationStatus) => void;
}

export default function KanbanBoard({
  apps,
  onEdit,
  onDelete,
  onStatusChange,
  onAddInStatus,
}: Props) {
  return (
    <div className="thin-scroll flex gap-4 overflow-x-auto pb-6 pt-2">
      {STATUSES.map((status) => {
        const columnApps = apps.filter((a) => a.status === status);

        return (
          <div
            key={status}
            className="flex w-80 shrink-0 flex-col rounded-2xl border border-slate-200 bg-slate-100/70 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur"
          >
            {/* Column Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${STATUS_DOT[status]}`} />
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-wide">
                  {status}
                </h3>
                <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-cyan-400 border border-slate-300 dark:border-slate-700">
                  {columnApps.length}
                </span>
              </div>
              <button
                onClick={() => {
                  playSound("pop");
                  onAddInStatus(status);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white transition shadow-sm"
                title={`Add application under ${status}`}
              >
                +
              </button>
            </div>

            {/* Column Cards */}
            <div className="thin-scroll flex-1 space-y-3 overflow-y-auto max-h-[680px] pr-1">
              {columnApps.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-4 text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500">No applications</p>
                  <button
                    onClick={() => onAddInStatus(status)}
                    className="mt-2 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    + Add item
                  </button>
                </div>
              ) : (
                columnApps.map((app) => (
                  <div
                    key={app.id}
                    className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-bold text-slate-900 dark:text-white text-sm">
                          {app.role || "Untitled Role"}
                        </h4>
                        <p className="truncate text-xs font-semibold text-blue-600 dark:text-cyan-400 mt-0.5">
                          {app.company || "Unknown Company"}
                        </p>
                      </div>
                      {app.salary && (
                        <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900/70 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700/60">
                          {app.salary}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{app.location || "Remote"}</span>
                      {app.dateApplied && <span>{app.dateApplied}</span>}
                    </div>

                    {app.priority && (
                      <div className="mt-2">
                        <span
                          className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold ${
                            app.priority === "Urgent"
                              ? "bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-900/70 dark:text-rose-200 dark:border-rose-700/60"
                              : app.priority === "High"
                              ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/70 dark:text-amber-200 dark:border-amber-700/60"
                              : app.priority === "Medium"
                              ? "bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-900/70 dark:text-sky-200 dark:border-sky-700/60"
                              : "bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          ⚡ {app.priority} Priority
                        </span>
                      </div>
                    )}

                    {/* Quick Move Selector */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                      <StatusBadge
                        status={app.status}
                        size="sm"
                        onChange={(newSt) => {
                          playSound(newSt === "Offer" ? "offer" : "switch");
                          if (newSt === "Offer") triggerConfetti();
                          onStatusChange(app, newSt);
                        }}
                      />

                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            playSound("click");
                            onEdit(app);
                          }}
                          className="rounded px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            playSound("delete");
                            onDelete(app.id);
                          }}
                          className="rounded px-2 py-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
