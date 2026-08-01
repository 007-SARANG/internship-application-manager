export type ApplicationStatus =
  | "Wishlist"
  | "Applied"
  | "Online Assessment"
  | "Interview"
  | "Offer"
  | "Rejected";

export const STATUSES: ApplicationStatus[] = [
  "Wishlist",
  "Applied",
  "Online Assessment",
  "Interview",
  "Offer",
  "Rejected",
];

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  dateApplied: string; // ISO date (yyyy-mm-dd) or ""
  link: string;
  notes: string;
  createdAt: number;
}

/** Badge pill styles (light + dark). */
export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Wishlist:
    "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
  Applied:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-500/30",
  "Online Assessment":
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30",
  Interview:
    "bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:ring-purple-500/30",
  Offer:
    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30",
  Rejected:
    "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30",
};

/** Solid dot / accent colour per status (tiles, pipeline segments). */
export const STATUS_DOT: Record<ApplicationStatus, string> = {
  Wishlist: "bg-slate-400",
  Applied: "bg-blue-500",
  "Online Assessment": "bg-amber-500",
  Interview: "bg-purple-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-rose-500",
};

/** Left-border accent per status (card edge). */
export const STATUS_BORDER: Record<ApplicationStatus, string> = {
  Wishlist: "border-l-slate-300 dark:border-l-slate-600",
  Applied: "border-l-blue-400",
  "Online Assessment": "border-l-amber-400",
  Interview: "border-l-purple-400",
  Offer: "border-l-emerald-400",
  Rejected: "border-l-rose-400",
};
