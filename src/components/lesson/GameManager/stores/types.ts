// Keys for localStorage
export const CURRENT_LESSON_KEY = "kulai_current_lesson";
export const LESSON_LIST_KEY = "kulai_lessons";

export type TQuestion = {
  id: string;
  text: string;
  type: "input" | "multipleChoice";
  options: Array<{
    id: string;
    text: string;
  }>;
  answer: string;
  correctOptionId: string;
}

export type TLessonState = {
  id: string;
  title: string;
  questions: TQuestion[];
  currentQuestionIndex: number;
  score: number;
  attempts: Record<string, number>; // questionId: attempts
  answers?: Record<string, string>; // questionId: userAnswer
  showResults: boolean;
  startTime: number | null; // timestamp when lesson started
  timeRemaining: number; // seconds remaining
  createdAt: number;
};

export type TLessonSummary = {
  id: string;
  title: string;
  createdAt: number;
};
