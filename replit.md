# Bangbet

A sports betting and online casino platform featuring live sports, jackpots, casino games, and promotions — targeting the Ugandan market (UGX currency).

## Run & Operate

- `pnpm --filter @workspace/bangbet run dev` — run the Vue frontend (port 25562, mapped to port 80)
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (needed by API server and db lib)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: Vue 3 + Pinia + Vue Router + Tailwind CSS + Vite
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (API server bundle)

## Where things live

- `artifacts/bangbet/` — Vue 3 frontend (main app)
- `artifacts/api-server/` — Express API server
- `artifacts/mockup-sandbox/` — React component prototyping environment
- `lib/db/` — PostgreSQL schema and Drizzle ORM config
- `lib/api-spec/` — OpenAPI YAML spec (source of truth)
- `lib/api-zod/` — Generated Zod schemas from OpenAPI
- `lib/api-client-react/` — Generated React Query hooks from OpenAPI
- `artifacts/bangbet/public/static/utils/` — Analytics/tracking scripts (PostHog, Firebase, GTag, Facebook Pixel)

## Architecture decisions

- Frontend is decoupled from the API server; the Vue app currently uses mock/local state (Pinia) for auth and data — no live API calls to the backend.
- Auth is a custom mock flow (Pinia store): login sets `isLoggedIn: true` and a mock balance; no backend verification or JWT.
- Analytics tracking keys (Firebase, PostHog, GTag) are hardcoded in public static JS files — these are client-side analytics keys by design.
- `DATABASE_URL` is required by the API server and db lib but NOT by the frontend.

## Product

Sports betting platform with:
- Live and upcoming sports events (Football, Basketball, Tennis, etc.)
- Jackpot pools (Gold, Silver, Bronze, Premium)
- Online Casino section
- Virtual sports and Pick12 games
- User login/registration (mock auth with phone number)
- Promotions and bonus offers

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm install` from the workspace root before starting any workflow.
- The frontend runs on port 25562 (mapped to external port 80) — do not change this without updating `.replit`.
- The API server currently only has a `/api/health` route; the frontend does not call it.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
