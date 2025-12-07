import { ArrowLeft, Music2, Disc, Calendar, MapPin, Clock } from 'lucide-react';
import type { CassetteSide } from '../types/cassette';

interface PersonnelDetailProps {
  personnelName: string;
  cassetteSides: CassetteSide[];
  onBack: () => void;
  onNavigateToSide: (side: CassetteSide) => void;
}

interface TrackAppearance {
  side: CassetteSide;
  sessionIndex: number;
  trackIndex: number;
  roles: string[];
  sourceKeys: string[];
}

export function PersonnelDetail({ personnelName, cassetteSides, onBack, onNavigateToSide }: PersonnelDetailProps) {
  // Aggregate all appearances of this person across all cassette sides
  const appearances: TrackAppearance[] = [];
  const allRoles = new Set<string>();
  
  cassetteSides.forEach(side => {
    side.sessions.forEach((session, sessionIndex) => {
      // Find this person in session personnel
      const personnelEntries = session.session_personnel.filter(p => p.name === personnelName);
      
      if (personnelEntries.length > 0) {
        const roles = personnelEntries.map(p => p.role);
        const sourceKeys = personnelEntries.map(p => p.source_key);
        roles.forEach(role => allRoles.add(role));
        
        // Add each track from this session
        session.tracks.forEach((track, trackIndex) => {
          appearances.push({
            side,
            sessionIndex,
            trackIndex,
            roles,
            sourceKeys
          });
        });
      }
    });
  });

  const formatDuration = (min: number, sec: number): string => {
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const totalTracks = appearances.length;
  const uniqueSides = new Set(appearances.map(a => a.side.filename)).size;
  const uniqueAlbums = new Set(appearances.map(a => a.side.metadata.album_title)).size;

  // Group appearances by album for better organization
  const appearancesByAlbum = appearances.reduce((acc, appearance) => {
    const albumTitle = appearance.side.metadata.album_title;
    if (!acc[albumTitle]) {
      acc[albumTitle] = [];
    }
    acc[albumTitle].push(appearance);
    return acc;
  }, {} as Record<string, TrackAppearance[]>);

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-amber-900 hover:text-amber-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Collection
      </button>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Music2 className="w-14 h-14" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-white/70 mb-2">Artist / Musician</div>
              <h1 className="text-4xl mb-4">{personnelName}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(allRoles).map(role => (
                  <span 
                    key={role}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl text-indigo-900 mb-1">{totalTracks}</div>
              <div className="text-sm text-indigo-900/60">Track{totalTracks !== 1 ? 's' : ''}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-indigo-900 mb-1">{uniqueSides}</div>
              <div className="text-sm text-indigo-900/60">Cassette Side{uniqueSides !== 1 ? 's' : ''}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl text-indigo-900 mb-1">{uniqueAlbums}</div>
              <div className="text-sm text-indigo-900/60">Album{uniqueAlbums !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>

        {/* Appearances by Album */}
        <div className="px-8 py-8">
          <h2 className="flex items-center gap-2 text-indigo-900 mb-6">
            <Disc className="w-5 h-5" />
            Discography
          </h2>

          <div className="space-y-8">
            {Object.entries(appearancesByAlbum).map(([albumTitle, albumAppearances]) => {
              const firstAppearance = albumAppearances[0];
              const side = firstAppearance.side;
              
              return (
                <div key={albumTitle} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 overflow-hidden">
                  {/* Album Header */}
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-4 border-b border-indigo-200">
                    <h3 className="text-indigo-900 text-lg mb-1">{albumTitle}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-900/70">
                      <span>{side.metadata.main_artist}</span>
                      <span>•</span>
                      <span>{side.metadata.genre}</span>
                      <span>•</span>
                      <span>{side.metadata.record_date_display}</span>
                      <span>•</span>
                      <span className="text-xs font-mono">{side.metadata.catalog_number}</span>
                    </div>

                    {/* Show roles for this album */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-indigo-900/60">Role{firstAppearance.roles.length > 1 ? 's' : ''}:</span>
                      <div className="flex flex-wrap gap-2">
                        {firstAppearance.roles.map((role, idx) => (
                          <span key={idx} className="text-sm text-indigo-900">
                            {role}
                            {firstAppearance.sourceKeys[idx] && (
                              <span className="text-indigo-600 font-mono ml-1 text-xs">
                                [{firstAppearance.sourceKeys[idx]}]
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Track List */}
                  <div className="divide-y divide-indigo-200">
                    {albumAppearances.map((appearance, idx) => {
                      const session = appearance.side.sessions[appearance.sessionIndex];
                      const track = session.tracks[appearance.trackIndex];
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => onNavigateToSide(appearance.side)}
                          className="w-full px-6 py-4 hover:bg-white/50 transition-colors text-left group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-full flex-shrink-0 text-sm">
                              {track.sequence}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="text-indigo-900 group-hover:text-indigo-700 transition-colors mb-1">
                                {track.title}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-indigo-900/60">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{formatDuration(track.duration_min, track.duration_sec)}</span>
                                </div>

                                {session.session_code && (
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{session.session_code}</span>
                                  </div>
                                )}

                                {session.location && (
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{session.location}</span>
                                  </div>
                                )}

                                <div className="flex items-center gap-1.5">
                                  <Disc className="w-3.5 h-3.5" />
                                  <span>Side {appearance.side.side_letter} • Tape {appearance.side.tape_number}</span>
                                </div>
                              </div>

                              {track.vocalist_display && (
                                <div className="text-sm text-indigo-900/70 mt-1">
                                  {track.vocalist_display}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
