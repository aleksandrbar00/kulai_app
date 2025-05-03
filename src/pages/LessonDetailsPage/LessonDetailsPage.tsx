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
        <Box p={4}>Loading lesson details...</Box>
      </Container>
    );
  }

  // Error state
  if (error || !lesson) {
    return (
      <ErrorMessage
        title="Lesson Not Found"
        message={error || "The requested lesson could not be found in your history"}
      />
    );
  }

  // Empty questions state
  if (questions.length === 0) {
    return (
      <ErrorMessage
        title="No Questions Found"
        message="This lesson doesn't contain any questions"
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
        <Box as={FaArrowLeft} mr={2} /> Back to History
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
            Continue Lesson
          </Button>
        </Box>
      )}
    </Container>
  );
}; 