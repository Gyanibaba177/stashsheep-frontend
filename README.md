# Stashly — P2P storage marketplace

A working full-stack app: Next.js frontend + FastAPI backend + real PostgreSQL
database. Browse listings, view detail pages, submit real booking requests,
and list new space — all of it actually persists to the database now, not
mock data.

## Stack
- Next.js 16 (App Router) + TypeScript — this folder
- FastAPI + PostgreSQL — separate `stashly-backend` folder
- Tailwind CSS v4 (design tokens in `app/globals.css` via `@theme`)
- Self-hosted fonts via `@fontsource` (Space Grotesk, Inter, JetBrains Mono)

## Run it locally — you need BOTH servers running

**1. Start the backend first** (see `stashly-backend/README.md` for full
setup — Postgres, `alembic upgrade head`, seed data):
```bash
cd ../stashly-backend
uvicorn app.main:app --reload
```
This runs on http://localhost:8000

**2. Then start this frontend:**
```bash
npm install
npm run dev
```
This runs on http://localhost:3000 and talks to the backend via the URL in
`.env.local` (`NEXT_PUBLIC_API_URL=http://localhost:8000`).

If the backend isn't running, pages that need data (home, browse, listing
detail) will fail to load — that's expected, since there's no mock data
fallback anymore.

## What's real now
- `lib/api.ts` is the ONE file that talks to the backend. Every page/form
  goes through it — if you ever change the backend's response shape, this
  is the only file you need to update.
- Home, browse, and listing-detail pages fetch live from the database
  (`cache: "no-store"`, so you always see current data, never a stale
  build-time snapshot).
- The booking form actually creates a `Booking` row in Postgres.
- The "list your space" form actually creates a `Host` and a `Listing` row.
  There's no login yet, so it creates a host inline from the name/email you
  type — a real version would check if that email already has an account.

## Still missing (intentionally, for a later step)
- **Auth** — anyone can currently list space or book anything with just a
  name/email, no password, no verification.
- **Photos** — listings don't support image upload yet.
- **Payments** — bookings are requests only, no money moves.
- **Notifications** — hosts aren't emailed/texted when they get a booking
  request yet.

See `stashly-backend/README.md` for the suggested order to add these.

## Project structure
```
app/
  page.tsx                 → landing page (fetches real listings)
  browse/                  → browse + filter listings (fetches real listings)
  listing/[id]/            → listing detail + real booking form
  list-your-space/         → real host + listing creation form
  how-it-works/            → explainer page
components/                → shared UI (Header, Footer, Button, ListingCard, UnitGrid)
lib/
  types.ts                 → shared TypeScript types (frontend shape)
  api.ts                    → talks to the FastAPI backend, maps its response
                               shape into the types above
  mock-data.ts               → no longer used by any page, kept only for
                                 reference/offline demos
```
