import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import type { CassetteSide, Session, Track, Personnel, PersonnelCredit } from '../types/cassette'
import { cassetteSides as fallbackCassetteSides } from '../data/cassettes';

// Import assets as URLs so Vite copies them to build output
// sql.js needs to locate its wasm file; we provide an explicit URL via locateFile
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite will resolve this to a URL string at build time
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite will resolve this to a URL string at build time
import dbUrl from '../data/cassette_library.db?url';

let sqlPromise: Promise<SqlJsStatic> | null = null;

async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({ locateFile: () => wasmUrl });
  }
  return sqlPromise;
}

async function loadDatabase(): Promise<Database> {
    console.log(dbUrl)
  const response = await fetch(dbUrl);
  if (!response.ok) throw new Error(`Failed to fetch database: ${response.status}`);
  console.log(response)
  const buffer = await response.arrayBuffer();
  const SQL = await getSqlJs();
  return new SQL.Database(new Uint8Array(buffer));
}

function tryMapCassetteSides(db: Database): CassetteSide[] {
  // Deterministic mapping based on the normalized schema created in create_db.php
  // tables: tapes, sides, sessions, tracks, personnel, credits
  try {
    const toObjects = (result: ReturnType<Database['exec']>): Record<string, unknown>[] => {
      if (!result || result.length === 0) return [];
      const { columns, values } = result[0];
      return values.map((row) => Object.fromEntries(columns.map((c, i) => [c, row[i]])));
    };

    // Load all sides joined with their tape number. Try to read optional has_audio column; fall back if absent.
    let sideRows: Record<string, unknown>[] = [];
    try {
      sideRows = toObjects(
        db.exec(
          `SELECT 
             s.id               AS side_id,
             s.side_letter      AS side_letter,
             s.filename         AS filename,
             s.genre            AS genre,
             s.album_title      AS album_title,
             s.main_artist      AS main_artist,
             s.record_date_display AS record_date_display,
             s.audio_type       AS audio_type,
             s.dolby_setting    AS dolby_setting,
             s.tape_selector    AS tape_selector,
             s.library_catalog_no AS library_catalog_no,
             COALESCE(s.has_audio, 1) AS has_audio,
             t.tape_number      AS tape_number
           FROM sides s
           JOIN tapes t ON t.id = s.tape_id
           ORDER BY t.tape_number, s.side_letter`
        )
      );
    } catch {
      // Older DB without has_audio column
      sideRows = toObjects(
        db.exec(
          `SELECT 
             s.id               AS side_id,
             s.side_letter      AS side_letter,
             s.filename         AS filename,
             s.genre            AS genre,
             s.album_title      AS album_title,
             s.main_artist      AS main_artist,
             s.record_date_display AS record_date_display,
             s.audio_type       AS audio_type,
             s.dolby_setting    AS dolby_setting,
             s.tape_selector    AS tape_selector,
             s.library_catalog_no AS library_catalog_no,
             t.tape_number      AS tape_number
           FROM sides s
           JOIN tapes t ON t.id = s.tape_id
           ORDER BY t.tape_number, s.side_letter`
        )
      );
    }

    const sides: CassetteSide[] = [];

    // Prepare statements we'll reuse
    const stmtSessions = db.prepare(
      'SELECT id, session_code, session_date, location FROM sessions WHERE side_id = ? ORDER BY id'
    );
    const stmtSessionPersonnel = db.prepare(
      `SELECT p.name as name, COALESCE(c.role, COALESCE(p.instrument_primary, '')) as role, COALESCE(c.source_key, '') as source_key
       FROM credits c
       JOIN personnel p ON p.id = c.personnel_id
       WHERE c.session_id = ? AND c.track_id IS NULL
       ORDER BY p.name`
    );
    const stmtTracks = db.prepare(
      `SELECT id as track_id, sequence_order, title, counter_start,
              COALESCE(duration_min, 0) as duration_min,
              COALESCE(duration_sec, 0) as duration_sec,
              track_artist_display, vocalist_display, original_text_line
       FROM tracks WHERE session_id = ?
       ORDER BY sequence_order, id`
    );
    const stmtTrackCredits = db.prepare(
      `SELECT p.name as name, COALESCE(c.role, COALESCE(p.instrument_primary, '')) as role
       FROM credits c
       JOIN personnel p ON p.id = c.personnel_id
       WHERE c.track_id = ?
       ORDER BY p.name`
    );

    for (const sr of sideRows) {
      const side_id = Number(sr['side_id']);
      const side_letterRaw = String(sr['side_letter'] ?? 'A');
      const side_letter = side_letterRaw === 'B' ? 'B' as const : 'A';

      const side: CassetteSide = {
        tape_number: String(sr['tape_number'] ?? ''),
        side_letter,
        filename: String(sr['filename'] ?? ''),
        has_audio: sr.hasOwnProperty('has_audio') ? Number(sr['has_audio']) !== 0 : true,
        metadata: {
          album_title: String(sr['album_title'] ?? ''),
          main_artist: String(sr['main_artist'] ?? ''),
          genre: String(sr['genre'] ?? ''),
          record_date_display: String(sr['record_date_display'] ?? ''),
          audio_type: String(sr['audio_type'] ?? ''),
          dolby: String(sr['dolby_setting'] ?? ''),
          tape_selector: String(sr['tape_selector'] ?? ''),
          catalog_number: String(sr['library_catalog_no'] ?? ''),
        },
        sessions: [],
      };

      // Sessions
      const sessions: Session[] = [];
      stmtSessions.bind([side_id]);
      while (stmtSessions.step()) {
        const srow = stmtSessions.getAsObject();
        const session_id = Number(srow['id']);
        const session: Session = {
          session_code: (srow['session_code'] as string) ?? null,
          session_date: (srow['session_date'] as string) || undefined,
          location: (srow['location'] as string) || undefined,
          session_personnel: [],
          tracks: [],
        };

        // Session-level personnel
        stmtSessionPersonnel.bind([session_id]);
        const personnel: Personnel[] = [];
        while (stmtSessionPersonnel.step()) {
          const prow = stmtSessionPersonnel.getAsObject();
          personnel.push({
            name: String(prow['name'] ?? ''),
            role: String(prow['role'] ?? ''),
            source_key: String(prow['source_key'] ?? ''),
          });
        }
        stmtSessionPersonnel.reset();
        session.session_personnel = personnel;

        // Tracks
        stmtTracks.bind([session_id]);
        const tracks: Track[] = [];
        while (stmtTracks.step()) {
          const trow = stmtTracks.getAsObject();
          const track_id = Number(trow['track_id']);
          const track: Track = {
            sequence: Number(trow['sequence_order'] ?? 0),
            counter_start: Number(trow['counter_start'] ?? 0),
            title: String(trow['title'] ?? ''),
            duration_min: Number(trow['duration_min'] ?? 0),
            duration_sec: Number(trow['duration_sec'] ?? 0),
            artist_display: (trow['track_artist_display'] as string) || undefined,
            vocalist_display: (trow['vocalist_display'] as string) || undefined,
            original_text: (trow['original_text_line'] as string) || undefined,
          };

          // Track-level credits
          stmtTrackCredits.bind([track_id]);
          const tcredits: PersonnelCredit[] = [];
          while (stmtTrackCredits.step()) {
            const crow = stmtTrackCredits.getAsObject();
            tcredits.push({
              name: String(crow['name'] ?? ''),
              role: String(crow['role'] ?? ''),
            });
          }
          stmtTrackCredits.reset();
          if (tcredits.length > 0) track.track_specific_credits = tcredits;

          tracks.push(track);
        }
        stmtTracks.reset();
        session.tracks = tracks;

        sessions.push(session);
      }
      stmtSessions.reset();
      side.sessions = sessions;

      sides.push(side);
    }

    // Final sanity: filter out sides that somehow lack a tape_number/filename
    return sides.filter((s) => s.tape_number && s.filename);
  } catch (e) {
    console.warn('Failed to map DB to cassette sides:', e);
    return [];
  }
}

export async function getCassetteSides(): Promise<CassetteSide[]> {
  try {
    const db = await loadDatabase();
    const mapped = tryMapCassetteSides(db);
    console.log('Loaded cassette sides:', mapped.length);
    if (mapped.length > 0) return mapped;
    // If mapping produced no sides, fallback
    return fallbackCassetteSides;
  } catch (err) {
    console.warn('Falling back to hard-coded cassette data due to DB load error:', err);
    return fallbackCassetteSides;
  }
}
