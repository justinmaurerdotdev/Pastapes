import { useState } from 'react';
import { CassetteGrid } from './components/CassetteGrid';
import { CassetteDetail } from './components/CassetteDetail';
import { PersonnelDetail } from './components/PersonnelDetail';
import { cassetteSides } from './data/cassettes';
import type { CassetteSide } from './types/cassette';

type View = 
  | { type: 'grid' }
  | { type: 'side'; side: CassetteSide }
  | { type: 'personnel'; name: string };

export default function App() {
  const [view, setView] = useState<View>({ type: 'grid' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <header className="bg-gradient-to-r from-amber-900 to-red-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView({ type: 'grid' })}
              className="w-12 h-12 bg-amber-700 rounded-lg flex items-center justify-center shadow-inner hover:bg-amber-600 transition-colors"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="8" cy="12" r="2" />
                <circle cx="16" cy="12" r="2" />
                <path d="M6 12h12" strokeWidth="1" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl tracking-tight">Cassette Archive</h1>
              <p className="text-amber-200 text-sm mt-1">
                {cassetteSides.length} digitized tape sides
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view.type === 'grid' && (
          <CassetteGrid 
            cassetteSides={cassetteSides} 
            onSelectSide={(side) => setView({ type: 'side', side })} 
          />
        )}
        {view.type === 'side' && (
          <CassetteDetail 
            side={view.side} 
            onBack={() => setView({ type: 'grid' })}
            onNavigateToPersonnel={(name) => setView({ type: 'personnel', name })}
          />
        )}
        {view.type === 'personnel' && (
          <PersonnelDetail
            personnelName={view.name}
            onBack={() => setView({ type: 'grid' })}
            onNavigateToSide={(side) => setView({ type: 'side', side })}
          />
        )}
      </main>

      <footer className="bg-amber-900/10 mt-16 py-6 border-t border-amber-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-amber-900/60 text-sm">
          Preserving analog memories in digital form
        </div>
      </footer>
    </div>
  );
}