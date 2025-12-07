import { useState } from 'react';
import type { CassetteSide } from '../types/cassette';
import { Music } from 'lucide-react';

interface CassetteGridProps {
  cassetteSides: CassetteSide[];
  onSelectSide: (side: CassetteSide) => void;
}

export function CassetteGrid({ cassetteSides, onSelectSide }: CassetteGridProps) {
  // UI toggle: when enabled, hide sides without audio. Default is OFF per requirement.
  const [onlyWithAudio, setOnlyWithAudio] = useState(false);
  const visibleSides = onlyWithAudio
    ? cassetteSides.filter((side) => side.has_audio ?? true)
    : cassetteSides;
  const getTotalDuration = (side: CassetteSide): string => {
    let totalSeconds = 0;
    side.sessions.forEach(session => {
      session.tracks.forEach(track => {
        totalSeconds += track.duration_min * 60 + track.duration_sec;
      });
    });
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTracks = (side: CassetteSide): number => {
    return side.sessions.reduce((total, session) => total + session.tracks.length, 0);
  };

  const getTapeTypeColor = (selector: string) => {
    switch (selector.toLowerCase()) {
      case 'metal': return 'from-purple-400 to-indigo-500';
      case 'chrome': return 'from-amber-400 to-orange-500';
      default: return 'from-amber-400 to-orange-500';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-2xl text-amber-900">Browse Collection</h2>
            <p className="text-amber-800/70 mt-1">
              Click any cassette side to view details and play audio
            </p>
          </div>
          <label htmlFor="audioFilter" className="inline-flex items-center gap-2 select-none cursor-pointer text-amber-900">
            <input
              id="audioFilter"
              type="checkbox"
              className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
              checked={onlyWithAudio}
              onChange={(e) => setOnlyWithAudio(e.target.checked)}
            />
            <span className="text-sm">Only show sides with audio</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleSides.map((side) => (
          <button
            key={side.filename}
            onClick={() => onSelectSide(side)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 text-left group hover:-translate-y-1 border-2 border-transparent hover:border-amber-400"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                side.side_letter === 'A' 
                  ? getTapeTypeColor(side.metadata.tape_selector)
                  : 'from-red-400 to-pink-500'
              }`}>
                <Music className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs text-white ${
                    side.side_letter === 'A' ? 'bg-amber-600' : 'bg-red-600'
                  }`}>
                    Side {side.side_letter}
                  </span>
                  <span className="text-xs text-amber-900/50">Tape {side.tape_number}</span>
                </div>
                <h3 className="text-amber-900 truncate group-hover:text-amber-700 transition-colors">
                  {side.metadata.album_title}
                </h3>
                <p className="text-amber-800/70 text-sm truncate">{side.metadata.main_artist}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-amber-900/60">Genre:</span>
                <span className="text-amber-900 truncate ml-2">{side.metadata.genre}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-900/60">Recorded:</span>
                <span className="text-amber-900">{side.metadata.record_date_display}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-900/60">Duration:</span>
                <span className="text-amber-900">{getTotalDuration(side)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-900/60">Type:</span>
                <span className="text-amber-900">{side.metadata.tape_selector}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-900/60">Audio:</span>
                <span className="text-amber-900">{side.metadata.audio_type}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-900/10">
              <p className="text-amber-900/60 text-xs">
                {getTotalTracks(side)} track{getTotalTracks(side) !== 1 ? 's' : ''} • {side.sessions.length} session{side.sessions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
