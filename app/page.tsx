"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Application, ApplicationStatus, STATUSES } from "@/lib/types";
import { exportApplications, parseImport } from "@/lib/storage";
import { isSoundEnabled, setSoundEnabled, playSound } from "@/lib/soundFX";
import { triggerConfetti } from "@/lib/confetti";
import ApplicationCard from "@/components/ApplicationCard";
import ApplicationForm from "@/components/ApplicationForm";
import StatsBar from "@/components/StatsBar";
import ThemeToggle from "@/components/ThemeToggle";
import ParticleBackground from "@/components/ParticleBackground";
import CommandPalette from "@/components/CommandPalette";
import KanbanBoard from "@/components/KanbanBoard";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import ApplicationTableView from "@/components/ApplicationTableView";

const STORAGE_KEY = "internship-applications-v1";
const BACKUP_KEY = "internship-applications-v1-backup";

type SortKey = "recent" | "company" | "dateApplied" | "priority";
type ViewMode = "grid" | "kanban" | "analytics" | "table";

export default function Home() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [formDefaultStatus, setFormDefaultStatus] = useState<ApplicationStatus | undefined>();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [toast, setToast] = useState("");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [showParticles, setShowParticles] = useState(false);
  const [hasBackup, setHasBackup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setApps(JSON.parse(raw));
      } else {
        setApps([]);
      }
      const bkp = localStorage.getItem(BACKUP_KEY);
      if (bkp) setHasBackup(true);
    } catch {
      setApps([]);
    }
    setLoaded(true);
    setSoundActive(isSoundEnabled());
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch {
      // ignore quota errors
    }
  }, [apps, loaded]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3500);
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = apps.filter((a) => {
      const matchesQuery =
        !q ||
        a.company.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        (a.notes && a.notes.toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === "All" || a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      if (sortKey === "company") return a.company.localeCompare(b.company);
      if (sortKey === "dateApplied")
        return (b.dateApplied || "").localeCompare(a.dateApplied || "");
      if (sortKey === "priority") {
        const order = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        const pA = a.priority ? order[a.priority] : 0;
        const pB = b.priority ? order[b.priority] : 0;
        return pB - pA;
      }
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
    setFormDefaultStatus(undefined);
    flash("Application saved!");
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this application?")) return;
    playSound("delete");
    setApps((prev) => prev.filter((a) => a.id !== id));
    flash("Application record removed.");
  }

  function handleStatusChange(app: Application, newStatus: ApplicationStatus) {
    setApps((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: newStatus } : a)),
    );
    flash(`Updated status: ${app.company} → ${newStatus}`);
  }

  function openAdd(defaultSt?: ApplicationStatus) {
    playSound("pop");
    setEditing(null);
    setFormDefaultStatus(defaultSt);
    setShowForm(true);
  }

  function openEdit(app: Application) {
    playSound("pop");
    setEditing(app);
    setFormDefaultStatus(undefined);
    setShowForm(true);
  }

  function handleRestoreBackup() {
    try {
      const bkp = localStorage.getItem(BACKUP_KEY);
      if (bkp) {
        const restored = JSON.parse(bkp);
        setApps(restored);
        playSound("success");
        flash("🎉 Successfully restored your previous applications!");
      } else {
        flash("No previous backup found.");
      }
    } catch {
      flash("Error restoring backup data.");
    }
  }

  function toggleSound() {
    const next = !soundActive;
    setSoundEnabled(next);
    setSoundActive(next);
    if (next) playSound("success");
    flash(`Sound FX ${next ? "Enabled 🔊" : "Muted 🔇"}`);
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
        playSound("success");
        flash(`Imported ${imported.length} application(s).`);
      } catch (err) {
        flash(err instanceof Error ? err.message : "Import failed.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const selectClass =
    "custom-select-pill rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-cyan-500/20";

  return (
    <div className="min-h-screen relative text-slate-900 dark:text-slate-100 bg-grid-pattern">
      {/* Optional Canvas Particles */}
      {showParticles && <ParticleBackground />}

      {/* Modern, Spacious Linear-Grade Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 dark:border-slate-800/80 dark:bg-slate-950/90 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8 gap-4">
          
          {/* Left: Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 text-white font-black shadow-md shadow-blue-500/10">
              ⚡
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Application Manager
              </span>
              <span className="rounded-full bg-blue-50 dark:bg-cyan-500/15 text-blue-700 dark:text-cyan-300 px-2 py-0.5 text-[10px] font-mono font-bold border border-blue-200 dark:border-cyan-500/30">
                PRO
              </span>
            </div>
          </div>

          {/* Center: Spacious Floating Segmented Switcher */}
          <nav className="hidden md:flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 p-1 shadow-inner gap-1">
            <button
              onClick={() => {
                playSound("switch");
                setViewMode("grid");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-cyan-500 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>📊</span>
              <span>Grid</span>
            </button>
            <button
              onClick={() => {
                playSound("switch");
                setViewMode("kanban");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                viewMode === "kanban"
                  ? "bg-white text-purple-600 shadow-sm dark:bg-purple-600 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>📋</span>
              <span>Kanban</span>
            </button>
            <button
              onClick={() => {
                playSound("switch");
                setViewMode("analytics");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                viewMode === "analytics"
                  ? "bg-white text-emerald-600 shadow-sm dark:bg-emerald-600 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>📈</span>
              <span>Analytics</span>
            </button>
            <button
              onClick={() => {
                playSound("switch");
                setViewMode("table");
              }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                viewMode === "table"
                  ? "bg-white text-amber-600 shadow-sm dark:bg-amber-600 dark:text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>📑</span>
              <span>Sheet</span>
            </button>
          </nav>

          {/* Right: Clean, Uncluttered Action Bar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => {
                playSound("pop");
                setCmdOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-300 dark:hover:border-slate-700"
              title="Open Command Search (Cmd + K)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <span className="hidden lg:inline text-slate-500 font-mono text-[11px]">⌘K</span>
            </button>

            {/* More Actions Menu Dropdown */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>Tools</span>
                <svg className={`h-3 w-3 opacity-60 transition-transform ${showMenu ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMenu && (
                <div className="animate-fade-in-up absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl">
                  <button
                    onClick={() => {
                      fileRef.current?.click();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <span>📥</span> Import Data
                  </button>
                  <button
                    onClick={() => {
                      if (apps.length === 0) return flash("Nothing to export yet.");
                      exportApplications(apps);
                      playSound("success");
                      flash("Exported applications JSON!");
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <span>📤</span> Export Data
                  </button>
                  <button
                    onClick={() => {
                      toggleSound();
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <span>{soundActive ? "🔊" : "🔇"}</span> Sound FX ({soundActive ? "ON" : "OFF"})
                  </button>
                  {hasBackup && (
                    <button
                      onClick={() => {
                        handleRestoreBackup();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/60 transition border-t border-slate-100 dark:border-slate-800 mt-1 pt-2"
                    >
                      <span>↩️</span> Restore Backup
                    </button>
                  )}
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />

            <ThemeToggle />

            {/* Add Application Button */}
            <button
              onClick={() => openAdd()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition hover:scale-105 active:scale-95"
            >
              <span className="text-base leading-none">+</span>
              <span>Add Application</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Mobile Segmented Switcher */}
        <div className="md:hidden flex items-center justify-around rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              viewMode === "grid" ? "bg-white text-blue-600 shadow-sm dark:bg-cyan-500 dark:text-white" : "text-slate-500"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              viewMode === "kanban" ? "bg-white text-purple-600 shadow-sm dark:bg-purple-600 dark:text-white" : "text-slate-500"
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewMode("analytics")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              viewMode === "analytics" ? "bg-white text-emerald-600 shadow-sm dark:bg-emerald-600 dark:text-white" : "text-slate-500"
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              viewMode === "table" ? "bg-white text-amber-600 shadow-sm dark:bg-amber-600 dark:text-white" : "text-slate-500"
            }`}
          >
            Sheet
          </button>
        </div>

        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              Application Matrix
              <span className="rounded-full bg-blue-50 text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-300 px-3 py-1 text-xs font-mono font-bold border border-blue-200 dark:border-cyan-500/30">
                {visible.length} Total Targets
              </span>
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track, organize, and manage your internship application pipeline.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerConfetti}
              className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
            >
              🎉 Trigger Victory FX
            </button>
          </div>
        </div>

        {/* Stats HUD Tiles */}
        <section>
          <StatsBar apps={apps} />
        </section>

        {/* View Mode Switching */}
        {viewMode === "kanban" ? (
          <section className="animate-fade-in-up">
            <KanbanBoard
              apps={apps}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onAddInStatus={(st) => openAdd(st)}
            />
          </section>
        ) : viewMode === "analytics" ? (
          <section className="animate-fade-in-up">
            <AnalyticsDashboard apps={apps} />
          </section>
        ) : viewMode === "table" ? (
          <section className="animate-fade-in-up">
            <ApplicationTableView
              apps={visible}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </section>
        ) : (
          /* Grid View */
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <section className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-xs">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search company, role, location…"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:ring-cyan-500/20"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ApplicationStatus | "All")
                }
                className={selectClass}
              >
                <option value="All">All Statuses</option>
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
                <option value="recent">Recently Added</option>
                <option value="company">Company Name (A–Z)</option>
                <option value="dateApplied">Applied Date</option>
                <option value="priority">Priority Level</option>
              </select>

              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 sm:ml-auto">
                Showing {visible.length} of {apps.length}
              </span>
            </section>

            {/* Application Cards Grid */}
            <section>
              {!loaded ? null : visible.length === 0 ? (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 dark:bg-slate-800 dark:text-cyan-400">
                    {apps.length === 0 ? "📋" : "🔍"}
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {apps.length === 0 ? "No Applications Yet" : "No Matching Targets"}
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                    {apps.length === 0
                      ? "Add your first internship application to start tracking."
                      : "Try adjusting your search query or filter options."}
                  </p>
                  {apps.length === 0 && (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => openAdd()}
                        className="rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:scale-105 transition"
                      >
                        + Add Application
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {visible.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      app={app}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="animate-fade-in-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
          ⚡ {toast}
        </div>
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        apps={apps}
        onSelectApp={(app) => openEdit(app)}
        onAddApp={() => openAdd()}
        onSwitchView={(vm) => setViewMode(vm)}
        onToggleSound={toggleSound}
        soundEnabled={soundActive}
      />

      {/* Add / Edit Form Modal */}
      {showForm && (
        <ApplicationForm
          initial={editing}
          defaultStatus={formDefaultStatus}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
            setFormDefaultStatus(undefined);
          }}
        />
      )}
    </div>
  );
}
