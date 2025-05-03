import { Box, Heading, VStack } from '@chakra-ui/react';
import { QuestionCard } from './QuestionCard';
import type { Question } from './QuestionCard';

interface QuestionsSectionProps {
  questions: Question[];
}

export const QuestionsSection = ({ questions }: QuestionsSectionProps) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Box mb={8}>
      <Heading size="md" mb={4}>Questions</Heading>
      <VStack align="stretch">
        {questions.map((question, index) => (
          <QuestionCard 
            key={question.id}
            question={question}
            index={index}
          />
        ))}
      </VStack>
    </Box>
  );
}; 