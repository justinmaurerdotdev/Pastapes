<?php

// Configuration
$dbFile = __DIR__ . '/cassette_library.db';

try {
	// 1. Connect to SQLite file (creates it if it doesn't exist)
	$pdo = new PDO("sqlite:" . $dbFile);

	// 2. Set error mode to exception for debugging
	$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// 3. Enable Foreign Keys (Crucial for SQLite, as they are off by default)
	$pdo->exec("PRAGMA foreign_keys = ON;");

	echo "Connected to database: $dbFile\n";
	echo "Creating schema...\n";

	// -------------------------------------------------------------------------
	// TABLE: TAPES
	// Represents the physical object (the cassette itself).
	// -------------------------------------------------------------------------
	$pdo->exec("CREATE TABLE IF NOT EXISTS tapes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tape_number TEXT NOT NULL UNIQUE,  -- e.g., '013', '001'
        recorder_model TEXT,               -- e.g., 'Pioneer CT-W310'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
    )");
	echo " - Table 'tapes' created.\n";

	// -------------------------------------------------------------------------
	// TABLE: SIDES
	// The main container for the PDF data. A tape usually has A and B sides.
	// -------------------------------------------------------------------------
	$pdo->exec("CREATE TABLE IF NOT EXISTS sides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tape_id INTEGER NOT NULL,
        side_letter TEXT NOT NULL,         -- 'A' or 'B'
        filename TEXT UNIQUE,              -- 'Tape013A' (Matches your PDF source ID)

        -- Metadata extracted from header
        genre TEXT,                        -- 'Dixieland Jazz', 'Bluegrass'
        album_title TEXT,
        main_artist TEXT,                  -- The 'Band' field from the header
        record_date_display TEXT,          -- '1940-1941' (kept as text due to variances)
        audio_type TEXT,                   -- 'Mono', 'Stereo'
        library_catalog_no TEXT,           -- 'MJ R559 V4'

        -- Technical details
        dolby_setting TEXT,                -- 'off', 'B', 'C'
        tape_selector TEXT,                -- 'normal'

        -- Safety Valve: Stores the raw OCR JSON header if parsing fails
        raw_header_json TEXT,

        FOREIGN KEY (tape_id) REFERENCES tapes(id) ON DELETE CASCADE
    )");
	echo " - Table 'sides' created.\n";

	// -------------------------------------------------------------------------
	// TABLE: SESSIONS
	// Handles the sub-groups within a side (e.g., 'Group A', 'Group B').
	// If a side has no groups, we create one 'Default' session for it.
	// -------------------------------------------------------------------------
	$pdo->exec("CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        side_id INTEGER NOT NULL,

        session_code TEXT,                 -- 'A', 'B', 'Group 1' (or NULL for default)
        session_date TEXT,                 -- Specific date if different from album
        location TEXT,                     -- 'Carnegie Hall'
        notes TEXT,

        FOREIGN KEY (side_id) REFERENCES sides(id) ON DELETE CASCADE
    )");
	echo " - Table 'sessions' created.\n";

	// -------------------------------------------------------------------------
	// TABLE: TRACKS
	// The actual songs or audio segments.
	// -------------------------------------------------------------------------
	$pdo->exec("CREATE TABLE IF NOT EXISTS tracks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,

        sequence_order INTEGER,            -- To maintain sort order (1, 2, 3...)
        title TEXT,

        -- Timing
        counter_start INTEGER,             -- The 'Begin' column
        duration_min INTEGER,
        duration_sec INTEGER,

        -- Specifics
        track_artist_display TEXT,         -- If a specific track lists a different artist
        vocalist_display TEXT,             -- Extracted from notes like 'Voc: Teagarden'
        is_instrumental INTEGER DEFAULT 0, -- Boolean (0 or 1)

        -- Raw capture for validation
        original_text_line TEXT,

        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
    )");
	echo " - Table 'tracks' created.\n";

	// -------------------------------------------------------------------------
	// TABLE: PERSONNEL
	// A distinct list of all musicians/people found in the library.
	// -------------------------------------------------------------------------
	$pdo->exec("CREATE TABLE IF NOT EXISTS personnel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,         -- 'Earl Scruggs'
        normalized_name TEXT,              -- 'Scruggs, Earl' (for sorting)
        instrument_primary TEXT            -- 'Banjo' (optional default instrument)
    )");
	echo " - Table 'personnel' created.\n";

	// -------------------------------------------------------------------------
	// TABLE: CREDITS
	// The 'Messy' part handler. Links people to sessions OR tracks.
	// -------------------------------------------------------------------------
	$pdo->exec("CREATE TABLE IF NOT EXISTS credits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personnel_id INTEGER NOT NULL,

        -- Polymorphic-ish relationships:
        -- A credit can belong to a whole session (Group A) OR a specific track.
        session_id INTEGER,
        track_id INTEGER,

        role TEXT,                         -- 'Banjo', 'Piano', 'Vocalist'

        -- The 'Key' found in the PDF legend/matrix (e.g., 'a', 'x', '1')
        -- Used to verify data extraction later.
        source_key TEXT,

        FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
        FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE,

        -- Constraint: Ensure a credit links to SOMETHING
        CHECK (session_id IS NOT NULL OR track_id IS NOT NULL)
    )");
	echo " - Table 'credits' created.\n";

	// -------------------------------------------------------------------------
	// INDEXES
	// For performance when querying the library later.
	// -------------------------------------------------------------------------
	$pdo->exec("CREATE INDEX IF NOT EXISTS idx_sides_tape ON sides(tape_id)");
	$pdo->exec("CREATE INDEX IF NOT EXISTS idx_tracks_session ON tracks(session_id)");
	$pdo->exec("CREATE INDEX IF NOT EXISTS idx_credits_personnel ON credits(personnel_id)");
	$pdo->exec("CREATE INDEX IF NOT EXISTS idx_credits_track ON credits(track_id)");
	echo " - Indexes created.\n";

	echo "--------------------------------------\n";
	echo "Database created successfully!\n";
	echo "File location: " . realpath($dbFile) . "\n";

} catch (PDOException $e) {
	die("DB ERROR: " . $e->getMessage());
}
?>