# Schema, Query, and Type Alignment Notes

Last updated: 2025-12-06 21:21

This document tracks the plan to reconcile the database schema with our TypeScript domain types and the queries used in the app. It also logs progress as we implement and verify the mapping.

## Plan

1. Establish the source of truth for schema: use `create_db.php` (normalized tables: `tapes`, `sides`, `sessions`, `tracks`, `personnel`, `credits`).
2. Keep UI/domain types as-is for now (`src/types/cassette.ts`), since they represent the shape needed to render and mirror the sample data (`01A-12B.json`).
3. Implement deterministic mapping in `src/lib/sqlite.ts` from normalized schema → domain types.
   - Load sides joined with tape number.
   - For each side, load sessions; for each session, load session personnel and tracks.
   - For each track, load track-level credits.
4. Preserve fallback to hard-coded data if the DB fails to load or is empty.
5. Verify UI renders with DB-backed data; compare a few entries with `01A-12B.json`.
6. Decide if additional types are necessary. If needed, add separate `Db*` interfaces to clarify boundaries without changing UI types.

## Current Schema (from `create_db.php`)

- tapes(id, tape_number, recorder_model, created_at, notes)
- sides(id, tape_id, side_letter, filename, genre, album_title, main_artist, record_date_display, audio_type, library_catalog_no, dolby_setting, tape_selector, raw_header_json)
- sessions(id, side_id, session_code, session_date, location, notes)
- tracks(id, session_id, sequence_order, title, counter_start, duration_min, duration_sec, track_artist_display, vocalist_display, is_instrumental, original_text_line)
- personnel(id, name, normalized_name, instrument_primary)
- credits(id, personnel_id, session_id, track_id, role, source_key)

Notes:
- `credits` attaches either to an entire session (session-level personnel, `track_id` NULL) or to a specific track (track-level credits, `track_id` set).

## Domain Types (UI)

`src/types/cassette.ts` expects:
- CassetteSide: { tape_number, side_letter, filename, metadata, sessions[] }
- SideMetadata: album_title, main_artist, genre, record_date_display, audio_type, dolby, tape_selector, catalog_number
- Session: { session_code, session_date?, location?, session_personnel[], tracks[] }
- Personnel: { name, role, source_key }
- Track: { sequence, counter_start, title, duration_min, duration_sec, artist_display?, vocalist_display?, track_specific_credits?, original_text? }

Key field name mapping decisions:
- sides.dolby_setting → metadata.dolby
- sides.library_catalog_no → metadata.catalog_number
- tracks.sequence_order → track.sequence
- tracks.original_text_line → track.original_text
- tracks.track_artist_display → track.artist_display

## Implementation Notes

- `src/lib/sqlite.ts` now performs deterministic queries using prepared statements; no reliance on non-existent views.
- Missing or NULL values are normalized to empty strings or zeros where the UI expects strings/numbers.
- `Session.session_personnel` comes from `credits` rows with `track_id IS NULL`.
- `Track.track_specific_credits` comes from `credits` rows with matching `track_id`.
- Fallback remains: if mapping yields 0 sides or errors occur, we return the hard-coded dataset.

## Open Questions / Future Enhancements

- Should we introduce distinct `Db*` interfaces to represent raw rows? Not required now; could improve clarity in data layer later.
- Consider adding DB indices for frequent joins/filters (already partially covered in `create_db.php`).
- Potential denormalized read views could be added for performance, but not necessary for correctness.

## Progress Log

- 2025-12-06 21:21: Implemented deterministic SQL→types mapper in `src/lib/sqlite.ts`. Updated docs with plan and mapping details. Pending manual UI verification.
