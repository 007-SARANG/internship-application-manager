"use client";

import { Application, STATUSES, STATUS_DOT } from "@/lib/types";

interface Props {
  apps: Application[];
}

function Tile({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: number;
  sub?: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/60 dark:hover:border-slate-700">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-cyan-400" />
          {sub}
        </p>
      )}
    </div>
  );
}

export default function StatsBar({ apps }: Props) {
  const total = apps.length;
  const active = apps.filter(
    (a) =>
      a.status === "Applied" ||
      a.status === "Online Assessment" ||
      a.status === "Interview",
  ).length;
  const offers = apps.filter((a) => a.status === "Offer").length;
  const interviews = apps.filter((a) => a.status === "Interview").length;

  const counts = STATUSES.map((status) => ({
    status,
    count: apps.filter((a) => a.status === status).length,
  }));

  return (
    <div className="space-y-5">
      {/* Metric Tiles */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <Tile
          label="Total Applications"
          value={total}
          sub="All tracked targets"
          accent="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16"/></svg>
          }
        />
        <Tile
          label="In Progress"
          value={active}
          sub="Active responses pending"
          accent="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          }
        />
        <Tile
          label="Interviews"
          value={interviews}
          sub="Scheduled tech rounds"
          accent="bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          }
        />
        <Tile
          label="Offers Won"
          value={offers}
          sub="🎉 Victory achievements"
          accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          }
        />
      </div>

      {/* Pipeline Progress */}
      {total > 0 && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pipeline Distribution
            </p>
            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
              {total} Total
            </span>
          </div>

          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {counts
              .filter((c) => c.count > 0)
              .map((c) => (
                <div
                  key={c.status}
                  className={`${STATUS_DOT[c.status]} transition-all duration-300`}
                  style={{ width: `${(c.count / total) * 100}%` }}
                  title={`${c.status}: ${c.count}`}
                />
              ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {counts.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {status}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
