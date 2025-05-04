import { Box, Flex, GridItem, Text, Badge } from '@chakra-ui/react';
import { FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { colors } from '../../../components/ui/styles';

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
  let bgColor = colors.background.card;
  let borderColor = colors.border.normal;
  let borderWidth = '1px';
  let textColor = colors.text.primary;
  
  if (isUserSelection && isCorrectAnswer) {
    // User selected correctly
    bgColor = `${colors.status.success}20`;
    borderColor = colors.status.success;
    borderWidth = '2px';
    textColor = colors.text.primary;
  } else if (isUserSelection && !isCorrectAnswer) {
    // User selected incorrectly - make this very obvious
    bgColor = `${colors.status.error}20`;
    borderColor = colors.status.error;
    borderWidth = '2px';
    textColor = colors.text.primary;
  } else if (isCorrectAnswer) {
    // Correct answer, but not selected
    bgColor = `${colors.status.success}10`;
    borderColor = `${colors.status.success}50`;
  } else {
    // Normal unselected option
    bgColor = colors.background.card;
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
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full"
                bg={`${colors.status.error}30`}
                color={colors.status.error}
                mr={2}
              >
                Wrong
              </Badge>
            )}
            {isUserSelection && isCorrectAnswer && (
              <Badge 
                px={2} 
                py={1} 
                borderRadius="full"
                bg={`${colors.status.success}30`}
                color={colors.status.success}
                mr={2}
              >
                Correct
              </Badge>
            )}
            {isUserSelection && (
              <Box as={FaUser} color={colors.brand.primary} mr={2} />
            )}
            {isUserSelection && !isCorrectAnswer && (
              <Box as={FaTimes} color={colors.status.error} mr={2} />
            )}
            {isCorrectAnswer && (
              <Box as={FaCheck} color={colors.status.success} />
            )}
          </Flex>
        </Flex>
      </Box>
    </GridItem>
  );
}; 