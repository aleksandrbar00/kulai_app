// stores/lessonStore.ts
import { signal, computed } from "@preact/signals-react";

type Question = {
  id: string;
  type: "input" | "multipleChoice";
  text: string;
  answer: string;
  options?: string[];
};

type LessonState = {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  attempts: Record<string, number>; // questionId: attempts
  showResults: boolean;
};

export const lessonState = signal<LessonState>({
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  attempts: {},
  showResults: false,
});

export const currentQuestion = computed(() => 
  lessonState.value.questions[lessonState.value.currentQuestionIndex]
);

export const currentAttempts = computed(() => 
  lessonState.value.attempts[currentQuestion.value?.id] || 0
);

export const attemptsLeft = computed(() => {
  if (!currentQuestion.value) return 0;
  return currentQuestion.value.type === "input" ? 3 - currentAttempts.value : 1 - currentAttempts.value;
});

export const initializeLesson = (questions: Question[]) => {
  lessonState.value = {
    questions,
    currentQuestionIndex: 0,
    score: 0,
    attempts: {},
    showResults: false,
  };
};

export const handleCorrectAnswer = () => {
  lessonState.value = {
    ...lessonState.value,
    score: lessonState.value.score + 1,
    attempts: {
      ...lessonState.value.attempts,
      [currentQuestion.value.id]: (lessonState.value.attempts[currentQuestion.value.id] || 0) + 1
    }
  };

  moveToNextQuestion();
};

export const handleWrongAnswer = () => {
  const newAttempts = {
    ...lessonState.value.attempts,
    [currentQuestion.value.id]: (lessonState.value.attempts[currentQuestion.value.id] || 0) + 1
  };

  lessonState.value = {
    ...lessonState.value,
    attempts: newAttempts
  };

  const maxAttempts = currentQuestion.value.type === "input" ? 3 : 1;
  if (newAttempts[currentQuestion.value.id] >= maxAttempts) {
    moveToNextQuestion();
  }
};

const moveToNextQuestion = () => {
  if (lessonState.value.currentQuestionIndex < lessonState.value.questions.length - 1) {
    lessonState.value = {
      ...lessonState.value,
      currentQuestionIndex: lessonState.value.currentQuestionIndex + 1
    };
  } else {
    lessonState.value = {
      ...lessonState.value,
      showResults: true
    };
  }
};

export const resetLesson = () => {
  lessonState.value = {
    ...lessonState.value,
    currentQuestionIndex: 0,
    score: 0,
    attempts: {},
    showResults: false,
  };
};