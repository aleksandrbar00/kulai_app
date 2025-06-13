export interface LoginUserDto {
  username: string;
  password: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  age?: number;
}

export interface UserInfoDto {
  id: number;
  name: string;
  email: string;
  age: number;
}

export interface Answer {
  id: number;
  title: string;
}

export interface QuestionDto {
  id: number;
  title: string;
  answers: Answer[];
  correctAnswer: Answer;
}

export interface Subcategory {
  id: number;
  title: string;
  questions: QuestionDto[];
}

export interface Category {
  id: number;
  title: string;
  subcategories: Subcategory[];
}

export interface CreateLessonDto {
  questionIds: number[];
  maxTimeInSeconds: number;
  title: string;
}

export interface LessonSessionResponseDto {
  id: number;
  title: string | null;
  status: "started" | "in_progress" | "finished";
  currentQuestion: QuestionDto;
  correctAnswersCount: number;
  questions: QuestionDto[];
  totalQuestions: number;
  timeRemaining: number;
  startedAt: string;
  finishedAt: string | null;
  totalTimeInSeconds: number | null;
}

export interface SubmitAnswerDto {
  answerId: number;
}

export interface SubmitAnswerResponseDto {
  isCorrect: boolean;
  correctAnswerId: number;
  isLastQuestion: boolean;
  score: number;
  timeRemaining: number;
}

export interface PaginatedResponse<T> {
  lessons: T[];
  total: number;
  page: number;
  totalPages: number;
}
