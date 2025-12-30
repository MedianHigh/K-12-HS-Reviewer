import React, { useState, useEffect, useMemo } from 'react';
import { LessonContent, Subject, LessonSection, ContentBlock, Example, Difficulty, ReviewQuestion, EducationalLevel, VocabularyItem } from '../types.ts';
import { geminiService } from '../services/geminiService.ts';

interface LessonViewerProps {
  lesson: LessonContent | null;
  isLoading: boolean;
  onClose: () => void;
  onRegenerate: (focus: string) => void;
  currentSubject: Subject;
  trackSubjects: Subject[];
  onNavigateSubject: (subject: Subject) => void;
  isDownloaded: boolean;
  onDownload: () => void;
  level?: EducationalLevel;
}

const difficultyStyles: Record<Difficulty, { badge: string; border: string; accent: string }> = {
  Easy: { badge: 'bg-emerald-100 text-emerald-800', border: 'border-emerald-200', accent: 'bg-emerald-600' },
  Moderate: { badge: 'bg-sky-100 text-sky-800', border: 'border-sky-200', accent: 'bg-sky-600' },
  Hard: { badge: 'bg-amber-100 text-amber-800', border: 'border-amber-200', accent: 'bg-amber-600' },
  Tricky: { badge: 'bg-rose-100 text-rose-800', border: 'border-rose-200', accent: 'bg-rose-600' },
};

const ContentRenderer = ({ text, keyTerms, onTermClick, highlightedSet }: { text: string, keyTerms: string[], onTermClick: (e: React.MouseEvent<HTMLButtonElement>, term: string) => void, highlightedSet: Set<string> }) => {
  if (!text) return null;
  
  const cleanText = text
    .replace(/\*\*/g, '')
    .replace(/Rationale:/gi, '')
    .replace(/Answer:/gi, '')
    .replace(/Question:/gi, '')
    .replace(/Hint:/gi, '')
    .trim();

  const parts = useMemo(() => {
    if (!keyTerms || keyTerms.length === 0) return [{ text: cleanText, isTerm: false }];
    
    const sortedTerms = [...keyTerms].sort((a, b) => b.length - a.length);
    const escapedTerms = sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`\\b(${escapedTerms})\\b`, 'gi');
    
    const result: { text: string; isTerm: boolean }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanText)) !== null) {
      if (match.index > lastIndex) {
        result.push({ text: cleanText.substring(lastIndex, match.index), isTerm: false });
      }
      
      const termMatch = match[0];
      const termLower = termMatch.toLowerCase();
      
      if (!highlightedSet.has(termLower)) {
        result.push({ text: termMatch, isTerm: true });
        highlightedSet.add(termLower);
      } else {
        result.push({ text: termMatch, isTerm: false });
      }
      
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < cleanText.length) {
      result.push({ text: cleanText.substring(lastIndex), isTerm: false });
    }

    return result;
  }, [cleanText, keyTerms, highlightedSet]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed inline">
      {parts.map((part, idx) => (
        part.isTerm ? (
          <button 
            key={idx} 
            onClick={(e) => onTermClick(e, part.text)} 
            className="font-bold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded px-1 transition-all cursor-help border-b border-indigo-200"
          >
            {part.text}
          </button>
        ) : (
          <span key={idx}>{part.text}</span>
        )
      ))}
    </div>
  );
};

const DictionaryCard = ({ item }: { item: VocabularyItem }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
    <div className="text-3xl font-black text-indigo-600 mb-2 group-hover:text-indigo-700">{item.term}</div>
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">{item.pronunciation}</span>
    </div>
    <p className="text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4">{item.definition}</p>
  </div>
);

