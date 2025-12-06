import { ArrowLeft, Calendar, Disc, Info, Music2, Radio, MapPin, Users } from 'lucide-react';
import type { CassetteSide } from '../types/cassette';
import { AudioPlayer } from './AudioPlayer';
import { SessionDisplay } from './SessionDisplay';

interface CassetteDetailProps {
  side: CassetteSide;
  onBack: () => void;
  onNavigateToPersonnel: (name: string) => void;
}

export function CassetteDetail({ side, onBack, onNavigateToPersonnel }: CassetteDetailProps) {
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
        <div className={`px-8 py-10 ${
          side.side_letter === 'A' 
            ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
            : 'bg-gradient-to-br from-red-500 to-pink-600'
        } text-white`}>
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Music2 className="w-14 h-14" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  Side {side.side_letter}
                </span>
                <span className="text-white/80 text-sm">Tape {side.tape_number}</span>
                <span className="text-white/60 text-sm">• {side.filename}</span>
              </div>
              <h1 className="text-3xl mb-2">{side.metadata.album_title}</h1>
              <p className="text-xl text-white/90">{side.metadata.main_artist}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                <span>{side.metadata.genre}</span>
                <span>•</span>
                <span>{side.metadata.record_date_display}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="px-8 py-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
          <AudioPlayer side={side} />
        </div>

        {/* Technical Metadata */}
        <div className="px-8 py-8 bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-b border-amber-200">
          <h2 className="flex items-center gap-2 text-amber-900 mb-6">
            <Info className="w-5 h-5" />
            Technical Specifications
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Disc className="w-4 h-4 text-amber-600" />
                <div className="text-xs text-amber-900/60">Tape Type</div>
              </div>
              <div className="text-amber-900">{side.metadata.tape_selector}</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-amber-600" />
                <div className="text-xs text-amber-900/60">Noise Reduction</div>
              </div>
              <div className="text-amber-900">{side.metadata.dolby}</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-amber-600" />
                <div className="text-xs text-amber-900/60">Audio Type</div>
              </div>
              <div className="text-amber-900">{side.metadata.audio_type}</div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-600" />
                <div className="text-xs text-amber-900/60">Catalog</div>
              </div>
              <div className="text-amber-900 text-sm">{side.metadata.catalog_number}</div>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="px-8 py-8">
          <h2 className="flex items-center gap-2 text-amber-900 mb-6">
            <Music2 className="w-5 h-5" />
            Recording Sessions & Track Listing
          </h2>
          
          <div className="space-y-8">
            {side.sessions.map((session, index) => (
              <SessionDisplay 
                key={index} 
                session={session} 
                sessionIndex={index}
                totalSessions={side.sessions.length}
                onNavigateToPersonnel={onNavigateToPersonnel}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}