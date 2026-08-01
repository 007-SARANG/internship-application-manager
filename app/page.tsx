"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Application, ApplicationStatus, STATUSES } from "@/lib/types";
import { exportApplications, parseImport } from "@/lib/storage";
import ApplicationCard from "@/components/ApplicationCard";
import ApplicationForm from "@/components/ApplicationForm";
import StatsBar from "@/components/StatsBar";
import ThemeToggle from "@/components/ThemeToggle";

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
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setApps(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  // Persist on change (after initial load).
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch {
      // ignore quota errors
    }
  }, [apps, loaded]);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2500);
  }

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

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImport(String(reader.result));
        setApps((prev) => {
          const byId = new Map(prev.map((a) => [a.id, a]));
          for (const app of imported) byId.set(app.id, app);
          return Array.from(byId.values());
        });
        flash(`Imported ${imported.length} application(s).`);
      } catch (err) {
        flash(err instanceof Error ? err.message : "Import failed.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const selectClass =
    "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-blue-500/20";

  return (
    <div className="min-h-screen">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/70 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-sm">
              IA
            </div>
            <span className="hidden text-sm font-semibold text-slate-900 dark:text-white sm:block">
              Internship Manager
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:block"
            >
              Import
            </button>
            <button
              onClick={() => {
                if (apps.length === 0) return flash("Nothing to export yet.");
                exportApplications(apps);
                flash("Exported to JSON.");
              }}
              className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 sm:block"
            >
              Export
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
            <ThemeToggle />
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-600 hover:to-blue-700"
            >
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Your applications
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track every internship from wishlist to offer — all in one place.
          </p>
        </div>

        <section>
          <StatsBar apps={apps} />
        </section>

        {/* Controls */}
        <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search company, role, location…"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ApplicationStatus | "All")
            }
            className={selectClass}
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
            className={selectClass}
          >
            <option value="recent">Recently added</option>
            <option value="company">Company (A–Z)</option>
            <option value="dateApplied">Date applied</option>
          </select>
          <span className="text-sm text-slate-400 dark:text-slate-500 sm:ml-auto">
            {visible.length} shown
          </span>
        </section>

        {/* List */}
        <section className="mt-6">
          {!loaded ? null : visible.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-14 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">
                {apps.length === 0 ? "📋" : "🔍"}
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                {apps.length === 0 ? "No applications yet" : "No matches"}
              </p>
              <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                {apps.length === 0
                  ? "Add your first internship application to get started."
                  : "Try a different search or filter."}
              </p>
              {apps.length === 0 && (
                <button
                  onClick={openAdd}
                  className="mt-5 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-600 hover:to-blue-700"
                >
                  + Add application
                </button>
              )}
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
      </main>

      {/* Toast */}
      {toast && (
        <div className="animate-fade-in-up fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-slate-700">
          {toast}
        </div>
      )}

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
    </div>
  );
}
