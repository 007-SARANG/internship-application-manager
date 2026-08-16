"use client";

import { useEffect, useState } from "react";
import { Application, ApplicationPriority, ApplicationStatus, PRIORITIES, STATUSES } from "@/lib/types";
import { playSound } from "@/lib/soundFX";
import { triggerConfetti } from "@/lib/confetti";

interface Props {
  initial?: Application | null;
  onSave: (app: Application) => void;
  onClose: () => void;
  defaultStatus?: ApplicationStatus;
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
    salary: "",
    priority: "Medium",
    contactName: "",
    contactEmail: "",
    deadline: "",
  };
}

export default function ApplicationForm({ initial, onSave, onClose, defaultStatus }: Props) {
  const [form, setForm] = useState(emptyForm());
  const [activeTab, setActiveTab] = useState<"specs" | "details" | "contacts">("specs");
  const [error, setError] = useState("");

  useEffect(() => {
    playSound("pop");
    if (initial) {
      const { id: _id, createdAt: _createdAt, ...rest } = initial;
      setForm({
        ...emptyForm(),
        ...rest,
      });
    } else {
      setForm({
        ...emptyForm(),
        status: defaultStatus || "Wishlist",
      });
    }
    setError("");
  }, [initial, defaultStatus]);

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

    if (form.status === "Offer") {
      playSound("offer");
      triggerConfetti();
    } else {
      playSound("success");
    }

    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      createdAt: initial?.createdAt ?? Date.now(),
      ...form,
    });
  }

  const label = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300";
  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-cyan-500 dark:focus:ring-cyan-500/20";

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="animate-panel-in thin-scroll max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚡</span> {initial ? "Edit Application" : "Add Application Target"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fill in application parameters for live tracking
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex border-b border-slate-200 dark:border-slate-800 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "specs"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-300"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            }`}
          >
            1. Core Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "details"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-300"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            }`}
          >
            2. Salary & Priority
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contacts")}
            className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "contacts"
                ? "border-b-2 border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-300"
                : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            }`}
          >
            3. Contacts & Notes
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {activeTab === "specs" && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Company Name *</label>
                  <input
                    className={inputClass}
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="e.g. OpenAI, Google, Stripe"
                    autoFocus
                  />
                </div>
                <div>
                  <label className={label}>Role / Title *</label>
                  <input
                    className={inputClass}
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    placeholder="e.g. Software Engineering Intern"
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
                    placeholder="e.g. San Francisco, CA / Remote"
                  />
                </div>
                <div>
                  <label className={label}>Application Status</label>
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
                  <label className={label}>Date Applied</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={form.dateApplied}
                    onChange={(e) => update("dateApplied", e.target.value)}
                  />
                </div>
                <div>
                  <label className={label}>Posting URL</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={form.link}
                    onChange={(e) => update("link", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Compensation / Salary</label>
                  <input
                    className={inputClass}
                    value={form.salary || ""}
                    onChange={(e) => update("salary", e.target.value)}
                    placeholder="e.g. $65/hr or $120k/yr"
                  />
                </div>
                <div>
                  <label className={label}>Priority Level</label>
                  <select
                    className={inputClass}
                    value={form.priority || "Medium"}
                    onChange={(e) =>
                      update("priority", e.target.value as ApplicationPriority)
                    }
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p} Priority
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={label}>Deadline Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.deadline || ""}
                  onChange={(e) => update("deadline", e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="space-y-4 animate-fade-in-up">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={label}>Recruiter / Lead Name</label>
                  <input
                    className={inputClass}
                    value={form.contactName || ""}
                    onChange={(e) => update("contactName", e.target.value)}
                    placeholder="e.g. Sarah Lin (Recruiter)"
                  />
                </div>
                <div>
                  <label className={label}>Contact Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={form.contactEmail || ""}
                    onChange={(e) => update("contactEmail", e.target.value)}
                    placeholder="recruiter@company.com"
                  />
                </div>
              </div>

              <div>
                <label className={label}>Notes & Interview Logs</label>
                <textarea
                  className={`${inputClass} min-h-[100px] resize-y font-mono text-xs`}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Referral info, interview stages, key prep notes..."
                />
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300">
              ⚠️ {error}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex gap-2">
              {activeTab !== "specs" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === "contacts" ? "details" : "specs")
                  }
                  className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  ← Back
                </button>
              )}
              {activeTab !== "contacts" && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === "specs" ? "details" : "contacts")
                  }
                  className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-blue-600 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-cyan-400 dark:hover:bg-slate-700"
                >
                  Next →
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-md transition hover:scale-105"
              >
                {initial ? "Save Changes" : "Deploy Application"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
