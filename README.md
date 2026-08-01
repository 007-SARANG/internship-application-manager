# Internship Application Manager

A clean, fast web app to track your internship applications from wishlist to
offer. Built with Next.js (App Router), TypeScript, and Tailwind CSS. Data is
stored locally in your browser — no backend or sign-up required.

## Features

- **Add, edit, and delete** applications with company, role, location, status,
  date applied, posting link, and notes.
- **Status pipeline**: Wishlist → Applied → Online Assessment → Interview →
  Offer / Rejected, each colour-coded.
- **Live stats** for totals, active applications, and per-status counts.
- **Search** by company, role, or location, **filter** by status, and **sort**
  by recency, company, or date applied.
- **Persistent** across reloads via `localStorage`.
- Fully responsive.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Deployment

Deployed on [Vercel](https://vercel.com/). Any push to `main` triggers a new
production deployment.
