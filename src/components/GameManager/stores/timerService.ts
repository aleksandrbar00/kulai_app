import { Signal } from '@preact/signals-react';
import type { LessonState } from './types';

// Timer-related state and operations
let lessonTimer: ReturnType<typeof setInterval> | null = null;
let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

export const timerService = {
  // Start or resume a timer
  startLessonTimer(lessonState: Signal<LessonState>) {
    // Clear any existing timer
    this.stopLessonTimer();
    
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
    lessonTimer = setInterval(() => {
      // If the lesson is already completed, clear the timer
      if (lessonState.value.showResults) {
        this.stopLessonTimer();
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
          this.stopLessonTimer();
          
          // Mark lesson as complete
          lessonState.value = {
            ...lessonState.value,
            showResults: true,
            timeRemaining: 0
          };
        }
      }
    }, 1000);
  
    // Return the timer ID for cleanup
    return lessonTimer;
  },
  
  // Stop the lesson timer
  stopLessonTimer() {
    if (lessonTimer) {
      clearInterval(lessonTimer);
      lessonTimer = null;
    }
  },
  
  // Autosave timer state every 5 seconds
  startAutoSave(lessonState: Signal<LessonState>) {
    // Clear any existing timer
    this.stopAutoSave();
    
    autoSaveTimer = setInterval(() => {
      if (lessonState.value.id) {
        localStorage.setItem(`kulai_current_lesson`, JSON.stringify(lessonState.value));
        localStorage.setItem(`kulai_lesson_${lessonState.value.id}`, JSON.stringify(lessonState.value));
      }
    }, 5000); // Save every 5 seconds
    
    return autoSaveTimer;
  },
  
  // Stop auto-saving
  stopAutoSave() {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  }
}; 