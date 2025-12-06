export interface CassetteData {
  sides: CassetteSide[];
}

export interface CassetteSide {
  tape_number: string;
  side_letter: 'A' | 'B';
  filename: string;
  metadata: SideMetadata;
  sessions: Session[];
}

export interface SideMetadata {
  album_title: string;
  main_artist: string;
  genre: string;
  record_date_display: string;
  audio_type: string;
  dolby: string;
  tape_selector: string;
  catalog_number: string;
}

export interface Session {
  session_code: string | null;
  session_date?: string;
  location?: string;
  session_personnel: Personnel[];
  tracks: Track[];
}

export interface Personnel {
  name: string;
  role: string;
  source_key: string;
}

export interface Track {
  sequence: number;
  counter_start: number;
  title: string;
  duration_min: number;
  duration_sec: number;
  artist_display?: string;
  vocalist_display?: string;
  track_specific_credits?: PersonnelCredit[];
  original_text?: string;
}

export interface PersonnelCredit {
  name: string;
  role: string;
}
