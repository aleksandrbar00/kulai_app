import { Box, Flex, Grid, Text, Badge, Button, Icon } from '@chakra-ui/react';
import { QuestionOption } from './QuestionOption';
import { useNavigate } from 'react-router';
import { FaBook } from 'react-icons/fa';
import { useEffect } from 'react';

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
  type?: 'multipleChoice' | 'input';
}

interface QuestionCardProps {
  question: Question;
  index: number;
}

export const QuestionCard = ({ question, index }: QuestionCardProps) => {
  const navigate = useNavigate();
  const displayText = question.questionText || question.text || '';
  const hasUserAnswer = !!question.userAnswer;
  
  // Get the correct answer text for multiple choice questions
  const correctAnswerText = question.type === 'multipleChoice'
    ? question.options.find(option => 
        option.id === question.correctOptionId || 
        option.id === question.answer
      )?.text
    : question.answer;
  
  // Determine if the user answered correctly
  const isCorrect = hasUserAnswer && (
    // For multiple-choice questions: compare text values
    (question.type === 'multipleChoice' && question.userAnswer === correctAnswerText) || 
    // For input questions: compare answer text
    (question.type === 'input' && question.userAnswer === question.answer)
  );
  
  // Get input-style question user answer for direct display
  const isInputQuestion = question.type === 'input';
  const isMultiChoiceQuestion = !isInputQuestion;
  
  // For multiple choice questions, get the user's selected wrong answer if it's not correct
  const selectedWrongOption = isMultiChoiceQuestion && hasUserAnswer && !isCorrect
    ? { text: question.userAnswer || '' }
    : null;
    
  // Get the correct option for multiple choice questions
  const correctOption = isMultiChoiceQuestion 
    ? { text: correctAnswerText || '' }
    : null;
    
  // Debug logging  
  useEffect(() => {
    if (isMultiChoiceQuestion && hasUserAnswer) {
      console.log('Question data:', {
        id: question.id,
        type: question.type,
        questionText: displayText,
        userAnswer: question.userAnswer,
        correctOptionId: question.correctOptionId,
        correctAnswerText,
        answer: question.answer,
        options: question.options,
        isCorrect,
        selectedWrongOption,
        correctOption
      });
    }
  }, [question]);

  // Get user input answer for display
  const userInputAnswer = isInputQuestion && hasUserAnswer && !isCorrect 
    ? question.userAnswer 
    : null;

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
        <Text fontWeight="bold">Question {index + 1} {isMultiChoiceQuestion ? '(Multiple Choice)' : '(Input)'}</Text>
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
      
      {/* Display user's incorrect input answer */}
      {userInputAnswer && (
        <Box mb={4} p={3} borderWidth="1px" borderRadius="md" bg="red.100" borderColor="red.300">
          <Flex justify="space-between">
            <Text>
              <Text as="span" fontWeight="bold">Your answer: </Text>
              {userInputAnswer}
            </Text>
            <Badge colorScheme="red">Incorrect</Badge>
          </Flex>
        </Box>
      )}
      
      {/* Display user's incorrect multiple choice answer */}
      {selectedWrongOption && (
        <Box mb={4} p={3} borderWidth="1px" borderRadius="md" bg="red.100" borderColor="red.300">
          <Flex justify="space-between">
            <Text>
              <Text as="span" fontWeight="bold">Your selection: </Text>
              {selectedWrongOption.text}
            </Text>
            <Badge colorScheme="red">Incorrect</Badge>
          </Flex>
        </Box>
      )}
      
      {/* Display correct answer for input questions */}
      {isInputQuestion && (
        <Box mb={4} p={3} borderWidth="1px" borderRadius="md" bg="green.100" borderColor="green.300">
          <Flex justify="space-between">
            <Text>
              <Text as="span" fontWeight="bold">Correct answer: </Text>
              {question.answer}
            </Text>
            <Badge colorScheme="green">Correct</Badge>
          </Flex>
        </Box>
      )}
      
      {/* Display correct answer for multiple choice questions when user was wrong */}
      {isMultiChoiceQuestion && !isCorrect && hasUserAnswer && correctOption && (
        <Box mb={4} p={3} borderWidth="1px" borderRadius="md" bg="green.100" borderColor="green.300">
          <Flex justify="space-between">
            <Text>
              <Text as="span" fontWeight="bold">Correct answer: </Text>
              {correctOption.text}
            </Text>
            <Badge colorScheme="green">Correct</Badge>
          </Flex>
        </Box>
      )}
      
      {isMultiChoiceQuestion && (
        <>
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
                // Compare the option text with the user's answer string
                const isUserSelection = option.text === question.userAnswer;
                
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
        </>
      )}
    </Box>
  );
}; 