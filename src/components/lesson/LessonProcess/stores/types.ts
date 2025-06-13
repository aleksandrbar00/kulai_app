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
};

export type TLessonState = {
  id: string;
  title: string;
  questions: TQuestion[];
  currentQuestionIndex: number;
  score: number;
  attempts: Record<string, number>;
  answers?: Record<string, string>;
  showResults: boolean;
  startTime: number | null;
  timeRemaining: number;
  createdAt: number;
};

export type TLessonSummary = {
  id: string;
  title: string;
  createdAt: number;
};
