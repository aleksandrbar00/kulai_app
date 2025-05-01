// components/Lesson.tsx
import { Box, Flex, Text, Heading, Button, VStack } from "@chakra-ui/react";
import { useSignals } from "@preact/signals-react/runtime";
import { WordInput } from "../WordInput";
import { WordGrid } from "../WordGrid";
import { 
  lessonState,
  currentQuestion,
  currentAttempts,
  attemptsLeft,
  handleCorrectAnswer,
  handleWrongAnswer
} from "../../stores/lessonStore";

interface LessonProps {
  onComplete: (finalScore: number, totalQuestions: number) => void;
}

export const Lesson = ({ onComplete }: LessonProps) => {
  useSignals();
  
  const handleQuestionResult = (isCorrect: boolean) => {
    if (isCorrect) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer();
    }
  };

  const renderQuestionComponent = () => {
    if (lessonState.value.showResults) {
      return (
        <VStack textAlign="center">
          <Heading size="xl">Lesson Complete!</Heading>
          <Text fontSize="2xl" fontWeight="bold">
            Your Score: {lessonState.value.score}/{lessonState.value.questions.length}
          </Text>
          <Button 
            colorScheme="blue" 
            size="lg" 
            mt={4}
            onClick={() => onComplete(lessonState.value.score, lessonState.value.questions.length)}
          >
            Finish Lesson
          </Button>
        </VStack>
      );
    }

    switch (currentQuestion.value.type) {
      case "input":
        return (
          <>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Attempts left: {attemptsLeft.value}
            </Text>
            <WordInput
              word={currentQuestion.value.answer}
              onAttempt={handleQuestionResult}
              attemptsLeft={attemptsLeft.value}
              disabled={attemptsLeft.value <= 0}
            />
          </>
        );
      case "multipleChoice":
        return (
          <>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {attemptsLeft.value <= 0 ? "No more attempts" : "One attempt only"}
            </Text>
            <WordGrid
              correctWord={currentQuestion.value.answer}
              wordOptions={currentQuestion.value.options || []}
              onAttempt={handleQuestionResult}
              disabled={attemptsLeft.value <= 0}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Flex direction="column" align="center" p={6} gap={8} maxW="800px" mx="auto">
      {!lessonState.value.showResults && currentQuestion.value && (
        <>
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.500">
              Question {lessonState.value.currentQuestionIndex + 1} of {lessonState.value.questions.length}
            </Text>
            <Heading size="lg" mt={2}>
              {currentQuestion.value.text}
            </Heading>
          </Box>

          <Box w="100%">
            {renderQuestionComponent()}
          </Box>

          <Box mt={4}>
            <Text fontWeight="bold">
              Current Score: {lessonState.value.score}/{lessonState.value.questions.length}
            </Text>
          </Box>
        </>
      )}

      {lessonState.value.showResults && renderQuestionComponent()}
    </Flex>
  );
};