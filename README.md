# Exam Hub

**मध्यप्रदेश की परीक्षाओं की तैयारी — एक ही जगह**

A Hindi-first (with English) preparation platform for Madhya Pradesh competitive exams: MPESB, MPPSC, teacher, police, revenue, health and technical recruitments.

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS v4.

## Status: Phases 1–3 done

| Phase | Scope | Status |
|---|---|---|
| 1 | Architecture, design system, header/footer, homepage, responsive layout | ✅ |
| 2 | Exam system, exam cards, detail pages, calendar (month + list), countdown, filters | ✅ |
| 3 | ₹199 notes marketplace, product pages, coming-soon system | ✅ |
| 4 | Test series, practice-test engine | Landing pages only |
| 5 | Results, admit cards, previous papers, current affairs | Landing pages only (notifications page is live) |
| 6 | Auth, dashboard, payments (Razorpay) | Architecture ready (`src/lib/payments.ts`, `/api/orders`, `prisma/schema.prisma`) |
| 7 | Admin panel | Planned |
| 8–9 | Further SEO, performance and testing work | Base SEO done (metadata, schema, sitemap, robots) |

## Run locally

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL at least
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Where things live

```
src/
  data/          ← CONTENT. Exams, categories, notes, notifications, FAQs (typed seed files)
  lib/repo.ts    ← the only place pages read data from (swap for a DB later)
  lib/dates.ts   ← IST date handling, exam phase logic, sorting
  i18n/          ← UI strings (hi/en) and language cookie
  components/    ← layout, exam, notes, home, ui
  app/           ← routes
prisma/schema.prisma ← planned database schema (not wired up yet)
```

## Updating exam information

Edit `src/data/exams.ts`. Every exam date has a `status`, and these are the rules:

- **CONFIRMED** (shown as "आधिकारिक / Official"): only when an official notification or rulebook gives that exact date.
- **TENTATIVE** ("संभावित"): the official document calls it probable, or it hasn't been re-confirmed after a change.
- **EXPECTED** ("अपेक्षित"): only the month is known, from an official calendar. Use `month: "YYYY-MM"`.
- **TBA** ("घोषित होना शेष"): nothing official yet.
- **COMPLETED**: the exam has verifiably happened (e.g. an answer key is out).

Always update `source` and `updatedAt` when you change a record. The site works out each exam's phase (application open/closed, upcoming, completed) from the current date. A tentative date that has passed shows **"Awaiting official update"** and never "Completed".

Seed data was checked against esb.mp.gov.in, esb.mponline.gov.in and mppsc.mp.gov.in on **30 Sep 2026**.

## Publishing notes

In `src/data/notes.ts`, set `status: "AVAILABLE"` and fill in `pages`, `topics` and `samplePages`. Payment and download stay disabled until Phase 6 (auth + Razorpay). The server refuses orders and downloads until then. It never trusts a price sent from the browser.

## Environment variables

See `.env.example`. Contact details, analytics and payment keys come only from environment variables. Nothing is hard-coded.

## Before launch

- Set `NEXT_PUBLIC_SITE_URL` (canonical URLs and the sitemap depend on it).
- Set `CONTACT_WEBHOOK_URL` so the contact form delivers messages.
- Have the Privacy, Terms, Refund and Disclaimer pages reviewed. They are sensible starting text, not legal advice.
