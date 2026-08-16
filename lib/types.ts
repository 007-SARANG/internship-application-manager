export type ApplicationStatus =
  | "Wishlist"
  | "Applied"
  | "Online Assessment"
  | "Interview"
  | "Offer"
  | "Rejected";

export type ApplicationPriority = "Low" | "Medium" | "High" | "Urgent";

export const STATUSES: ApplicationStatus[] = [
  "Wishlist",
  "Applied",
  "Online Assessment",
  "Interview",
  "Offer",
  "Rejected",
];

export const PRIORITIES: ApplicationPriority[] = [
  "Low",
  "Medium",
  "High",
  "Urgent",
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

  // Additional optional metadata
  salary?: string;
  priority?: ApplicationPriority;
  contactName?: string;
  contactEmail?: string;
  deadline?: string;
}

/** Rich color-filled status badge pills for both light & dark mode */
export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Wishlist:
    "bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  Applied:
    "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/70 dark:text-blue-200 dark:border-blue-700/80",
  "Online Assessment":
    "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-900/70 dark:text-amber-200 dark:border-amber-700/80",
  Interview:
    "bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-900/70 dark:text-purple-200 dark:border-purple-700/80",
  Offer:
    "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-900/70 dark:text-emerald-200 dark:border-emerald-700/80 font-bold",
  Rejected:
    "bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-900/70 dark:text-rose-200 dark:border-rose-700/80",
};

/** Solid dot / accent color per status */
export const STATUS_DOT: Record<ApplicationStatus, string> = {
  Wishlist: "bg-slate-400 dark:bg-slate-500",
  Applied: "bg-blue-500",
  "Online Assessment": "bg-amber-500",
  Interview: "bg-purple-500",
  Offer: "bg-emerald-500",
  Rejected: "bg-rose-500",
};

/** Card left border accent per status */
export const STATUS_BORDER: Record<ApplicationStatus, string> = {
  Wishlist: "border-l-slate-300 dark:border-l-slate-700",
  Applied: "border-l-blue-500",
  "Online Assessment": "border-l-amber-500",
  Interview: "border-l-purple-500",
  Offer: "border-l-emerald-500 border-l-[5px]",
  Rejected: "border-l-rose-500",
};

/** Rich color-filled Priority badges */
export const PRIORITY_STYLES: Record<ApplicationPriority, string> = {
  Low: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  Medium: "bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-900/70 dark:text-sky-200 dark:border-sky-700/60",
  High: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/70 dark:text-amber-200 dark:border-amber-700/60",
  Urgent: "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/70 dark:text-rose-200 dark:border-rose-700/60 font-bold",
};
