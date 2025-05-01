// stores/lessonStore.ts
import { signal, computed, effect } from "@preact/signals-react";

type Question = {
  id: string;
  type: "input" | "multipleChoice";
  text: string;
  answer: string;
  options?: string[];
};

type LessonState = {
  id: string;
  title: string;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  attempts: Record<string, number>; // questionId: attempts
  showResults: boolean;
  totalDuration: number; // in seconds
  startTime: number | null; // timestamp when lesson started
  timeRemaining: number; // seconds remaining
  createdAt: number;
};

// Keys for localStorage
const CURRENT_LESSON_KEY = 'kulai_current_lesson';
const LESSON_LIST_KEY = 'kulai_lessons';

// Try to load current lesson from localStorage
const loadCurrentLesson = (): LessonState | null => {
  try {
    const storedLesson = localStorage.getItem(CURRENT_LESSON_KEY);
    if (storedLesson) {
      return JSON.parse(storedLesson);
    }
  } catch (error) {
    console.error("Error loading stored lesson state:", error);
  }
  return null;
};

// Get list of available lessons
export const getAvailableLessons = (): { id: string; title: string; createdAt: number }[] => {
  try {
    const lessonList = localStorage.getItem(LESSON_LIST_KEY);
    if (lessonList) {
      return JSON.parse(lessonList);
    }
  } catch (error) {
    console.error("Error loading lesson list:", error);
  }
  return [];
};

// Initialize with stored state or defaults
const initialState: LessonState = loadCurrentLesson() || {
  id: '',
  title: '',
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  attempts: {},
  showResults: false,
  totalDuration: 60,
  startTime: null,
  timeRemaining: 60,
  createdAt: Date.now(),
};

export const lessonState = signal<LessonState>(initialState);

// Update a lesson in the lessons list
const updateLessonInList = (lesson: LessonState) => {
  const lessons = getAvailableLessons();
  const existingIndex = lessons.findIndex(l => l.id === lesson.id);
  
  if (existingIndex >= 0) {
    lessons[existingIndex] = { 
      id: lesson.id, 
      title: lesson.title, 
      createdAt: lesson.createdAt 
    };
  } else {
    lessons.push({ 
      id: lesson.id, 
      title: lesson.title, 
      createdAt: lesson.createdAt 
    });
  }
  
  localStorage.setItem(LESSON_LIST_KEY, JSON.stringify(lessons));
};

// Persist current lesson state to localStorage whenever it changes
effect(() => {
  if (lessonState.value.id) {
    localStorage.setItem(CURRENT_LESSON_KEY, JSON.stringify(lessonState.value));
    
    // Update the lesson list if this is active
    updateLessonInList(lessonState.value);
    
    // Also save to the specific lesson storage
    localStorage.setItem(`kulai_lesson_${lessonState.value.id}`, JSON.stringify(lessonState.value));
  }
});

// Autosave timer state every 5 seconds
let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

export const startAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
  }
  
  autoSaveTimer = setInterval(() => {
    if (lessonState.value.id) {
      localStorage.setItem(CURRENT_LESSON_KEY, JSON.stringify(lessonState.value));
      localStorage.setItem(`kulai_lesson_${lessonState.value.id}`, JSON.stringify(lessonState.value));
    }
  }, 5000); // Save every 5 seconds
  
  return autoSaveTimer;
};

export const stopAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }
};

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

// Check if a specific lesson exists in storage
export const checkLessonExists = (lessonId: string): boolean => {
  const lessons = getAvailableLessons();
  return lessons.some(lesson => lesson.id === lessonId);
};

// Load a specific lesson from storage
export const loadLesson = (lessonId: string): boolean => {
  try {
    const storedLesson = localStorage.getItem(`kulai_lesson_${lessonId}`);
    if (storedLesson) {
      const loadedLesson = JSON.parse(storedLesson);
      
      // Load the lesson as is without resetting it
      lessonState.value = loadedLesson;
      return true;
    }
  } catch (error) {
    console.error(`Error loading lesson ${lessonId}:`, error);
  }
  return false;
};

