import { Box, Flex, Text, Heading, Button, VStack } from "@chakra-ui/react";
import { useSignals } from "@preact/signals-react/runtime";
import { WordGrid } from "../WordGrid";
import {
  lessonState,
  currentQuestion,
  attemptsLeft,
  lessonActions,
} from "../../stores";

type TProps = {
  onComplete: (finalScore: number, totalQuestions: number) => void;
};

export const CurrentQuestion = ({ onComplete }: TProps) => {
  useSignals();

  const handleQuestionResult = (id: number) => {
    lessonActions.submitAnswer(id);
  };

  const renderQuestionComponent = () => {
    if (lessonState.value.showResults) {
      return (
        <VStack textAlign="center">
          <Heading size="xl">Урок завершен</Heading>
          <Text fontSize="2xl" fontWeight="bold">
            Правильных ответов: {lessonState.value.score}/
            {lessonState.value.questions.length}
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            mt={4}
            onClick={() =>
              onComplete(
                lessonState.value.score,
                lessonState.value.questions.length,
              )
            }
          >
            Завершить урок
          </Button>
        </VStack>
      );
    }

    switch (currentQuestion.value.type) {
      case "multipleChoice":
        return (
          <>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {attemptsLeft.value <= 0 ? "Нет попыток" : "1 попытка"}
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
    <Flex
      direction="column"
      align="center"
      p={6}
      gap={8}
      maxW="800px"
      mx="auto"
    >
      {!lessonState.value.showResults && currentQuestion.value && (
        <>
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.500">
              Вопрос {lessonState.value.currentQuestionIndex + 1} из{" "}
              {lessonState.value.questions.length}
            </Text>
            <Heading size="lg" mt={2}>
              {currentQuestion.value.text}
            </Heading>
          </Box>

          <Box w="100%">{renderQuestionComponent()}</Box>

          <Box mt={4}>
            <Text fontWeight="bold">
              Правильные: {lessonState.value.score}/
              {lessonState.value.questions.length}
            </Text>
          </Box>
        </>
      )}

      {lessonState.value.showResults && renderQuestionComponent()}
    </Flex>
  );
};
