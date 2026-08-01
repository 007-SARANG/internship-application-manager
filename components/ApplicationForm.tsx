"use client";

import { useEffect, useState } from "react";
import { Application, ApplicationStatus, STATUSES } from "@/lib/types";

interface Props {
  initial?: Application | null;
  onSave: (app: Application) => void;
  onClose: () => void;
}

function emptyForm(): Omit<Application, "id" | "createdAt"> {
  return {
    company: "",
    role: "",
    location: "",
    status: "Wishlist",
    dateApplied: "",
    link: "",
    notes: "",
  };
}

export default function ApplicationForm({ initial, onSave, onClose }: Props) {
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      const { id: _id, createdAt: _createdAt, ...rest } = initial;
      setForm(rest);
    } else {
      setForm(emptyForm());
    }
    setError("");
  }, [initial]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function update<K extends keyof ReturnType<typeof emptyForm>>(
    key: K,
    value: string,
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() && !form.role.trim()) {
      setError("Enter at least a company or a role.");
      return;
    }
    if (form.link && !/^https?:\/\//i.test(form.link.trim())) {
      setError("Link must start with http:// or https://");
      return;
    }
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      createdAt: initial?.createdAt ?? Date.now(),
      ...form,
    });
  }

  const label =
    "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";
  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/20 dark:[color-scheme:dark]";

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="animate-panel-in thin-scroll max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initial ? "Edit application" : "Add application"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Company</label>
              <input
                className={inputClass}
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Acme Corp"
                autoFocus
              />
            </div>
            <div>
              <label className={label}>Role</label>
              <input
                className={inputClass}
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="Software Engineering Intern"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Location</label>
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Remote / San Francisco, CA"
              />
            </div>
            <div>
              <label className={label}>Status</label>
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) =>
                  update("status", e.target.value as ApplicationStatus)
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={label}>Date applied</label>
              <input
                type="date"
                className={inputClass}
                value={form.dateApplied}
                onChange={(e) => update("dateApplied", e.target.value)}
              />
            </div>
            <div>
              <label className={label}>Link</label>
              <input
                type="url"
                className={inputClass}
                value={form.link}
                onChange={(e) => update("link", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className={label}>Notes</label>
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Referral from…, recruiter contact, next steps"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-600 hover:to-blue-700"
            >
              {initial ? "Save changes" : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
