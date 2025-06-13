import { Box, Button, Container } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";

import {
  LessonHeader,
  PerformanceSummary,
  QuestionsSection,
  ErrorMessage,
} from "./components";

import { useLessonData } from "./hooks";

export const LessonDetailsPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const {
    lesson,
    isLoading,
    error,
    questions,
    correctAnswers,
    incorrectAnswers,
  } = useLessonData(lessonId);

  if (isLoading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Box p={4}>Загрузка информации об уроке...</Box>
      </Container>
    );
  }

  if (error || !lesson) {
    return (
      <ErrorMessage
        title="Урок не найден"
        message={error || "Запрошенный урок не найден в вашей истории"}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <ErrorMessage
        title="Вопросы не найдены"
        message="Этот урок не содержит вопросов"
        colorScheme="yellow"
      />
    );
  }

  return (
    <Container maxW="container.lg" py={6}>
      <Button mb={6} onClick={() => navigate("/history")} variant="ghost">
        <Box as={FaArrowLeft} mr={2} /> Назад к истории
      </Button>

      <LessonHeader
        title={lesson.title}
        createdAt={lesson.createdAt}
        duration={lesson.totalDuration}
        isCompleted={lesson.showResults}
      />

      <PerformanceSummary
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        totalQuestions={questions.length}
        duration={lesson.totalDuration}
      />

      <QuestionsSection questions={questions} />

      {!lesson.showResults && (
        <Box textAlign="center" mb={8}>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate(`/lesson-process/${lesson.id}`)}
          >
            Продолжить урок
          </Button>
        </Box>
      )}
    </Container>
  );
};