const QuestionCard = ({ question, keyTerms, onTermClick, level, highlightedSet }: { question: ReviewQuestion, keyTerms: string[], onTermClick: (e: React.MouseEvent<HTMLButtonElement>, t: string) => void, level?: string, highlightedSet: Set<string> }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const splitRegex = /rationale:?/i;
  const parts = question.answer.split(splitRegex);
  const baseAnswer = parts[0].trim();
  const rationale = parts[1] ? parts[1].trim() : null;
  
  const label = level === EducationalLevel.JHS ? "Mastery Checkpoint" : "Technical Appraisal";

  return (
    <div className="p-8 md:p-12 bg-slate-900 rounded-[3rem] text-white space-y-8 shadow-2xl border border-slate-800 w-full overflow-hidden transition-all border-l-[10px] border-l-indigo-600">
      <div className="flex gap-6">
        <span className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-900/50">?</span>
        <div className="flex-1 space-y-4 pt-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-80">{label}</div>
          <div className="text-xl md:text-2xl font-bold leading-relaxed break-words">
             <ContentRenderer text={question.question} keyTerms={keyTerms} onTermClick={onTermClick} highlightedSet={highlightedSet} />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 md:ml-24">
        {!showAnswer && question.hint && (
          <button onClick={() => setShowHint(!showHint)} className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hover:bg-white/10 transition-all">
            {showHint ? 'Hide Clue' : 'Unlock Hint'}
          </button>
        )}
        <button onClick={() => setShowAnswer(!showAnswer)} className={`text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl border transition-all ${showAnswer ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' : 'bg-white text-slate-900 border-white hover:bg-slate-100'}`}>
          {showAnswer ? 'Hide Solution' : 'Check Solution'}
        </button>
      </div>

      {showHint && !showAnswer && (
        <div className="md:ml-24 p-6 bg-indigo-500/10 text-indigo-100 text-base italic rounded-3xl border border-indigo-500/20 animate-in slide-in-from-top-2">
          <span className="font-black text-[9px] text-indigo-400 uppercase tracking-widest block mb-2">Academic Clue</span>
          <ContentRenderer text={question.hint} keyTerms={keyTerms} onTermClick={onTermClick} highlightedSet={highlightedSet} />
        </div>
      )}

      {showAnswer && (
        <div className="md:ml-24 space-y-6 animate-in slide-in-from-top-4">
          <div className="p-8 bg-white/5 text-white text-xl font-bold rounded-[2.5rem] border border-white/10 shadow-inner">
            <span className="font-black text-[9px] text-emerald-400 uppercase tracking-widest block mb-4">Master Response</span>
            <ContentRenderer text={baseAnswer} keyTerms={keyTerms} onTermClick={onTermClick} highlightedSet={highlightedSet} />
          </div>
          {rationale && (
            <div className="p-8 bg-indigo-600/20 text-indigo-100 text-base font-medium rounded-[2.5rem] border border-indigo-500/20">
              <span className="font-black text-[9px] text-indigo-300 uppercase tracking-widest block mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> logic Rationale
              </span>
              <ContentRenderer text={rationale} keyTerms={keyTerms} onTermClick={onTermClick} highlightedSet={highlightedSet} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ExampleCard = ({ example, lesson, onTermClick, level, highlightedSet }: { example: Example; lesson: LessonContent | null; onTermClick: (e: React.MouseEvent<HTMLButtonElement>, term: string) => void; level?: string, highlightedSet: Set<string> }) => {
  const [showSolution, setShowSolution] = useState(false);
  const styles = difficultyStyles[example.difficulty] || difficultyStyles.Moderate;
  
  const label = level === EducationalLevel.SHS ? "Academic Case Study" : "Discovery Lab Scenario";

  return (
    <div className={`p-8 md:p-12 rounded-[4rem] border-2 ${styles.border} bg-white space-y-10 shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h4 className="font-black text-slate-900 uppercase tracking-tight text-[12px] flex items-center gap-4">
          <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${styles.accent}`}></span>
          {label}
        </h4>
        <span className={`px-5 py-2 text-[10px] font-black rounded-full uppercase tracking-widest self-start md:self-auto ${styles.badge}`}>{example.difficulty}</span>
      </div>
      
      <div className="text-slate-800 font-bold text-2xl md:text-3xl leading-snug tracking-tight">
          <ContentRenderer text={example.problem} keyTerms={lesson?.keyTerms || []} onTermClick={onTermClick} highlightedSet={highlightedSet} />
      </div>

      {showSolution ? (
        <div className="space-y-10 pt-10 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-8">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedural Resolution</h5>
            <div className="bg-slate-50 p-8 md:p-10 rounded-[3rem] text-slate-700 leading-relaxed font-medium text-lg border border-slate-100 shadow-inner">
               <ContentRenderer text={example.solution} keyTerms={lesson?.keyTerms || []} onTermClick={onTermClick} highlightedSet={highlightedSet} />
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Principle</h5>
            <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] text-lg text-indigo-900 italic font-medium border border-indigo-100 leading-relaxed">
               <ContentRenderer text={example.reasoning} keyTerms={lesson?.keyTerms || []} onTermClick={onTermClick} highlightedSet={highlightedSet} />
            </div>
          </div>
          <button onClick={() => setShowSolution(false)} className="w-full py-4 text-[10px] font-black text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-widest">Collapse Simulation</button>
        </div>
      ) : (
        <button onClick={() => setShowSolution(true)} className={`w-full px-12 py-7 ${styles.accent} text-white rounded-[2.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 shadow-${styles.accent.split('-')[1]}-100`}>Run Practice Simulation</button>
      )}
    </div>
  );
};

const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, isLoading, onClose, onRegenerate, currentSubject, trackSubjects, onNavigateSubject, isDownloaded, onDownload, level }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [visuals, setVisuals] = useState<Record<number, { url: string; loading: boolean }>>({});
  const [glossary, setGlossary] = useState<Record<string, { definition: string; loading: boolean }>>({});
  const [activeTerm, setActiveTerm] = useState<{ term: string; top: number; left: number } | null>(null);

  const highlightedSet = useMemo(() => new Set<string>(), [currentSectionIndex, lesson]);

  useEffect(() => {
    if (lesson) {
      setCurrentSectionIndex(0);
      setGlossary({});
      setVisuals({});
      lesson.sections.forEach((s, i) => { 
        if (s.visualAidDescription) {
          setVisuals(v => ({ ...v, [i]: { url: '', loading: true } }));
          geminiService.generateVisual(s.visualAidDescription).then(url => setVisuals(v => ({ ...v, [i]: { url, loading: false } })));
        }
      });
    }
  }, [lesson]);

  const handleDefineTerm = async (term: string) => {
    if (!lesson || glossary[term.toLowerCase()]?.loading) return;
    setGlossary(prev => ({ ...prev, [term.toLowerCase()]: { definition: '', loading: true } }));
    try {
        const currentPara = lesson.sections[currentSectionIndex].contentBlocks.find(b => b.type === 'paragraph');
        const definition = await geminiService.defineTerm(term, (currentPara as any)?.content || '');
        setGlossary(prev => ({ ...prev, [term.toLowerCase()]: { definition, loading: false } }));
    } catch { setGlossary(prev => ({ ...prev, [term.toLowerCase()]: { definition: 'Timed out.', loading: false } })); }
  };

  const handleTermClick = (e: React.MouseEvent<HTMLButtonElement>, term: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTerm({ term, top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    if (!glossary[term.toLowerCase()]) handleDefineTerm(term);
  };

  useEffect(() => {
    const handleClose = () => setActiveTerm(null);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'paragraph': 
        return (
          <div className="prose prose-indigo max-w-none text-xl text-slate-700 leading-[1.9] mb-12 font-medium tracking-tight">
            <ContentRenderer text={block.content as string} keyTerms={lesson?.keyTerms || []} onTermClick={handleTermClick} highlightedSet={highlightedSet} />
          </div>
        );
      case 'example': return <div className="mb-20"><ExampleCard example={block.content as Example} lesson={lesson} onTermClick={handleTermClick} level={level} highlightedSet={highlightedSet} /></div>;
      case 'question': return <div className="mb-16"><QuestionCard question={block.content as ReviewQuestion} keyTerms={lesson?.keyTerms || []} onTermClick={handleTermClick} level={level} highlightedSet={highlightedSet} /></div>;
      default: return null;
    }
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-16 animate-in fade-in">
      <div className="relative">
        <div className="w-44 h-44 border-[18px] border-slate-100 rounded-full shadow-inner"></div>
        <div className="w-44 h-44 border-[18px] border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="text-center space-y-4 max-w-lg px-6">
        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Synthesizing Module</h3>
        <p className="text-slate-500 font-medium text-2xl leading-relaxed italic">Constructing high-density curriculum content...</p>
      </div>
    </div>
  );

  if (!lesson) return null;

  const currentSection = lesson.sections[currentSectionIndex];

  return (
    <div className="space-y-20 pb-40">
      <div className="bg-white rounded-[3.5rem] md:rounded-[4.5rem] shadow-3xl border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-8 md:p-24 flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12 border-b border-slate-100 pb-20">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-6 py-2.5 rounded-full border border-indigo-100">DepEd Mastery Unit</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">{lesson.title}</h1>
              <p className="text-slate-500 font-medium italic text-2xl leading-relaxed max-w-4xl">{lesson.overview}</p>
            </div>
            <div className="flex gap-4 shrink-0 w-full md:w-auto">
              <button onClick={onDownload} disabled={isDownloaded} className={`flex-1 md:flex-none px-12 py-6 text-xs font-black rounded-[2rem] uppercase tracking-widest transition-all shadow-3xl active:scale-[0.98] ${isDownloaded ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                {isDownloaded ? '✓ Saved' : 'Save Unit'}
              </button>
              <button onClick={onClose} className="p-6 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-[2rem] transition-colors">✕</button>
            </div>
          </div>

          {currentSection && (
            <div key={currentSectionIndex} className="space-y-16 animate-in fade-in slide-in-from-right-12 duration-1000">
              <h2 className="text-indigo-600 font-black text-3xl md:text-4xl uppercase tracking-tight flex items-center gap-6 md:gap-10 mb-16">
                <span className="w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] md:rounded-[2.2rem] bg-indigo-600 text-white flex items-center justify-center text-2xl md:text-3xl shadow-xl shadow-indigo-100 shrink-0">0{currentSectionIndex + 1}</span>
                {currentSection.title}
              </h2>

              {visuals[currentSectionIndex]?.url && (
                <div className="space-y-6 mb-24">
                  <div className="relative group overflow-hidden rounded-[3.5rem] shadow-3xl border border-slate-100">
                    <img src={visuals[currentSectionIndex].url} className="w-full transition-transform duration-[3000ms] group-hover:scale-105" alt="Lesson Diagram" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
                  </div>
                  <p className="text-sm text-slate-400 italic text-center px-10 font-bold uppercase tracking-widest">Visual Aid: {currentSection.visualAidDescription}</p>
                </div>
              )}

              <div className="space-y-4">
                {currentSection.contentBlocks.map((b, i) => <div key={i}>{renderBlock(b)}</div>)}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-12 md:p-16 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-6">
          <button 
            disabled={currentSectionIndex === 0} 
            onClick={() => { setCurrentSectionIndex(i => i - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="px-8 md:px-14 py-6 md:py-7 bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] font-black text-sm text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            Go Back
          </button>
          <div className="hidden sm:flex gap-4">
            {lesson.sections.map((_, i) => (
              <div key={i} className={`h-4 rounded-full transition-all duration-700 ${i === currentSectionIndex ? 'w-20 bg-indigo-600' : 'w-4 bg-slate-300 hover:bg-slate-400 cursor-pointer'}`} onClick={() => setCurrentSectionIndex(i)} />
            ))}
          </div>
          <button 
            disabled={currentSectionIndex === lesson.sections.length - 1} 
            onClick={() => { setCurrentSectionIndex(i => i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="px-8 md:px-14 py-6 md:py-7 bg-indigo-600 text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-sm shadow-3xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Next Unit
          </button>
        </div>
      </div>

      {lesson.dictionary && lesson.dictionary.length > 0 && (
        <div className="bg-white p-12 md:p-20 rounded-[4rem] md:rounded-[5rem] shadow-3xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -translate-y-1/2 -translate-x-1/2 blur-[120px]"></div>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-slate-900 mb-16 text-center relative z-10">Essential Vocabulary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {lesson.dictionary.map((item, i) => (
              <DictionaryCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {lesson.studyTips && lesson.studyTips.length > 0 && (
        <div className="bg-slate-900 p-12 md:p-20 rounded-[4rem] md:rounded-[5rem] text-white shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[150px]"></div>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-16 md:mb-24 text-center">Efficiency Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {lesson.studyTips.map((tip, i) => (
              <div key={i} className="bg-white/5 p-10 md:p-14 rounded-[3.5rem] border border-white/10 hover:bg-white/10 transition-all group hover:-translate-y-3 flex flex-col items-center text-center">
                <span className="text-6xl block mb-10 transition-transform group-hover:scale-110 duration-700">⚡</span>
                <p className="text-xl md:text-2xl font-bold leading-relaxed tracking-tight">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTerm && (
        <div 
          style={{ top: `${activeTerm.top}px`, left: `${activeTerm.left}px` }} 
          className="fixed z-50 w-[90vw] md:w-[28rem] p-10 md:p-12 bg-white rounded-[3.5rem] md:rounded-[4.5rem] shadow-4xl border border-slate-100 animate-in zoom-in-95 duration-500" 
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="font-black text-xl text-indigo-600 uppercase tracking-widest mb-4 border-b border-indigo-50 pb-3">{activeTerm.term}</h4>
          {glossary[activeTerm.term.toLowerCase()]?.loading ? (
             <div className="space-y-4">
                <div className="h-6 bg-slate-100 rounded-full animate-pulse w-full"></div>
                <div className="h-6 bg-slate-100 rounded-full animate-pulse w-[90%]"></div>
                <div className="h-6 bg-slate-100 rounded-full animate-pulse w-[80%]"></div>
             </div>
          ) : (
             <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium tracking-tight">{glossary[activeTerm.term.toLowerCase()]?.definition || 'Processing...'}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonViewer;