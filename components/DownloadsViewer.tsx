import React from 'react';
import { StoredLesson } from '../services/storageService.ts';

interface DownloadsViewerProps {
  lessons: StoredLesson[];
  onLoadLesson: (lesson: StoredLesson) => void;
  onDeleteLesson: (key: string) => void;
  onClose: () => void;
}

const DownloadsViewer: React.FC<DownloadsViewerProps> = ({ lessons, onLoadLesson, onDeleteLesson, onClose }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onClose} className="p-2.5 bg-white border border-slate-200 rounded-xl transition-all shadow-sm group">
          <svg className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">Offline Lessons</h1>
          <p className="text-sm text-slate-500 font-medium">These lessons are stored on your device for quick access.</p>
        </div>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-slate-800">No Lessons Saved Yet</h2>
          <p className="text-slate-500">You can save lessons for offline viewing from the lesson page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
          {lessons.map((storedLesson) => (
            <div
              key={storedLesson.key}
              className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50 transition-colors"
            >
              <div className="text-4xl">{storedLesson.subjectIcon}</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-bold text-slate-400 uppercase">{storedLesson.trackName} &bull; Q{storedLesson.quarter} &bull; {storedLesson.week}</p>
                <h3 className="font-bold text-slate-800 truncate">{storedLesson.lessonContent.title}</h3>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onLoadLesson(storedLesson)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onDeleteLesson(storedLesson.key)}
                  className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-colors"
                  aria-label="Delete lesson"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadsViewer;