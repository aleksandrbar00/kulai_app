import { Box, Flex, Grid, Text, Badge, Button, Icon } from '@chakra-ui/react';
import { QuestionOption } from './QuestionOption';
import { useNavigate } from 'react-router';
import { FaBook } from 'react-icons/fa';

// Type definitions
export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  questionText?: string;
  text?: string;
  options: QuestionOption[];
  correctOptionId?: string;
  answer?: string;
  userAnswer?: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
}

export const QuestionCard = ({ question, index }: QuestionCardProps) => {
  const navigate = useNavigate();
  const displayText = question.questionText || question.text || '';
  const hasUserAnswer = !!question.userAnswer;
  
  // Determine if the user answered correctly
  const isCorrect = hasUserAnswer && (
    question.userAnswer === question.correctOptionId || 
    question.userAnswer === question.answer
  );

  // Navigate to question bank with the question text as a query parameter
  const navigateToQuestionBank = () => {
    const questionText = encodeURIComponent(displayText);
    navigate(`/question-bank?search=${questionText}`);
  };

  return (
    <Box 
      p={4} 
      borderWidth="1px" 
      borderRadius="md" 
      mb={4}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold">Question {index + 1}</Text>
        <Flex align="center">
          {hasUserAnswer ? (
            <Badge colorScheme={isCorrect ? 'green' : 'red'} mr={2}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </Badge>
          ) : (
            <Badge colorScheme="gray" mr={2}>Unanswered</Badge>
          )}
          <Button 
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={navigateToQuestionBank}
          >
            <Icon as={FaBook} mr={2} />
            View in Question Bank
          </Button>
        </Flex>
      </Flex>
      
      <Text mb={4}>{displayText}</Text>
      
      <Box borderTopWidth="1px" pt={3} mb={3} />
      
      {question.options && question.options.length > 0 ? (
        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
          {question.options.map((option) => {
            // Skip if option doesn't have the expected structure
            if (!option || !option.id) return null;
            
            // Determine if this option is the correct answer
            const isCorrectAnswer = 
              option.id === question.correctOptionId || 
              option.id === question.answer;
            
            // Determine if this was the user's selection
            const isUserSelection = question.userAnswer === option.id;
            
            return (
              <QuestionOption
                key={option.id}
                text={option.text}
                isCorrectAnswer={isCorrectAnswer}
                isUserSelection={isUserSelection}
              />
            );
          })}
        </Grid>
      ) : (
        <Box p={3} borderWidth="1px" borderRadius="md">
          <Text fontStyle="italic">No answer options available</Text>
        </Box>
      )}
    </Box>
  );
}; 