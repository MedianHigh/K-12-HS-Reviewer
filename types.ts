export enum EducationalLevel {
  JHS = 'Junior High School',
  SPECIALIZED = 'Specialized Curricular Programs',
  SHS = 'Senior High School'
}

export interface CurricularTrack {
  id: string;
  name: string;
  level: EducationalLevel;
  subjects: Subject[];
}

export interface Subject {
  id:string;
  name: string;
  description: string;
  icon: string;
  category?: 'Core' | 'Applied' | 'Specialized';
  semester?: 1 | 2;
  quarters: QuarterData[];
}

export interface WeekData {
  name: string;
  melc: string;
  code: string;
}

export interface QuarterData {
  number: 1 | 2 | 3 | 4;
  weeks: WeekData[];
}

export type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Tricky';

export interface Example {
  difficulty: Difficulty;
  problem: string;
  solution: string;
  reasoning: string;
}

export interface ReviewQuestion {
  question: string;
  answer: string;
  hint?: string;
}

export type ContentBlock = 
  | { type: 'paragraph'; content: string }
  | { type: 'example'; content: Example }
  | { type: 'review'; content: string }
  | { type: 'scenario'; content: string }
  | { type: 'study-tip'; content: string }
  | { type: 'question'; content: ReviewQuestion };

export interface LessonSection {
  title: string;
  contentBlocks: ContentBlock[];
  visualAidDescription?: string;
  visualAidUrl?: string;
}

export interface VocabularyItem {
  term: string;
  pronunciation: string;
  definition: string;
}

export interface LessonContent {
  title: string;
  overview: string;
  sections: LessonSection[];
  references: Array<{
    title: string;
    uri: string;
  }>;
  keyTerms: string[];
  dictionary?: VocabularyItem[];
  studyTips?: string[];
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}