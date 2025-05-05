import { Box, Button, Container } from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router';

// Import reusable components
import {
  LessonHeader,
  PerformanceSummary,
  QuestionsSection,
  ErrorMessage
} from './components';

// Import custom hooks
import { useLessonData } from './hooks';

export const LessonDetailsPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  
  // Use the custom hook to load and process lesson data
  const {
    lesson,
    isLoading,
    error,
    questions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
  } = useLessonData(lessonId);

  // Loading state
  if (isLoading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Box p={4}>Загрузка информации об уроке...</Box>
      </Container>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <ErrorMessage
        title="Урок не найден"
        message={error || "Запрошенный урок не найден в вашей истории"}
      />
    );
  }

  // Empty questions state
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
      {/* Back button */}
      <Button
        mb={6}
        onClick={() => navigate('/history')}
        variant="ghost"
      >
        <Box as={FaArrowLeft} mr={2} /> Назад к истории
      </Button>

      {/* Lesson header with metadata */}
      <LessonHeader
        title={lesson.title}
        createdAt={lesson.createdAt}
        duration={lesson.totalDuration}
        isCompleted={lesson.showResults}
      />

      {/* Performance summary section */}
      <PerformanceSummary
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        unansweredQuestions={unansweredQuestions}
        totalQuestions={questions.length}
        duration={lesson.totalDuration}
      />

      {/* Questions section */}
      <QuestionsSection questions={questions} />
      
      {/* Continue button for incomplete lessons */}
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