import { Application, STATUS_STYLES } from "@/lib/types";

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
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {app.role || "Untitled role"}
          </h3>
          <p className="truncate text-sm font-medium text-slate-600">
            {app.company || "Unknown company"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[app.status]}`}
        >
          {app.status}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-500">
        <div className="col-span-1">
          <dt className="text-xs uppercase tracking-wide text-slate-400">
            Location
          </dt>
          <dd className="truncate text-slate-700">{app.location || "—"}</dd>
        </div>
        <div className="col-span-1">
          <dt className="text-xs uppercase tracking-wide text-slate-400">
            Applied
          </dt>
          <dd className="text-slate-700">{formatDate(app.dateApplied)}</dd>
        </div>
      </dl>

      {app.notes && (
        <p className="line-clamp-3 whitespace-pre-wrap text-sm text-slate-600">
          {app.notes}
        </p>
      )}

      <div className="mt-1 flex items-center justify-between gap-2">
        {app.link ? (
          <a
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View posting ↗
          </a>
        ) : (
          <span className="text-sm text-slate-400">No link</span>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(app)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(app.id)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
