import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Internship Application Manager",
  description: "Track and manage your internship applications in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
