import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { WordInput } from "../WordInput";
import { WordGrid } from "../WordGrid";
import type { Question } from "../../types";

interface LessonProps {
  questions: Question[];
  onComplete: () => void;
}

export const Lesson = ({ questions, onComplete }: LessonProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleCorrect = () => {
    setScore(score + 1);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleIncorrect = () => {
    console.log("Incorrect")
  };

  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case "input":
        return (
          <WordInput
            word={currentQuestion.answer}
            onWordSelected={handleCorrect}
          />
        );
      case "multipleChoice":
        return (
          <WordGrid
            correctWord={currentQuestion.answer}
            wordOptions={currentQuestion.options || []}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Flex direction="column" align="center" p={6} gap={8} maxW="800px" mx="auto">
      <Box textAlign="center">
        <Text fontSize="sm" color="gray.500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </Text>
        <Heading size="lg" mt={2}>
          {currentQuestion.text}
        </Heading>
      </Box>

      <Box w="100%">
        {renderQuestionComponent()}
      </Box>

      <Box mt={4}>
        <Text fontWeight="bold">Score: {score}/{questions.length}</Text>
      </Box>
    </Flex>
  );
};