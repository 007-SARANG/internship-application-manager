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

  useEffect(() => {
    if (initial) {
      const { id: _id, createdAt: _createdAt, ...rest } = initial;
      setForm(rest);
    } else {
      setForm(emptyForm());
    }
  }, [initial]);

  function update<K extends keyof ReturnType<typeof emptyForm>>(
    key: K,
    value: string,
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() && !form.role.trim()) {
      return;
    }
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      createdAt: initial?.createdAt ?? Date.now(),
      ...form,
    });
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900">
          {initial ? "Edit application" : "Add application"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Company
              </label>
              <input
                className={inputClass}
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Acme Corp"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Role
              </label>
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
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Location
              </label>
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Remote / San Francisco, CA"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
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
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Date applied
              </label>
              <input
                type="date"
                className={inputClass}
                value={form.dateApplied}
                onChange={(e) => update("dateApplied", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Link
              </label>
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
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Referral from…, recruiter contact, next steps"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {initial ? "Save changes" : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
