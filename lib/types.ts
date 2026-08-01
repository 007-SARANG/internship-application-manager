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

export const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Wishlist: "bg-slate-100 text-slate-700 ring-slate-200",
  Applied: "bg-blue-100 text-blue-700 ring-blue-200",
  "Online Assessment": "bg-amber-100 text-amber-800 ring-amber-200",
  Interview: "bg-purple-100 text-purple-700 ring-purple-200",
  Offer: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  Rejected: "bg-rose-100 text-rose-700 ring-rose-200",
};
