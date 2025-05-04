import { Signal } from '@preact/signals-react';
import { CURRENT_LESSON_KEY, LESSON_LIST_KEY } from './types';
import type { LessonState, LessonSummary } from './types';

// Storage service to handle all localStorage operations
export const storageService = {
  // Try to load current lesson from localStorage
  loadCurrentLesson(): LessonState | null {
    try {
      const storedLesson = localStorage.getItem(CURRENT_LESSON_KEY);
      if (storedLesson) {
        return JSON.parse(storedLesson);
      }
    } catch (error) {
      console.error("Error loading stored lesson state:", error);
    }
    return null;
  },

  // Get list of available lessons
  getAvailableLessons(): LessonSummary[] {
    try {
      const lessonList = localStorage.getItem(LESSON_LIST_KEY);
      if (lessonList) {
        return JSON.parse(lessonList);
      }
    } catch (error) {
      console.error("Error loading lesson list:", error);
    }
    return [];
  },

  // Save current lesson to localStorage
  saveCurrentLesson(lesson: LessonState): void {
    localStorage.setItem(CURRENT_LESSON_KEY, JSON.stringify(lesson));
  },

  // Save a lesson by its ID
  saveLessonById(lesson: LessonState): void {
    localStorage.setItem(`kulai_lesson_${lesson.id}`, JSON.stringify(lesson));
  },

  // Update a lesson in the lessons list
  updateLessonInList(lesson: LessonState): void {
    const lessons = this.getAvailableLessons();
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
  },

  // Check if a specific lesson exists in storage
  checkLessonExists(lessonId: string): boolean {
    const lessons = this.getAvailableLessons();
    return lessons.some(lesson => lesson.id === lessonId);
  },

  // Load a specific lesson from storage
  loadLesson(lessonId: string, lessonState: Signal<LessonState>): boolean {
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
  },

  // Check if a lesson is completed
  isLessonCompleted(lessonId: string): boolean {
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
  },

  // Clear current lesson state
  clearCurrentLesson(): void {
    localStorage.removeItem(CURRENT_LESSON_KEY);
  },

  // Delete a specific lesson from storage
  deleteLesson(lessonId: string): void {
    // Remove the lesson data
    localStorage.removeItem(`kulai_lesson_${lessonId}`);
    
    // Update the lesson list
    const lessons = this.getAvailableLessons();
    const updatedLessons = lessons.filter(lesson => lesson.id !== lessonId);
    localStorage.setItem(LESSON_LIST_KEY, JSON.stringify(updatedLessons));
  }
}; 