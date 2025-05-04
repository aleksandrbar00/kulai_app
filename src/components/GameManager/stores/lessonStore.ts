// stores/lessonStore.ts
import { signal, computed, effect } from "@preact/signals-react";
import type { Question, LessonState } from "./types";
import { storageService } from "./storageService";
import { timerService } from "./timerService";

// Initialize with stored state or defaults
const initialState: LessonState = storageService.loadCurrentLesson() || {
  id: '',
  title: '',
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  attempts: {},
  answers: {},
  showResults: false,
  totalDuration: 60,
  startTime: null,
  timeRemaining: 60,
  createdAt: Date.now(),
};

export const lessonState = signal<LessonState>(initialState);

// Computed values
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

export const isLessonInitialized = computed(() => 
  lessonState.value.questions.length > 0 && lessonState.value.id !== ''
);

export const timeRemaining = computed(() => 
  lessonState.value.timeRemaining
);

export const currentLessonId = computed(() => 
  lessonState.value.id
);

// Persist current lesson state to localStorage whenever it changes
effect(() => {
  if (lessonState.value.id) {
    storageService.saveCurrentLesson(lessonState.value);
    storageService.updateLessonInList(lessonState.value);
    storageService.saveLessonById(lessonState.value);
  }
});

// API to interact with the lesson state
export const lessonActions = {
  // Initialize a new lesson
  initializeLesson(title: string, questions: Question[], duration: number = 60): string {
    const lessonId = Date.now().toString();
    
    lessonState.value = {
      id: lessonId,
      title: title || `Lesson ${lessonId}`,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      attempts: {},
      answers: {},
      showResults: false,
      totalDuration: duration,
      startTime: null,
      timeRemaining: duration,
      createdAt: Date.now(),
    };
    
    return lessonId;
  },
  
  // Check if a lesson exists
  checkLessonExists(lessonId: string): boolean {
    return storageService.checkLessonExists(lessonId);
  },
  
  // Load a lesson by ID
  loadLesson(lessonId: string): boolean {
    return storageService.loadLesson(lessonId, lessonState);
  },
  
  // Check if a lesson is completed
  isLessonCompleted(lessonId: string): boolean {
    return storageService.isLessonCompleted(lessonId);
  },
  
  // Start or resume the lesson timer
  startLessonTimer() {
    if (lessonState.value.showResults) {
      return null;
    }
    
    return timerService.startLessonTimer(lessonState);
  },
  
  // End the lesson due to timeout
  endLessonDueToTimeout() {
    lessonState.value = {
      ...lessonState.value,
      showResults: true,
      timeRemaining: 0
    };
  },
  
  // Handle correct answer
  handleCorrectAnswer(userAnswer?: string) {
    const questionId = currentQuestion.value?.id;
    
    if (questionId) {
      lessonState.value = {
        ...lessonState.value,
        score: lessonState.value.score + 1,
        attempts: {
          ...lessonState.value.attempts,
          [questionId]: (lessonState.value.attempts[questionId] || 0) + 1
        },
        // Store the user's answer (either provided or use the correct answer)
        answers: {
          ...lessonState.value.answers || {},
          [questionId]: userAnswer || currentQuestion.value.answer
        }
      };
    }
    
    this.moveToNextQuestion();
  },
  
  // Handle wrong answer
  handleWrongAnswer(userAnswer?: string) {
    // Update attempts for the current question
    const questionId = currentQuestion.value?.id;
    if (questionId) {
      const currentAttempts = lessonState.value.attempts[questionId] || 0;
      
      lessonState.value = {
        ...lessonState.value,
        attempts: {
          ...lessonState.value.attempts,
          [questionId]: currentAttempts + 1
        },
        // Store the actual wrong answer if provided
        answers: {
          ...lessonState.value.answers || {},
          [questionId]: userAnswer || 'incorrect'
        }
      };
      
      // If no more attempts left, move to next question
      if (attemptsLeft.value <= 0) {
        this.moveToNextQuestion();
      }
    }
  },
  
  // Move to the next question or show results if done
  moveToNextQuestion() {
    const nextIndex = lessonState.value.currentQuestionIndex + 1;
    
    if (nextIndex >= lessonState.value.questions.length) {
      // No more questions, show results
      lessonState.value = {
        ...lessonState.value,
        showResults: true
      };
    } else {
      // Move to next question
      lessonState.value = {
        ...lessonState.value,
        currentQuestionIndex: nextIndex
      };
    }
  },
  
  // Reset the current lesson to starting state
  resetLesson() {
    lessonState.value = {
      ...lessonState.value,
      currentQuestionIndex: 0,
      score: 0,
      attempts: {},
      showResults: false,
      startTime: null,
      timeRemaining: lessonState.value.totalDuration
    };
    
    // Clear timer if it exists
    timerService.stopLessonTimer();
  },
  
  // Clear the current lesson completely
  clearCurrentLesson() {
    timerService.stopLessonTimer();
    storageService.clearCurrentLesson();
    
    lessonState.value = {
      id: '',
      title: '',
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      attempts: {},
      answers: {},
      showResults: false,
      totalDuration: 60,
      startTime: null,
      timeRemaining: 60,
      createdAt: Date.now(),
    };
  },
  
  // Delete a lesson by ID
  deleteLesson(lessonId: string) {
    storageService.deleteLesson(lessonId);
    
    // If the current lesson is being deleted, clear it
    if (lessonState.value.id === lessonId) {
      this.clearCurrentLesson();
    }
  },
  
  // Start auto-saving the lesson state
  startAutoSave() {
    return timerService.startAutoSave(lessonState);
  },
  
  // Stop auto-saving the lesson state
  stopAutoSave() {
    timerService.stopAutoSave();
  }
};

// For backward compatibility, export the actions directly with proper binding
export const initializeLesson = (title: string, questions: Question[], duration?: number) => 
  lessonActions.initializeLesson(title, questions, duration);

export const checkLessonExists = (lessonId: string) =>
  lessonActions.checkLessonExists(lessonId);

export const loadLesson = (lessonId: string) =>
  lessonActions.loadLesson(lessonId);

export const isLessonCompleted = (lessonId: string) =>
  lessonActions.isLessonCompleted(lessonId);

export const startLessonTimer = () =>
  lessonActions.startLessonTimer();

export const endLessonDueToTimeout = () =>
  lessonActions.endLessonDueToTimeout();

export const handleCorrectAnswer = (userAnswer?: string) =>
  lessonActions.handleCorrectAnswer(userAnswer);

export const handleWrongAnswer = (userAnswer?: string) =>
  lessonActions.handleWrongAnswer(userAnswer);

export const resetLesson = () =>
  lessonActions.resetLesson();

export const clearCurrentLesson = () =>
  lessonActions.clearCurrentLesson();

export const deleteLesson = (lessonId: string) =>
  lessonActions.deleteLesson(lessonId);

export const startAutoSave = () =>
  lessonActions.startAutoSave();

export const stopAutoSave = () =>
  lessonActions.stopAutoSave();