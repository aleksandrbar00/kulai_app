import { Box, Heading, VStack } from "@chakra-ui/react";
import { QuestionCard } from "./QuestionCard";
import type { TQuestion } from "../types";

type TProps = {
  questions: TQuestion[];
};

export const QuestionsSection = ({ questions }: TProps) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>
        Questions
      </Heading>
      <VStack align="stretch">
        {questions.map((question, index) => (
          <QuestionCard key={question.id} question={question} index={index} />
        ))}
      </VStack>
    </Box>
  );
};
