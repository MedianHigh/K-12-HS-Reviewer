import { LessonContent } from '../types.ts';

const STORAGE_KEY = 'k12-master-review-lessons';

export interface StoredLesson {
  key: string;
  trackId: string;
  subjectId: string;
  quarter: number;
  week: string;
  timestamp: number;
  lessonContent: LessonContent;
  trackName: string;
  subjectName: string;
  subjectIcon: string;
}

function getLessonsFromStorage(): Record<string, StoredLesson> {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : {};
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return {};
  }
}

function saveLessonsToStorage(lessons: Record<string, StoredLesson>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
    alert("Could not save lesson. Your device storage might be full.");
  }
}

export const storageService = {
  generateKey(trackId: string, subjectId: string, quarter: number, week: string): string {
    return `${trackId}-${subjectId}-${quarter}-${week}`;
  },

  saveLesson(lessonData: Omit<StoredLesson, 'key' | 'timestamp'>): StoredLesson {
    const lessons = getLessonsFromStorage();
    const key = this.generateKey(lessonData.trackId, lessonData.subjectId, lessonData.quarter, lessonData.week);
    const newStoredLesson: StoredLesson = {
      ...lessonData,
      key,
      timestamp: Date.now(),
    };
    lessons[key] = newStoredLesson;
    saveLessonsToStorage(lessons);
    return newStoredLesson;
  },

  getLesson(key: string): StoredLesson | null {
    const lessons = getLessonsFromStorage();
    return lessons[key] || null;
  },

  getAllLessons(): StoredLesson[] {
    const lessons = getLessonsFromStorage();
    return Object.values(lessons).sort((a, b) => b.timestamp - a.timestamp);
  },

  deleteLesson(key: string): void {
    const lessons = getLessonsFromStorage();
    delete lessons[key];
    saveLessonsToStorage(lessons);
  },
};