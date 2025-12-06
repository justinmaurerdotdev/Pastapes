import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import type { Session } from '../types/cassette';

interface SessionDisplayProps {
  session: Session;
  sessionIndex: number;
  totalSessions: number;
  onNavigateToPersonnel: (name: string) => void;
}

export function SessionDisplay({ session, sessionIndex, totalSessions, onNavigateToPersonnel }: SessionDisplayProps) {
  const formatDuration = (min: number, sec: number): string => {
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const formatCounter = (counter: number): string => {
    return counter.toString().padStart(3, '0');
  };

  const hasSessionInfo = session.session_code || session.session_date || session.location;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 overflow-hidden">
      {/* Session Header */}
      {hasSessionInfo && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 border-b border-amber-200">
          <div className="flex flex-wrap items-center gap-4">
            {session.session_code && (
              <h3 className="text-amber-900">
                {session.session_code}
              </h3>
            )}
            {!session.session_code && totalSessions === 1 && (
              <h3 className="text-amber-900">Recording Session</h3>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-amber-900/70">
              {session.session_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{session.session_date}</span>
                </div>
              )}
              {session.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{session.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Personnel */}
          {session.session_personnel.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3 text-sm text-amber-900/80">
                <Users className="w-4 h-4" />
                <span>Personnel</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                {session.session_personnel.map((person, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigateToPersonnel(person.name)}
                    className="flex items-start gap-2 text-sm text-left hover:bg-white/50 rounded px-2 py-1 -mx-2 transition-colors group"
                  >
                    <span className="text-amber-600 font-mono text-xs mt-0.5 flex-shrink-0 w-6">
                      [{person.source_key}]
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-amber-900 group-hover:text-amber-700 transition-colors underline decoration-amber-400/0 group-hover:decoration-amber-400 decoration-2 underline-offset-2">
                        {person.name}
                      </span>
                      <span className="text-amber-900/60"> • {person.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tracks */}
      <div className="divide-y divide-amber-200">
        {session.tracks.map((track) => (
          <div 
            key={track.sequence}
            className="px-6 py-4 hover:bg-white/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 flex items-center justify-center bg-amber-600 text-white rounded-full flex-shrink-0 text-sm">
                {track.sequence}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-amber-900 mb-1">
                  {track.title}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-amber-900/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(track.duration_min, track.duration_sec)}</span>
                  </div>
                  
                  <div className="font-mono text-xs">
                    Counter: {formatCounter(track.counter_start)}
                  </div>

                  {track.artist_display && (
                    <div className="text-amber-900">
                      Artist: {track.artist_display}
                    </div>
                  )}

                  {track.vocalist_display && (
                    <div className="text-amber-900">
                      {track.vocalist_display}
                    </div>
                  )}
                </div>

                {track.track_specific_credits && track.track_specific_credits.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {track.track_specific_credits.map((credit, idx) => (
                      <div key={idx} className="text-xs text-amber-900/70">
                        {credit.name} • {credit.role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}