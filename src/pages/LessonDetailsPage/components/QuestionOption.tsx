import { Box, Flex, GridItem, Text, Badge } from '@chakra-ui/react';
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
  // Determine styling based on correct/incorrect status
  let bgColor = '';
  let borderColor = 'gray.200';
  let borderWidth = '1px';
  let textColor = 'gray.800';
  
  if (isUserSelection && isCorrectAnswer) {
    // User selected correctly
    bgColor = 'green.100';
    borderColor = 'green.500';
    borderWidth = '2px';
    textColor = 'green.800';
  } else if (isUserSelection && !isCorrectAnswer) {
    // User selected incorrectly - make this very obvious
    bgColor = 'red.100';
    borderColor = 'red.500';
    borderWidth = '2px';
    textColor = 'red.800';
  } else if (isCorrectAnswer) {
    // Correct answer, but not selected
    bgColor = 'green.50';
    borderColor = 'green.300';
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
        _hover={{ opacity: 0.9 }}
        transition="all 0.2s"
      >
        <Flex justify="space-between" align="center">
          <Text 
            fontWeight={isUserSelection || isCorrectAnswer ? "bold" : "normal"}
            color={textColor}
          >
            {text}
          </Text>
          <Flex align="center">
            {isUserSelection && !isCorrectAnswer && (
              <Badge colorScheme="red" mr={2}>Wrong</Badge>
            )}
            {isUserSelection && isCorrectAnswer && (
              <Badge colorScheme="green" mr={2}>Correct</Badge>
            )}
            {isUserSelection && (
              <Box as={FaUser} color="blue.500" mr={2} />
            )}
            {isUserSelection && !isCorrectAnswer && (
              <Box as={FaTimes} color="red.500" mr={2} />
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