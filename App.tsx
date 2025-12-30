import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import LessonViewer from './components/LessonViewer.tsx';
import DownloadsViewer from './components/DownloadsViewer.tsx';
import { CurricularTrack, Subject, LessonContent, WeekData } from './types.ts';
import { geminiService } from './services/geminiService.ts';
import { storageService, StoredLesson } from './services/storageService.ts';
import { CURRICULUM_DATA } from './constants.tsx';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'curriculum' | 'downloads'>('curriculum');
  const [storedLessons, setStoredLessons] = useState<StoredLesson[]>([]);

  const [selectedTrack, setSelectedTrack] = useState<CurricularTrack | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setStoredLessons(storageService.getAllLessons());
  }, []);

  const handleSelectTrack = useCallback((track: CurricularTrack) => {
    setViewMode('curriculum');
    setSelectedTrack(track);
    setSelectedSubject(null);
    setSelectedQuarter(null);
    setSelectedWeek(null);
    setLesson(null);
    setError(null);
    setIsSidebarOpen(false);
  }, []);

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedQuarter(null);
    setSelectedWeek(null);
    setLesson(null);
  };

  const handleSelectUnit = async (quarter: number, weekData: WeekData, focus?: string) => {
    if (!selectedTrack || !selectedSubject) return;

    setSelectedQuarter(quarter);
    setSelectedWeek(weekData.name);
    if (!focus) setLesson(null);
    setIsLoading(true);
    setError(null);

    const lessonKey = storageService.generateKey(selectedTrack.id, selectedSubject.id, quarter, weekData.name);
    const storedLesson = storageService.getLesson(lessonKey);

    if (storedLesson && !focus) {
      setLesson(storedLesson.lessonContent);
      setIsLoading(false);
      return;
    }

    try {
      const content = await geminiService.fetchLesson(selectedTrack.level, selectedTrack.name, selectedSubject.name, quarter, weekData.name, weekData.melc, weekData.code, focus);
      setLesson(content);
    } catch (err) {
      console.error(err);
      setError("Content generation failed. Check your connection or API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCurrentLesson = () => {
    if (!lesson || !selectedTrack || !selectedSubject || !selectedQuarter || !selectedWeek) return;
    const newStoredLesson = storageService.saveLesson({
      trackId: selectedTrack.id,
      subjectId: selectedSubject.id,
      quarter: selectedQuarter,
      week: selectedWeek,
      lessonContent: lesson,
      trackName: selectedTrack.name,
      subjectName: selectedSubject.name,
      subjectIcon: selectedSubject.icon
    });
    setStoredLessons(prev => [newStoredLesson, ...prev.filter(l => l.key !== newStoredLesson.key)]);
  };

  const handleDeleteStoredLesson = (key: string) => {
    storageService.deleteLesson(key);
    setStoredLessons(prev => prev.filter(l => l.key !== key));
  };
  
  const handleLoadStoredLesson = (storedLesson: StoredLesson) => {
      const track = CURRICULUM_DATA.find(t => t.id === storedLesson.trackId);
      const subject = track?.subjects.find(s => s.id === storedLesson.subjectId);
      if (track && subject) {
          setViewMode('curriculum');
          setSelectedTrack(track);
          setSelectedSubject(subject);
          setSelectedQuarter(storedLesson.quarter);
          setSelectedWeek(storedLesson.week);
          setLesson(storedLesson.lessonContent);
      }
  };

  const handleShowDownloads = () => {
    setViewMode('downloads');
    setSelectedTrack(null);
    setLesson(null);
    setIsSidebarOpen(false);
  };

  const handleRegenerate = (focus: string) => {
    const quarter = selectedSubject?.quarters.find(q => q.number === selectedQuarter);
    const weekData = quarter?.weeks.find(w => w.name === selectedWeek);
    if (selectedQuarter && weekData) {
      handleSelectUnit(selectedQuarter, weekData, focus);
    }
  };

  const resetToTrack = () => {
    setLesson(null);
    setSelectedSubject(null);
    setSelectedQuarter(null);
    setSelectedWeek(null);
  };

  const resetToSubject = () => {
    setLesson(null);
    setSelectedQuarter(null);
    setSelectedWeek(null);
  };
  
  const isCurrentLessonDownloaded = () => {
      if (!selectedTrack || !selectedSubject || !selectedQuarter || !selectedWeek) return false;
      const key = storageService.generateKey(selectedTrack.id, selectedSubject.id, selectedQuarter, selectedWeek);
      return storedLessons.some(l => l.key === key);
  }

  const renderContent = () => {
    if (viewMode === 'downloads') {
      return <DownloadsViewer lessons={storedLessons} onLoadLesson={handleLoadStoredLesson} onDeleteLesson={handleDeleteStoredLesson} onClose={() => setViewMode('curriculum')} />;
    }

    if (!selectedTrack) {
      return (
        <div className="min-h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6 px-4">
          <div className="w-24 h-24 bg-indigo-600 rounded-[1.8rem] shadow-2xl flex items-center justify-center text-4xl text-white transform -rotate-6">🎓</div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Unlock Excellence in <br/><span className="text-indigo-600">The K-12 Curriculum</span></h1>
          <p className="text-slate-500 text-lg font-medium">Detailed, MELC-aligned lessons for every subject. Select a track from the sidebar to begin.</p>
        </div>
      );
    }

    if (!selectedSubject) {
      return (
        <div className="space-y-8 max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedTrack(null)} className="p-2.5 bg-white border border-slate-200 rounded-xl transition-all shadow-sm group">
              <svg className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md uppercase">{selectedTrack.level}</span>
              <h1 className="text-3xl font-black text-slate-900">{selectedTrack.name} Subjects</h1>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {selectedTrack.subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => handleSelectSubject(subject)}
                className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100/50 text-center transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">{subject.icon}</div>
                <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{subject.name}</h3>
                {subject.category && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full uppercase mb-3">{subject.category}</span>}
                <p className="text-xs text-slate-500 font-medium leading-relaxed flex-grow">{subject.description}</p>
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    if (lesson || isLoading) {
      return (
        <div className="max-w-4xl mx-auto pb-24 px-4">
            {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm font-bold flex items-center gap-3"><span>{error}</span></div>}
            <LessonViewer 
              lesson={lesson} 
              isLoading={isLoading} 
              onClose={resetToSubject} 
              onRegenerate={handleRegenerate}
              currentSubject={selectedSubject}
              trackSubjects={selectedTrack?.subjects || []}
              onNavigateSubject={handleSelectSubject}
              isDownloaded={isCurrentLessonDownloaded()}
              onDownload={handleDownloadCurrentLesson}
              level={selectedTrack?.level}
            />
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 px-4">
         <div className="flex items-center gap-4">
           <button onClick={resetToTrack} className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm group">
             <svg className="w-5 h-5 text-slate-600 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <div>
             <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md uppercase">{selectedSubject.category || 'Standard'}</span>
             <h1 className="text-3xl font-black text-slate-900">{selectedSubject.name} - Select Unit</h1>
           </div>
         </div>
         <div className="space-y-8">
           {selectedSubject.quarters.map((q) => (
             <div key={q.number} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
               <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm">Q{q.number}</span>
                 Quarter {q.number}
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {q.weeks.map((week) => (
                   <button 
                    key={week.code || week.name} 
                    onClick={() => handleSelectUnit(q.number, week)} 
                    className="group text-left p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-[0.98] w-full"
                   >
                     <p className="font-bold text-sm text-indigo-600 mb-1">{week.name}</p>
                     <p className="text-xs text-slate-600 font-medium mb-2 leading-snug">{week.melc}</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-500">{week.code}</p>
                   </button>
                 ))}
               </div>
             </div>
           ))}
         </div>
       </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden relative">
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-40">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 rounded-lg">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h1 className="text-lg font-bold text-indigo-700">🎓 MasterReview</h1>
        <div className="w-10"></div>
      </header>

      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <div className={`fixed inset-y-0 left-0 w-72 bg-white z-[60] transform transition-transform md:relative md:translate-x-0 md:w-80 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar selectedTrackId={selectedTrack?.id || null} onSelectTrack={handleSelectTrack} onShowDownloads={handleShowDownloads} />
      </div>

      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {renderContent()}
      </main>

      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <div className="bg-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800">
          <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          <div className="flex flex-col text-white">
            <span className="text-[9px] font-black text-slate-400 uppercase">AI Learning Engine</span>
            <span className="text-xs font-bold">{isLoading ? 'Generating Unit Content...' : 'Curriculum Ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
