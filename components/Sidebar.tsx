import React, { useState } from 'react';
import { CURRICULUM_DATA } from '../constants.tsx';
import { EducationalLevel, CurricularTrack } from '../types.ts';

interface SidebarProps {
  selectedTrackId: string | null;
  onSelectTrack: (track: CurricularTrack) => void;
  onShowDownloads: () => void;
}

const SPECIALIZED_PROGRAM_NAMES: Record<string, string> = {
  spa: 'Arts (SPA)',
  spj: 'Journalism (SPJ)',
  sps: 'Sports (SPS)',
  spfl: 'Foreign Language (SPFL)',
  sptve: 'Tech-Voc (SPTVE)',
  ste: 'Science (STE)',
};

const Sidebar: React.FC<SidebarProps> = ({ selectedTrackId, onSelectTrack, onShowDownloads }) => {
  const levels = [EducationalLevel.JHS, EducationalLevel.SPECIALIZED, EducationalLevel.SHS];
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const groupedSpecializedTracks = CURRICULUM_DATA
    .filter(track => track.level === EducationalLevel.SPECIALIZED)
    .reduce((acc, track) => {
      const groupKey = track.id.split('-')[0];
      if (!acc[groupKey]) {
        acc[groupKey] = {
          name: SPECIALIZED_PROGRAM_NAMES[groupKey] || 'Specialized Program',
          tracks: [],
        };
      }
      acc[groupKey].tracks.push(track);
      return acc;
    }, {} as Record<string, { name: string; tracks: CurricularTrack[] }>);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroup(prev => (prev === groupKey ? null : groupKey));
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-8 shrink-0">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <span className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl">M</span>
          MasterReview
        </h2>
        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-black">DepEd Curriculum Navigator</p>
      </div>

      <nav className="flex-1 px-4 pb-10 overflow-y-auto space-y-8 scrollbar-hide">
        <div>
          <h3 className="px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Library
          </h3>
          <button
            onClick={onShowDownloads}
            className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Saved Offline
          </button>
        </div>

        {levels.map((level) => {
          if (level === EducationalLevel.SPECIALIZED) {
            return (
              <div key={level}>
                <h3 className="px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                  Specialized (G7-10)
                </h3>
                <div className="space-y-1.5">
                  {Object.entries(groupedSpecializedTracks).map(([key, group]) => (
                    <div key={key}>
                      <button
                        onClick={() => toggleGroup(key)}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold flex justify-between items-center transition-all ${expandedGroup === key ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        <span>{group.name}</span>
                        <svg className={`w-4 h-4 transition-transform duration-300 ${expandedGroup === key ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                      </button>
                      {expandedGroup === key && (
                        <div className="pl-4 pt-1 space-y-1 animate-in slide-in-from-left-2 duration-300">
                          {group.tracks.map((track) => (
                            <button
                              key={track.id}
                              onClick={() => onSelectTrack(track)}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                                selectedTrackId === track.id
                                  ? 'text-indigo-600 bg-white shadow-sm border border-indigo-100'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              Grade {track.name.split('Grade ')[1]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          return (
            <div key={level}>
              <h3 className="px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                {level}
              </h3>
              <div className="space-y-1">
                {CURRICULUM_DATA.filter(t => t.level === level).map((track) => (
                  <button
                    key={track.id}
                    onClick={() => onSelectTrack(track)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      selectedTrackId === track.id
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {track.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-black text-center uppercase tracking-[0.2em]">
        DepEd Curriculum Engine v3.0
      </div>
    </div>
  );
};

export default Sidebar;
