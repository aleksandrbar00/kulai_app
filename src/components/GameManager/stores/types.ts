// Keys for localStorage
export const CURRENT_LESSON_KEY = 'kulai_current_lesson';
export const LESSON_LIST_KEY = 'kulai_lessons';

export type Question = {
  id: string;
  type: "input" | "multipleChoice";
  text: string;
  answer: string;
  options?: string[];
};

export type LessonState = {
  id: string;
  title: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  attempts: Record<string, number>; // questionId: attempts
  answers?: Record<string, string>; // questionId: userAnswer
  showResults: boolean;
  totalDuration: number; // in seconds
  startTime: number | null; // timestamp when lesson started
  timeRemaining: number; // seconds remaining
  createdAt: number;
};

export type LessonSummary = {
  id: string; 
  title: string; 
  createdAt: number;
}; 