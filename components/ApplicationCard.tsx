import {
  Application,
  STATUS_STYLES,
  STATUS_BORDER,
} from "@/lib/types";

interface Props {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
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

export default function ApplicationCard({ app, onEdit, onDelete }: Props) {
  return (
    <div
      className={`animate-fade-in-up group flex flex-col gap-4 rounded-2xl border border-l-4 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:bg-slate-900/60 dark:backdrop-blur ${STATUS_BORDER[app.status]} border-slate-200 dark:border-slate-800`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
            {app.role || "Untitled role"}
          </h3>
          <p className="mt-0.5 truncate text-sm font-medium text-slate-600 dark:text-slate-400">
            {app.company || "Unknown company"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[app.status]}`}
        >
          {app.status}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="col-span-1 min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Location
          </dt>
          <dd className="mt-0.5 truncate text-slate-700 dark:text-slate-300">
            {app.location || "—"}
          </dd>
        </div>
        <div className="col-span-1">
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Applied
          </dt>
          <dd className="mt-0.5 text-slate-700 dark:text-slate-300">
            {formatDate(app.dateApplied)}
          </dd>
        </div>
      </dl>

      {app.notes && (
        <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {app.notes}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        {app.link ? (
          <a
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>View posting</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10"/>
            </svg>
          </a>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-600">No link</span>
        )}
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(app)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(app.id)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
