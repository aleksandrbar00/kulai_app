import { Box, Flex, Grid, Text, Badge, Icon } from '@chakra-ui/react';
import { QuestionOption } from './QuestionOption';
import { useNavigate } from 'react-router';
import { FaBook } from 'react-icons/fa';
import { useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../components/ui/styles';

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
    <Card mb={4}>
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontWeight="bold" color={colors.text.primary}>
            Question {index + 1} {isMultiChoiceQuestion ? '(Multiple Choice)' : '(Input)'}
          </Text>
          <Flex align="center">
            {hasUserAnswer ? (
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full"
                bg={isCorrect ? `${colors.status.success}30` : `${colors.status.error}30`}
                color={isCorrect ? colors.status.success : colors.status.error}
                mr={2}
              >
                {isCorrect ? 'Correct' : 'Incorrect'}
              </Badge>
            ) : (
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full"
                bg={`${colors.text.muted}30`}
                color={colors.text.muted}
                mr={2}
              >
                Unanswered
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={navigateToQuestionBank}
            >
              <Flex align="center">
                <Icon as={FaBook} mr={2} />
                View in Question Bank
              </Flex>
            </Button>
          </Flex>
        </Flex>
        
        <Text mb={4} color={colors.text.secondary}>{displayText}</Text>
        
        {/* Display user's incorrect input answer */}
        {userInputAnswer && (
          <Box 
            mb={4} 
            p={3} 
            borderWidth="1px" 
            borderRadius="md" 
            bg={`${colors.status.error}10`} 
            borderColor={`${colors.status.error}30`}
          >
            <Flex justify="space-between">
              <Text color={colors.text.primary}>
                <Text as="span" fontWeight="bold" color={colors.text.primary}>Your answer: </Text>
                {userInputAnswer}
              </Text>
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full"
                bg={`${colors.status.error}30`}
                color={colors.status.error}
              >
                Incorrect
              </Badge>
            </Flex>
          </Box>
        )}
        
        {/* Display user's incorrect multiple choice answer */}
        {selectedWrongOption && (
          <Box 
            mb={4} 
            p={3} 
            borderWidth="1px" 
            borderRadius="md" 
            bg={`${colors.status.error}10`} 
            borderColor={`${colors.status.error}30`}
          >
            <Flex justify="space-between">
              <Text color={colors.text.primary}>
                <Text as="span" fontWeight="bold" color={colors.text.primary}>Your selection: </Text>
                {selectedWrongOption.text}
              </Text>
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full"
                bg={`${colors.status.error}30`}
                color={colors.status.error}
              >
                Incorrect
              </Badge>
            </Flex>
          </Box>
        )}
        
        {/* Display correct answer for input questions */}
        {isInputQuestion && (
          <Box 
            mb={4} 
            p={3} 
            borderWidth="1px" 
            borderRadius="md" 
            bg={`${colors.status.success}10`} 
            borderColor={`${colors.status.success}30`}
          >
            <Flex justify="space-between">
              <Text color={colors.text.primary}>
                <Text as="span" fontWeight="bold" color={colors.text.primary}>Correct answer: </Text>
                {question.answer}
              </Text>
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full"
                bg={`${colors.status.success}30`}
                color={colors.status.success}
              >
                Correct
              </Badge>
            </Flex>
          </Box>
        )}
        
        {/* Display correct answer for multiple choice questions when user was wrong */}
        {isMultiChoiceQuestion && !isCorrect && hasUserAnswer && correctOption && (
          <Box 
            mb={4} 
            p={3} 
            borderWidth="1px" 
            borderRadius="md" 
            bg={`${colors.status.success}10`} 
            borderColor={`${colors.status.success}30`}
          >
            <Flex justify="space-between">
              <Text color={colors.text.primary}>
                <Text as="span" fontWeight="bold" color={colors.text.primary}>Correct answer: </Text>
                {correctOption.text}
              </Text>
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full"
                bg={`${colors.status.success}30`}
                color={colors.status.success}
              >
                Correct
              </Badge>
            </Flex>
          </Box>
        )}
        
        {isMultiChoiceQuestion && (
          <>
            <Box borderTopWidth="1px" borderColor={colors.border.normal} pt={3} mb={3} />
            
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
              <Box 
                p={3} 
                borderWidth="1px" 
                borderRadius="md"
                borderColor={colors.border.normal}
                bg={colors.background.main}
              >
                <Text fontStyle="italic" color={colors.text.muted}>No answer options available</Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Card>
  );
}; 