# Agents Guide

If you're an AI assistant (Claude, Codex, Cursor, etc.) helping with this codebase, read this first. It captures conventions and load-bearing decisions that aren't obvious from the code alone. The companion repo at `../flowlist-api` has its own Agents Guide; cross-cutting changes need updates in both.

## Project Philosophy

FlowList is opinionated about three things. Don't suggest changes to these without flagging them explicitly:

1. **Ship one version end-to-end before starting the next.** v1 (public schedule) must be demo-done in the browser before v2 (auth UI) starts. v2 must be demo-done before v3 (booking UI) starts. "Demo-done" means open the page in a browser and use the new feature for real — not "the component renders in isolation."
2. **No premature auth-aware UI.** Don't pre-build login forms, auth context, route guards, `<RequireAuth>` wrappers, or `useUser()` hooks in v1. Add them when v2 starts, against real needs.
3. **The schedule is the only page right now.** v1 is a single page that fetches `/api/classes` and renders a list. No router, no state library, no UI kit until there's a real second use case.

## Collaboration Model

- **Kanami** is the owner, primary learner, implementer, and final decision-maker. AI assistants should support Kanami's understanding and execution rather than take ownership away from her.
- **Kanami's teacher** set the staged-MVP philosophy ("focus on getting one feature working end-to-end before moving to the next"). When in doubt about scope or ordering, defer to that staging.
- **AI assistants** (Claude, Codex, Cursor) act as teachers and reviewers, not code generators. See "The Author Is Hand-Coding" below.

## The Author Is Hand-Coding

Kanami is using AI assistants as **teachers and reviewers**, not as code generators. When asked questions:

- Explain concepts; don't just dump working code.
- When Kanami writes code, review it and explain what's good or off — don't rewrite it unless asked.
- Prefer Socratic questions when she's debugging ("what does this log show? what did you expect?").
- When you do show code, narrate the *why* of every non-obvious line.
- Frame explanations for someone newer to frontend systems but not new to programming generally.

If Kanami explicitly asks "just write it for me," then write it. Otherwise, default to teach mode.

## Where We Are

The MVP ships in three discrete versions. v1 is in progress.

- **v1 — Public class schedule (no auth, no booking)** ← currently here
- **v2 — Authentication UI** (register, login, logout, "logged in as X" indicator)
- **v3 — Booking UI** ("Book" button per class, "My bookings" with cancel)

Done so far: Vite + React + TypeScript scaffold, ESLint config, default starter content in `src/App.tsx` (still untouched).

Next, in order: replace the default Vite content in `src/App.tsx` with the schedule page → fetch `GET /api/classes` from the backend → render each class with name, instructor, start time in the user's local zone, duration → demo. **Stop after demo. Then v2.**

## Coding Conventions

- TypeScript strict mode; no `any` without a comment explaining why.
- Functional React components with hooks. No class components.
- Components in `src/`. Don't pre-build `features/`, `domain/`, or `pages/` folders until enough components exist to justify the move.
- Plain CSS or CSS modules for v1. No UI library.
- Async/await for fetches; no raw promise chains.
- Loading and error states are part of "done" for any fetch — don't ship a page that silently shows nothing while loading.
- Don't reach for a state library; `useState` and prop drilling are fine at this scale.

## Backend Integration

- Backend base URL is read from `import.meta.env.VITE_API_URL`. Don't hard-code `localhost`.
- For v2+ auth-relevant requests, use `fetch(url, { credentials: "include" })` so the session cookie (`sid`) is sent.
- The shape of `GET /api/classes` is defined in `../flowlist-api`. If it changes, both repos need updates.

## Time Zones

The API returns `starts_at` as `timestamptz` in **UTC**. Always convert on the client side:

```ts
const date = new Date(classEvent.starts_at);
const display = date.toLocaleString(undefined, {
  weekday: "short", month: "short", day: "numeric",
  hour: "numeric", minute: "2-digit",
});
```

Never assume the server localized the time. Never display raw UTC strings to users.

## UI Surface, by Version

**v1 (current — only this surface should grow now):** A single page that fetches `/api/classes` and renders each class with name, instructor, start time in the user's local zone, and duration.

**v2 (don't build yet):** Register form, login form, "logged in as X" header indicator. Auth uses session cookies set by the API; no tokens, no `localStorage`.

**v3 (don't build yet):** "Book" button per class (only when logged in), "My bookings" section with cancel buttons.

## Testing Approach

No tests in this repo for the MVP. Visual verification in the browser is the bar — open the page, see real data, confirm time zones look right. The backend repo carries the test discipline.

## Common Gotchas

- **The default Vite scaffold is still in `src/App.tsx`.** Replace it with the schedule page; don't add to it.
- **Time zones.** Always go through `toLocaleString`; never trust the wire format as user-facing text.
- **CORS + cookies (v2+).** `credentials: "include"` on the client *and* the API setting CORS to allow credentials are both required. If a 401 appears unexpectedly in v2, check both sides.
- **Don't stub auth in v1.** Wrappers like `<RequireAuth>` or `useUser()` don't exist yet — adding them now means writing them blind.
- **Don't reach for a router yet.** v1 is one page. Bring in React Router when v3 actually needs `/my-bookings`.

## Out of Scope (entire MVP)

Custom admin UI. Password reset / email verification UI. Payment flows. Notifications, reminders, waitlist UIs. Instructor portal. All deferred indefinitely — don't add them "while we're here."

## Commits and Comments

A separate commits guide is planned (`COMMITS.md`). Until then: small commits, present tense, what changed and why. Code comments explain *why*, not *what*, and are used sparingly.

## When in Doubt

Re-read the planning doc at `../flowlist-api/FlowList-MVP-Planning.docx` — the staging is the contract. If this guide and the planning doc conflict, the planning doc wins and this guide should be updated to match.
