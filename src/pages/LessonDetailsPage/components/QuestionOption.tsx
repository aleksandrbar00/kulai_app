import { Box, Flex, GridItem, Text } from '@chakra-ui/react';
import { FaCheck, FaTimes, FaUser } from 'react-icons/fa';

interface QuestionOptionProps {
  text: string;
  isCorrectAnswer: boolean;
  isUserSelection: boolean;
}

export const QuestionOption = ({ 
  text, 
  isCorrectAnswer, 
  isUserSelection 
}: QuestionOptionProps) => {
  // Determine the background color based on correct/incorrect status
  let bgColor = '';
  let borderColor = 'gray.200';
  let borderWidth = '1px';
  
  if (isUserSelection && isCorrectAnswer) {
    // User selected correctly
    bgColor = 'green.50';
    borderColor = 'green.400';
    borderWidth = '2px';
  } else if (isUserSelection && !isCorrectAnswer) {
    // User selected incorrectly
    bgColor = 'red.50';
    borderColor = 'red.400';
    borderWidth = '2px';
  } else if (isCorrectAnswer) {
    // Correct answer, but not selected
    bgColor = 'green.50';
    borderColor = 'green.200';
  } else {
    // Normal unselected option
    bgColor = 'gray.50';
  }

  return (
    <GridItem>
      <Box 
        p={3} 
        borderWidth={borderWidth}
        borderRadius="md"
        bg={bgColor}
        borderColor={borderColor}
        boxShadow={isUserSelection ? "md" : "none"}
        position="relative"
      >
        <Flex justify="space-between" align="center">
          <Text fontWeight={isUserSelection ? "bold" : "normal"}>{text}</Text>
          <Flex>
            {isUserSelection && !isCorrectAnswer && (
              <Box as={FaTimes} color="red.500" mr={2} />
            )}
            {isUserSelection && (
              <Box as={FaUser} color="blue.500" mr={isCorrectAnswer ? 2 : 0} />
            )}
            {isCorrectAnswer && (
              <Box as={FaCheck} color="green.500" />
            )}
          </Flex>
        </Flex>
      </Box>
    </GridItem>
  );
}; 