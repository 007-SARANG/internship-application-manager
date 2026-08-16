"use client";

import { Application, ApplicationStatus, PRIORITY_STYLES } from "@/lib/types";
import { playSound } from "@/lib/soundFX";
import { triggerConfetti } from "@/lib/confetti";
import StatusBadge from "@/components/StatusBadge";

interface Props {
  apps: Application[];
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange: (app: Application, newStatus: ApplicationStatus) => void;
}

export default function ApplicationTableView({
  apps,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  return (
    <div className="thin-scroll overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-sm text-slate-800 dark:text-slate-200">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/80 dark:text-cyan-400">
          <tr>
            <th className="px-4 py-3.5">Company</th>
            <th className="px-4 py-3.5">Role</th>
            <th className="px-4 py-3.5">Location</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Priority</th>
            <th className="px-4 py-3.5">Salary</th>
            <th className="px-4 py-3.5">Applied Date</th>
            <th className="px-4 py-3.5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
          {apps.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                No application records found.
              </td>
            </tr>
          ) : (
            apps.map((app) => (
              <tr
                key={app.id}
                className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                  {app.company}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-blue-600 dark:text-cyan-300">
                  {app.role || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  {app.location || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <StatusBadge
                    status={app.status}
                    size="sm"
                    onChange={(ns) => {
                      playSound(ns === "Offer" ? "offer" : "switch");
                      if (ns === "Offer") triggerConfetti();
                      onStatusChange(app, ns);
                    }}
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  {app.priority ? (
                    <span
                      className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                        PRIORITY_STYLES[app.priority]
                      }`}
                    >
                      {app.priority}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  {app.salary || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400">
                  {app.dateApplied || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right">
                  <div className="flex justify-end gap-2">
                    {app.link && (
                      <a
                        href={app.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded px-2 py-1 text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                      >
                        Link
                      </a>
                    )}
                    <button
                      onClick={() => {
                        playSound("click");
                        onEdit(app);
                      }}
                      className="rounded px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        playSound("delete");
                        onDelete(app.id);
                      }}
                      className="rounded px-2 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