// Check if a lesson is completed
export const isLessonCompleted = (lessonId: string): boolean => {
  try {
    const storedLesson = localStorage.getItem(`kulai_lesson_${lessonId}`);
    if (storedLesson) {
      const loadedLesson = JSON.parse(storedLesson);
      return loadedLesson.showResults === true;
    }
  } catch (error) {
    console.error(`Error checking lesson completion ${lessonId}:`, error);
  }
  return false;
};

// Start or resume a timer
export const startLessonTimer = () => {
  // If the lesson is already completed, don't start the timer
  if (lessonState.value.showResults) {
    return null;
  }

  const now = Date.now();
  
  // If timer wasn't previously started, set the start time
  if (!lessonState.value.startTime) {
    lessonState.value = {
      ...lessonState.value,
      startTime: now,
      timeRemaining: lessonState.value.totalDuration,
    };
  } 
  // If timer was started before, update with current time
  else {
    lessonState.value = {
      ...lessonState.value,
      startTime: now,
    };
  }

  // Store the reference time for accurate calculations
  const startTimeRef = now;
  const initialTimeRemaining = lessonState.value.timeRemaining;

  // Set up an interval to update the timer
  const timerId = setInterval(() => {
    // If the lesson is already completed, clear the timer
    if (lessonState.value.showResults) {
      clearInterval(timerId);
      return;
    }

    if (lessonState.value.startTime) {
      // Calculate elapsed time since the timer was started/resumed in this session
      const elapsedSinceStart = Math.floor((Date.now() - startTimeRef) / 1000);
      
      // Calculate the new remaining time based on the initial value
      const remaining = Math.max(0, initialTimeRemaining - elapsedSinceStart);
      
      lessonState.value = {
        ...lessonState.value,
        timeRemaining: remaining,
      };

      // End the lesson if time is up
      if (remaining <= 0) {
        clearInterval(timerId);
        endLessonDueToTimeout();
      }
    }
  }, 1000);

  // Return the timer ID for cleanup
  return timerId;
};

// End the lesson due to timeout
const endLessonDueToTimeout = () => {
  lessonState.value = {
    ...lessonState.value,
    showResults: true,
  };
};

export const initializeLesson = (title: string, questions: Question[], duration: number = 60) => {
  const newLessonId = `lesson_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  lessonState.value = {
    id: newLessonId,
    title,
    questions,
    currentQuestionIndex: 0,
    score: 0,
    attempts: {},
    showResults: false,
    totalDuration: duration,
    startTime: null,
    timeRemaining: duration,
    createdAt: Date.now(),
  };
  
  // Also save this lesson specifically
  localStorage.setItem(`kulai_lesson_${newLessonId}`, JSON.stringify(lessonState.value));
  
  return newLessonId;
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
    startTime: null,
    timeRemaining: lessonState.value.totalDuration,
  };
  
  // Update the lesson in storage
  if (lessonState.value.id) {
    localStorage.setItem(`kulai_lesson_${lessonState.value.id}`, JSON.stringify(lessonState.value));
  }
};

// Clear current lesson state
export const clearCurrentLesson = () => {
  localStorage.removeItem(CURRENT_LESSON_KEY);
  
  lessonState.value = {
    id: '',
    title: '',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    attempts: {},
    showResults: false,
    totalDuration: 60,
    startTime: null,
    timeRemaining: 60,
    createdAt: Date.now(),
  };
};

// Delete a specific lesson from storage
export const deleteLesson = (lessonId: string) => {
  // Remove the lesson data
  localStorage.removeItem(`kulai_lesson_${lessonId}`);
  
  // Update the lesson list
  const lessons = getAvailableLessons();
  const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
  localStorage.setItem(LESSON_LIST_KEY, JSON.stringify(updatedLessons));
  
  // If this was the current lesson, clear it
  if (lessonState.value.id === lessonId) {
    clearCurrentLesson();
  }
};