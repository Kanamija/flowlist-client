# FlowList Client

Frontend for **FlowList** — a scheduling app for a yoga studio. Students can browse the class schedule, log in, sign up for classes, and cancel their own bookings. Studio admins manage the schedule directly through the Supabase dashboard.

> The backend lives in [`flowlist-api`](../flowlist-api) — Express + TypeScript + Supabase.

## What it is

Yoga studios often manage class sign-ups informally — paper sheets, group chats, "first come first served" with no real source of truth. The result: double bookings, missed cancellations, and admin headaches.

FlowList is the single source of truth for the class schedule and bookings. This repo is the React app students actually see:

- A **public schedule page** anyone can browse without logging in
- **Login / register UI** for students who want to book
- **Booking and cancellation UI** with their own "My bookings" view

## How it works

```
Schedule page (public, single page)
        ↓
GET /api/classes  →  list of upcoming classes
        ↓
Student logs in / registers  →  session cookie set by the API
        ↓
"Book" button on each class  →  POST /api/bookings
        ↓
"My bookings" view  →  cancel a booking when needed
```

## Architecture highlights

- **UTC over the wire, localized in the browser.** The API returns `starts_at` as a UTC `timestamptz`; the client converts with `toLocaleString` so every student sees their own zone. No date library needed for the MVP.
- **Session cookies, not tokens.** Auth uses session cookies set by the API — no `localStorage`, no token plumbing on the client. In dev, `/api/*` goes through the Vite proxy, and auth-relevant fetches use `credentials: "include"`.
- **No state library, no router, no UI kit (yet).** v1 is one page; libraries get added when there's a concrete second use case for them.
- **Loading and error states are part of "done."** No silent blank screens while a fetch is in flight.

## Tech stack

**Frontend (this repo)**
- React + Vite + TypeScript
- ESLint
- Plain CSS / CSS modules (no UI library)

**Backend (separate repo)**
- Node.js + Express + TypeScript + Supabase

## Status

In active development. Shipping in three discrete versions, each end-to-end before the next:

- **v1 — Public class schedule (no auth, no booking).** ← in progress
- **v2 — Authentication UI** (register, login, logout, "logged in as X" indicator)
- **v3 — Booking UI** ("Book" button per class, "My bookings" with cancel)

"Done" for each version means opening the page in a browser and using the new feature for real.

## Project structure

```
src/
  App.tsx          # currently the default Vite scaffold; v1 schedule page lives here next
  main.tsx         # React entry point
  assets/          # static assets
public/            # files served verbatim by Vite
AGENTS.md          # guidance for AI assistants working in this repo
CONTRIBUTING.md    # commit format, PR template, code-comment conventions
PROJECT_BRIEF.md   # product brief, MVP success criteria, stretch features
index.html         # Vite HTML entry
vite.config.ts     # Vite config
```

## Configuration

The backend base URL is read from `import.meta.env.VITE_API_URL`. Set it in `.env.local` for development, e.g.:

```
VITE_API_URL=http://localhost:3000
```

## Author

Built by Kanami Anderson.
