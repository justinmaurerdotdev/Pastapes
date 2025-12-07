# SQLite Data Source Migration Plan

This document tracks the plan and execution progress for migrating the app from hard-coded cassette data to the SQLite database (`cassette_library.db`).

## Goals

- Load and query the SQLite database in the browser using `sql.js`.
- Map SQL rows into the existing TypeScript domain types (`CassetteSide`, `Session`, `Track`, etc.).
- Refactor components to consume the new data source with a safe fallback to the current hard-coded data for resilience.
- Align build/deploy to include the database asset.

## Tasks

1. Add client-side SQLite runtime and loader. [x]
   - Add `sql.js` dependency. [x]
   - Implement a loader that fetches the DB and initializes `sql.js` WASM. [x]
2. Ensure Vite bundles required assets. [x]
   - Configure `vite.config.ts` to include `*.db` and `*.wasm` assets. [x]
   - Import the database via `?url` so it is copied to `build/assets`. [x]
3. Implement SQL → domain mapping. [x]
   - Build `getCassetteSides()` that returns `CassetteSide[]` with sessions, tracks, personnel, and per-track credits. [x]
   - Document schema assumptions (session-level credits have `track_id` null/0). [x]
4. Refactor the app to use the new data source. [x]
   - Update `App.tsx` to load sides asynchronously and show a loading state. [x]
   - Pass loaded sides to `CassetteGrid` and `PersonnelDetail`. [x]
   - Remove direct imports of hard-coded data from components; keep as fallback only. [x]
5. Deployment/build alignment. [x]
   - Update `vercel.json` output directory to `build/` to match Vite. [x]
6. Manual verification. [ ]
   - Run dev server, verify grid, detail, and personnel views render correctly with DB data. [ ]
   - Spot-check a few records against the DB.

## Notes

- Fallback strategy: if DB fetch or initialization fails, the app will render using the existing hard-coded dataset.
- Future improvement: consider moving data access into a small worker for off-main-thread parsing.
