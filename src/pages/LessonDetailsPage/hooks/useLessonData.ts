import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { lessonService } from "../../../services/api";
import type { TLessonData } from "../types";

export const useLessonData = (lessonId: string | undefined) => {
  const [lesson, setLesson] = useState<TLessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLessonData = async () => {
      setIsLoading(true);
      setError(null);

      if (!lessonId) {
        setError("No lesson ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const response = await lessonService.getById(parseInt(lessonId));

        if (!response) {
          setError("Lesson not found");
          setIsLoading(false);
          return;
        }

        const transformedQuestions = response.questions.map((q) => ({
          id: q.id.toString(),
          text: q.title,
          type: "multipleChoice" as const,
          options: q.answers.map((answer) => ({
            id: answer.id.toString(),
            text: answer.title,
          })),
          answer: q.correctAnswer.title,
          correctOptionId: q.correctAnswer.id.toString(),
        }));

        const lessonData: TLessonData = {
          id: response.id.toString(),
          title: response.title ?? `Урок ${response.id}`,
          questions: transformedQuestions,
          currentQuestionIndex: response.questions.findIndex(
            (q) => q.id === response.currentQuestion.id,
          ),
          score: response.correctAnswersCount,
          totalDuration: response.totalTimeInSeconds || 60,
          showResults: response.status === "finished",
          createdAt: new Date(response.startedAt).getTime(),
          attempts: {}, // We don't track attempts in the API
          answers: {}, // We don't track answers in the API
        };

        setLesson(lessonData);
      } catch (error) {
        console.error("Error loading lesson data:", error);
        setError("Error loading lesson data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadLessonData();
  }, [lessonId, navigate]);

  const questions =
    lesson?.questions.filter((q) => q && (q.questionText || q.text)) || [];

  const correctAnswers = lesson?.score || 0;

  const totalQuestions = lesson?.questions.length || 0;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const scorePercentage =
    questions.length > 0
      ? Math.round((correctAnswers / questions.length) * 100)
      : 0;

  return {
    lesson,
    isLoading,
    error,
    questions,
    correctAnswers,
    incorrectAnswers,
    scorePercentage,
  };
};
