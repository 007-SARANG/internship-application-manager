"use client";

import { useEffect, useMemo, useState } from "react";
import { Application, ApplicationStatus, STATUSES } from "@/lib/types";
import ApplicationCard from "@/components/ApplicationCard";
import ApplicationForm from "@/components/ApplicationForm";
import StatsBar from "@/components/StatsBar";

const STORAGE_KEY = "internship-applications-v1";

type SortKey = "recent" | "company" | "dateApplied";

export default function Home() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">(
    "All",
  );
  const [sortKey, setSortKey] = useState<SortKey>("recent");

  // Load from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setApps(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  // Persist whenever apps change (after initial load).
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch {
      // ignore quota errors
    }
  }, [apps, loaded]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = apps.filter((a) => {
      const matchesQuery =
        !q ||
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      if (sortKey === "company") return a.company.localeCompare(b.company);
      if (sortKey === "dateApplied")
        return (b.dateApplied || "").localeCompare(a.dateApplied || "");
      return b.createdAt - a.createdAt;
    });

    return list;
  }, [apps, query, statusFilter, sortKey]);

  function handleSave(app: Application) {
    setApps((prev) => {
      const exists = prev.some((a) => a.id === app.id);
      return exists
        ? prev.map((a) => (a.id === app.id ? app : a))
        : [app, ...prev];
    });
    setShowForm(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;
    setApps((prev) => prev.filter((a) => a.id !== id));
  }

  function openAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(app: Application) {
    setEditing(app);
    setShowForm(true);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Internship Application Manager
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track every application from wishlist to offer.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <span className="text-lg leading-none">+</span> Add application
        </button>
      </header>

      <section className="mt-6">
        <StatsBar apps={apps} />
      </section>

      <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search company, role, location…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ApplicationStatus | "All")
          }
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="recent">Sort: Recently added</option>
          <option value="company">Sort: Company (A–Z)</option>
          <option value="dateApplied">Sort: Date applied</option>
        </select>
      </section>

      <section className="mt-6">
        {!loaded ? null : visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-500">
              {apps.length === 0
                ? "No applications yet. Click “Add application” to get started."
                : "No applications match your filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <ApplicationForm
          initial={editing}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}
