export type TQuestionOption = {
  id: string;
  text: string;
};

export type TQuestion = {
  id: string;
  questionText?: string;
  text?: string;
  options: TQuestionOption[];
  correctOptionId?: string;
  answer?: string;
  userAnswer?: string;
  type?: "multipleChoice" | "input";
};

export type TLessonData = {
  id: string;
  title: string;
  createdAt: string | number;
  questions: TQuestion[];
  currentQuestionIndex: number;
  score: number;
  totalDuration: number;
  showResults: boolean;
  answers?: Record<string, string>;
  attempts?: Record<string, number>;
  userAnswers?: Record<string, string>;
  selectedAnswers?: Record<string, string>;
  selections?: Record<string, string>;
};
