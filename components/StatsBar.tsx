import { Application, STATUSES } from "@/lib/types";

interface Props {
  apps: Application[];
}

export default function StatsBar({ apps }: Props) {
  const total = apps.length;
  const counts = STATUSES.map((status) => ({
    status,
    count: apps.filter((a) => a.status === status).length,
  }));

  const active = apps.filter(
    (a) => a.status !== "Rejected" && a.status !== "Offer" && a.status !== "Wishlist",
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Total
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{total}</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Active
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{active}</p>
      </div>
      {counts.map(({ status, count }) => (
        <div
          key={status}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <p className="truncate text-xs font-medium uppercase tracking-wide text-slate-400">
            {status}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{count}</p>
        </div>
      ))}
    </div>
  );
}
