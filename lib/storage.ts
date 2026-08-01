import { Application, STATUSES } from "./types";

const VALID = new Set<string>(STATUSES);

/** Best-effort validation of an unknown value into an Application. */
function coerce(raw: unknown): Application | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const status = typeof o.status === "string" && VALID.has(o.status)
    ? (o.status as Application["status"])
    : "Wishlist";
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const company = str(o.company);
  const role = str(o.role);
  if (!company && !role) return null;
  return {
    id: typeof o.id === "string" && o.id ? o.id : crypto.randomUUID(),
    company,
    role,
    location: str(o.location),
    status,
    dateApplied: str(o.dateApplied),
    link: str(o.link),
    notes: str(o.notes),
    createdAt: typeof o.createdAt === "number" ? o.createdAt : Date.now(),
  };
}

/** Trigger a JSON file download of the given applications. */
export function exportApplications(apps: Application[]) {
  const payload = {
    app: "internship-application-manager",
    version: 1,
    exportedAt: new Date().toISOString(),
    applications: apps,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `internship-applications-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Parse an imported JSON file's text into a list of applications. */
export function parseImport(text: string): Application[] {
  const data = JSON.parse(text);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.applications)
      ? data.applications
      : null;
  if (!list) throw new Error("Unrecognised file format");
  const out: Application[] = [];
  for (const item of list) {
    const app = coerce(item);
    if (app) out.push(app);
  }
  if (out.length === 0) throw new Error("No valid applications found");
  return out;
}
