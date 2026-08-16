"use client";

import { useEffect, useState } from "react";
import { Application } from "@/lib/types";
import { playSound } from "@/lib/soundFX";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  apps: Application[];
  onSelectApp: (app: Application) => void;
  onAddApp: () => void;
  onSwitchView: (view: "grid" | "kanban" | "analytics" | "table") => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
}

export default function CommandPalette({
  isOpen,
  onClose,
  apps,
  onSelectApp,
  onAddApp,
  onSwitchView,
  onToggleSound,
  soundEnabled,
}: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        playSound("pop");
        if (isOpen) onClose();
        else {
          setQuery("");
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredApps = apps.filter(
    (a) =>
      a.company.toLowerCase().includes(query.toLowerCase()) ||
      a.role.toLowerCase().includes(query.toLowerCase()) ||
      a.location.toLowerCase().includes(query.toLowerCase()) ||
      a.status.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="animate-panel-in thin-scroll w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
          <span className="text-blue-600 dark:text-cyan-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search application..."
            className="w-full bg-transparent text-base text-slate-900 placeholder-slate-400 dark:text-white dark:placeholder-slate-500 outline-none"
            autoFocus
          />
          <kbd className="hidden rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Command Options List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                Quick Actions
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    playSound("click");
                    onAddApp();
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <span>➕</span> Add New Application
                  </span>
                  <span className="text-xs text-slate-400">Shortcut</span>
                </button>
                <button
                  onClick={() => {
                    onToggleSound();
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 transition hover:bg-emerald-50 dark:hover:bg-emerald-500/20"
                >
                  <span className="flex items-center gap-2">
                    <span>{soundEnabled ? "🔊" : "🔇"}</span> Toggle Sound FX ({soundEnabled ? "ON" : "OFF"})
                  </span>
                  <span className="text-xs text-slate-400">Audio</span>
                </button>
              </div>
            </div>
          )}

          {/* Switch Views */}
          {!query && (
            <div>
              <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Switch Display Mode
              </p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                <button
                  onClick={() => {
                    playSound("switch");
                    onSwitchView("grid");
                    onClose();
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:border-cyan-500/50 transition"
                >
                  📊 Grid Cards
                </button>
                <button
                  onClick={() => {
                    playSound("switch");
                    onSwitchView("kanban");
                    onClose();
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 hover:border-purple-500 hover:bg-purple-50 dark:hover:border-purple-500/50 transition"
                >
                  📋 Kanban Board
                </button>
                <button
                  onClick={() => {
                    playSound("switch");
                    onSwitchView("analytics");
                    onClose();
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:border-emerald-500/50 transition"
                >
                  📈 Analytics HUD
                </button>
                <button
                  onClick={() => {
                    playSound("switch");
                    onSwitchView("table");
                    onClose();
                  }}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 hover:border-amber-500 hover:bg-amber-50 dark:hover:border-amber-500/50 transition"
                >
                  📑 Cyber Sheet
                </button>
              </div>
            </div>
          )}

          {/* Applications Search Results */}
          <div>
            <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
              Applications ({filteredApps.length})
            </p>
            {filteredApps.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-slate-500">
                No applications matching &quot;{query}&quot;
              </p>
            ) : (
              <div className="space-y-1">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => {
                      playSound("click");
                      onSelectApp(app);
                      onClose();
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{app.company}</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {app.role} • {app.location || "Remote"}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-cyan-300 border border-slate-200 dark:border-slate-700">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60 px-4 py-2 text-xs text-slate-500">
          <span>Raycast-style Command Navigator</span>
          <span>
            Press <kbd className="rounded bg-slate-200 dark:bg-slate-800 px-1 py-0.5 text-slate-700 dark:text-slate-300 font-semibold">Esc</kbd> to exit
          </span>
        </div>
      </div>
    </div>
  );
}
