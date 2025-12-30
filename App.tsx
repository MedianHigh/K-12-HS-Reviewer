import React, { useState, useCallback, useEffect } from 'react';
import { html } from 'htm/react';
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

  const handleRegenerate = (focus: string) => {
    const quarter = selectedSubject?.quarters.find(q => q.number === selectedQuarter);
    const weekData = quarter?.weeks.find(w => w.name === selectedWeek);
    if (selectedQuarter && weekData) handleSelectUnit(selectedQuarter, weekData, focus);
  };

  const renderContent = () => {
    if (viewMode === 'downloads') {
      return html`<${DownloadsViewer} 
        lessons=${storedLessons} 
        onLoadLesson=${handleLoadStoredLesson} 
        onDeleteLesson=${(key: string) => {
          storageService.deleteLesson(key);
          setStoredLessons(prev => prev.filter(l => l.key !== key));
        }} 
        onClose=${() => setViewMode('curriculum')} 
      />`;
    }

    if (!selectedTrack) {
      return html`
        <div class="min-h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6 px-4">
          <div class="w-24 h-24 bg-indigo-600 rounded-[1.8rem] shadow-2xl flex items-center justify-center text-4xl text-white transform -rotate-6">🎓</div>
          <h1 class="text-3xl md:text-5xl font-black text-slate-900 leading-tight">Unlock Excellence in <br/><span class="text-indigo-600">The K-12 Curriculum</span></h1>
          <p class="text-slate-500 text-lg font-medium">Detailed, MELC-aligned lessons for every subject. Select a track from the sidebar to begin.</p>
        </div>`;
    }

    if (!selectedSubject) {
      return html`
        <div class="space-y-8 max-w-6xl mx-auto px-4">
          <div class="flex items-center gap-4">
            <button onClick=${() => setSelectedTrack(null)} class="p-2.5 bg-white border border-slate-200 rounded-xl transition-all shadow-sm group">
              <svg class="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md uppercase">${selectedTrack.level}</span>
              <h1 class="text-3xl font-black text-slate-900">${selectedTrack.name} Subjects</h1>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            ${selectedTrack.subjects.map((subject) => html`
              <button
                key=${subject.id}
                onClick=${() => handleSelectSubject(subject)}
                class="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100/50 text-center transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              >
                <div class="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">${subject.icon}</div>
                <h3 class="text-lg font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">${subject.name}</h3>
                ${subject.category && html`<span class="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full uppercase mb-3">${subject.category}</span>`}
                <p class="text-xs text-slate-500 font-medium leading-relaxed flex-grow">${subject.description}</p>
              </button>
            `)}
          </div>
        </div>`;
    }
    
    if (lesson || isLoading) {
      const isCurrentDownloaded = selectedTrack && selectedSubject && selectedQuarter && selectedWeek && 
        storedLessons.some(l => l.key === storageService.generateKey(selectedTrack.id, selectedSubject.id, selectedQuarter, selectedWeek));
        
      return html`
        <div class="max-w-4xl mx-auto pb-24 px-4">
            ${error && html`<div class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm font-bold flex items-center gap-3"><span>${error}</span></div>`}
            <${LessonViewer} 
              lesson=${lesson} 
              isLoading=${isLoading} 
              onClose=${() => { setLesson(null); setSelectedQuarter(null); setSelectedWeek(null); }} 
              onRegenerate=${handleRegenerate}
              currentSubject=${selectedSubject}
              trackSubjects=${selectedTrack?.subjects || []}
              onNavigateSubject=${handleSelectSubject}
              isDownloaded=${isCurrentDownloaded}
              onDownload=${handleDownloadCurrentLesson}
              level=${selectedTrack?.level}
            />
        </div>`;
    }

    return html`
      <div class="max-w-4xl mx-auto space-y-8 pb-20 px-4">
         <div class="flex items-center gap-4">
           <button onClick=${() => { setLesson(null); setSelectedSubject(null); }} class="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm group">
             <svg class="w-5 h-5 text-slate-600 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
           </button>
           <div>
             <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-md uppercase">${selectedSubject.category || 'Standard'}</span>
             <h1 class="text-3xl font-black text-slate-900">${selectedSubject.name} - Select Unit</h1>
           </div>
         </div>
         <div class="space-y-8">
           ${selectedSubject.quarters.map((q) => html`
             <div key=${q.number} class="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
               <h2 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                 <span class="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm">Q${q.number}</span>
                 Quarter ${q.number}
               </h2>
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                 ${q.weeks.map((week) => html`
                   <button 
                    key=${week.code || week.name} 
                    onClick=${() => handleSelectUnit(q.number, week)} 
                    class="group text-left p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-[0.98] w-full"
                   >
                     <p class="font-bold text-sm text-indigo-600 mb-1">${week.name}</p>
                     <p class="text-xs text-slate-600 font-medium mb-2 leading-snug">${week.melc}</p>
                     <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-500">${week.code}</p>
                   </button>
                 `)}
               </div>
             </div>
           `)}
         </div>
       </div>`;
  }

  return html`
    <div class="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden relative">
      <header class="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-40">
        <button onClick=${() => setIsSidebarOpen(true)} class="p-2 text-slate-600 rounded-lg">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h1 class="text-lg font-bold text-indigo-700">🎓 MasterReview</h1>
        <div class="w-10"></div>
      </header>

      ${isSidebarOpen && html`<div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden" onClick=${() => setIsSidebarOpen(false)} />`}

      <div class="fixed inset-y-0 left-0 w-72 bg-white z-[60] transform transition-transform md:relative md:translate-x-0 md:w-80 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
        <${Sidebar} 
          selectedTrackId=${selectedTrack?.id || null} 
          onSelectTrack=${handleSelectTrack} 
          onShowDownloads=${() => { setViewMode('downloads'); setIsSidebarOpen(false); }} 
        />
      </div>

      <main class="flex-1 overflow-y-auto bg-[#F8FAFC]">
          ${renderContent()}
      </main>

      <div class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <div class="bg-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-800">
          <div class="w-3 h-3 rounded-full ${isLoading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}" />
          <div class="flex flex-col text-white">
            <span class="text-[9px] font-black text-slate-400 uppercase">AI Learning Engine</span>
            <span class="text-xs font-bold">${isLoading ? 'Generating Unit Content...' : 'Curriculum Ready'}</span>
          </div>
        </div>
      </div>
    </div>`;
};

export default App;