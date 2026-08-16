"use client";

import { Application, STATUSES, STATUS_DOT } from "@/lib/types";

interface Props {
  apps: Application[];
}

export default function AnalyticsDashboard({ apps }: Props) {
  const total = apps.length;
  const applied = apps.filter((a) => a.status !== "Wishlist").length;
  const interviews = apps.filter(
    (a) => a.status === "Interview" || a.status === "Offer",
  ).length;
  const offers = apps.filter((a) => a.status === "Offer").length;

  const responseRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0;
  const offerRate = applied > 0 ? Math.round((offers / applied) * 100) : 0;

  const highUrgentCount = apps.filter(
    (a) => a.priority === "High" || a.priority === "Urgent",
  ).length;

  const salaries = apps
    .map((a) => a.salary)
    .filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl text-blue-600 dark:text-cyan-400">
            01
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            Response Rate
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {responseRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Applied to Interview
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-blue-600 dark:bg-cyan-500 transition-all duration-500"
              style={{ width: `${responseRate}%` }}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl text-emerald-600 dark:text-emerald-400">
            02
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Offer Conversion Rate
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {offerRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Applied to Offer
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500"
              style={{ width: `${offerRate}%` }}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl text-purple-600 dark:text-purple-400">
            03
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            High Priority Leads
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {highUrgentCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              High / Urgent targets
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-purple-600 dark:bg-purple-500 transition-all duration-500"
              style={{ width: `${total ? (highUrgentCount / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-4xl text-amber-600 dark:text-amber-400">
            04
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Tracked Compensation
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {salaries.length}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Roles with salary tags
            </span>
          </div>
          <div className="mt-3 flex gap-1 text-[11px] font-mono text-slate-600 dark:text-amber-300 truncate">
            {salaries.slice(0, 2).join(" • ") || "No salary tags set yet"}
          </div>
        </div>
      </div>

      {/* Funnel Pipeline Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>⚡</span> Application Funnel Visualizer
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed step-by-step breakdown of your internship search progress
        </p>

        <div className="mt-6 space-y-4">
          {STATUSES.map((status) => {
            const count = apps.filter((a) => a.status === status).length;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={status} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {count} apps
                    </span>
                    <span className="w-12 text-right font-mono font-bold text-blue-600 dark:text-cyan-400">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full ${STATUS_DOT[status]} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
