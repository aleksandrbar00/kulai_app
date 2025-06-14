import { signal, computed } from "@preact/signals-react";
import type { TLessonState } from "./types";
import type { CreateLessonDto } from "@/types/api";
import { lessonService } from "@/services/api";

const initialState: TLessonState = {
  id: "",
  title: "",
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  attempts: {},
  answers: {},
  showResults: false,
  startTime: null,
  timeRemaining: 0,
  createdAt: Date.now(),
};

export const lessonState = signal<TLessonState>(initialState);

export const currentQuestion = computed(
  () => lessonState.value.questions[lessonState.value.currentQuestionIndex],
);

export const currentAttempts = computed(
  () => lessonState.value.attempts[currentQuestion.value?.id] || 0,
);

export const attemptsLeft = computed(() => {
  if (!currentQuestion.value) return 0;
  return 1 - currentAttempts.value;
});

export const isLessonInitialized = computed(
  () => lessonState.value.questions.length > 0 && lessonState.value.id !== "",
);

export const timeRemaining = computed(() => lessonState.value.timeRemaining);

export const currentLessonId = computed(() => lessonState.value.id);

export const lessonActions = {
  async initializeLesson(
    title: string,
    questionIds: number[],
    duration: number = 60,
  ): Promise<string> {
    try {
      const lessonData: CreateLessonDto = {
        title,
        questionIds,
        maxTimeInSeconds: duration,
      };

      const response = await lessonService.create(lessonData);

      if (!response.currentQuestion || !response.currentQuestion.answers) {
        throw new Error("Invalid question data received from API");
      }

      const transformedQuestions = response.questions.map((el) => ({
        id: el.id.toString(),
        text: el.title,
        type: "multipleChoice" as const,
        options: el.answers.map((answer) => ({
          id: answer.id.toString(),
          text: answer.title,
        })),
        answer: el.correctAnswer?.title || "",
        correctOptionId: el.correctAnswer?.id.toString(),
      }));

      lessonState.value = {
        id: response.id.toString(),
        title: `Урок ${response.id}`,
        questions: transformedQuestions,
        currentQuestionIndex: 0,
        score: response.correctAnswersCount,
        attempts: {},
        answers: {},
        showResults: false,
        startTime: Date.now(),
        timeRemaining: response.timeRemaining,
        createdAt: Date.now(),
      };

      return response.id.toString();
    } catch (error) {
      console.error("Error creating lesson:", error);
      throw error;
    }
  },

  async submitAnswer(answerId: number): Promise<boolean> {
    try {
      const response = await lessonService.submitAnswer(
        parseInt(lessonState.value.id),
        { answerId },
      );

      const nextQuestionResponse = await lessonService.getById(
        parseInt(lessonState.value.id),
      );

      if (
        !nextQuestionResponse.currentQuestion ||
        !nextQuestionResponse.currentQuestion.answers
      ) {
        throw new Error("Invalid question data received from API");
      }

      lessonState.value = {
        ...lessonState.value,
        currentQuestionIndex: lessonState.value.currentQuestionIndex + 1,
        score: response.score,
        timeRemaining: response.timeRemaining,
        showResults: response.isLastQuestion,
      };

      return response.isCorrect;
    } catch (error) {
      console.error("Error submitting answer:", error);
      throw error;
    }
  },

  async moveToNextQuestion() {
    try {
      const response = await lessonService.getById(
        parseInt(lessonState.value.id),
      );

      lessonState.value = {
        ...lessonState.value,
        currentQuestionIndex: lessonState.value.currentQuestionIndex + 1,
        score: response.correctAnswersCount,
        timeRemaining: response.timeRemaining,
      };
    } catch (error) {
      console.error("Error getting next question:", error);
      throw error;
    }
  },

  resetLesson() {
    lessonState.value = {
      ...lessonState.value,
      currentQuestionIndex: 0,
      score: 0,
      attempts: {},
      showResults: false,
      startTime: null,
      timeRemaining: 0,
    };
  },

  clearCurrentLesson() {
    lessonState.value = {
      id: "",
      title: "",
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      attempts: {},
      answers: {},
      showResults: false,
      startTime: null,
      timeRemaining: 0,
      createdAt: Date.now(),
    };
  },

  isLessonCompleted(lessonId: string): boolean {
    return lessonState.value.id === lessonId && lessonState.value.showResults;
  },
};
