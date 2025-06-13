import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useSignals } from "@preact/signals-react/runtime";
import { lessonState } from "./stores";
import { Timer } from "./components/Timer";
import { CurrentQuestion } from "./components/CurrentQuestion";
import type { LessonSessionResponseDto } from "@/types/api";
import { lessonService } from "@/services/api";

export const LessonProcess = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  useSignals();

  useEffect(() => {
    // If we have a specific lessonId in the URL, load that lesson
    if (lessonId) {
      lessonService
        .getById(parseInt(lessonId))
        .then((response: LessonSessionResponseDto) => {
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
            currentQuestionIndex: response.questions.findIndex(
              (el) => el.id === response.currentQuestion.id,
            ),
            score: response.correctAnswersCount,
            attempts: {},
            answers: {},
            showResults: response.status === "finished",
            startTime: new Date(response.startedAt).getTime(),
            timeRemaining: response.timeRemaining,
            createdAt: new Date(response.startedAt).getTime(),
          };
        })
        .catch((error: Error) => {
          console.error("Error loading lesson:", error);
          navigate("/");
        });
    }
  }, [lessonId, navigate]);

  return (
    <Box p={6}>
      <Timer />
      <CurrentQuestion
        onComplete={() => {
          navigate("/");
        }}
      />
    </Box>
  );
};
