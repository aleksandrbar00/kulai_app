import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react';
import { FaCheck, FaTimes, FaQuestion } from 'react-icons/fa';

interface PerformanceSummaryProps {
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  totalQuestions: number;
  duration: number; // in seconds
}

export const PerformanceSummary = ({
  correctAnswers,
  incorrectAnswers,
  unansweredQuestions,
  totalQuestions,
  duration,
}: PerformanceSummaryProps) => {
  const scorePercentage = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box mb={8} p={6} borderWidth="1px" borderRadius="lg">
      <Heading size="md" mb={4}>Performance Summary</Heading>
      
      <Flex mb={4} justify="space-between">
        <Box>
          <Text fontWeight="bold">Score</Text>
          <Text fontSize="2xl">{correctAnswers}/{totalQuestions}</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Percentage</Text>
          <Text fontSize="2xl">{scorePercentage}%</Text>
        </Box>
        <Box>
          <Text fontWeight="bold">Time Taken</Text>
          <Text fontSize="2xl">{formatDuration(duration)}</Text>
        </Box>
      </Flex>
      
      <Box 
        w="100%" 
        h="8px" 
        bg="gray.100" 
        borderRadius="md" 
        mb={4}
      >
        <Box 
          h="100%" 
          w={`${scorePercentage}%`}
          bg={scorePercentage >= 70 ? 'green.500' : scorePercentage >= 50 ? 'yellow.500' : 'red.500'}
          borderRadius="md"
        />
      </Box>
      
      <Flex justify="space-between" wrap="wrap">
        <HStack mr={4} mb={2}>
          <Box as={FaCheck} color="green.500" />
          <Text>{correctAnswers} Correct</Text>
        </HStack>
        <HStack mr={4} mb={2}>
          <Box as={FaTimes} color="red.500" />
          <Text>{incorrectAnswers} Incorrect</Text>
        </HStack>
        <HStack mb={2}>
          <Box as={FaQuestion} color="gray.500" />
          <Text>{unansweredQuestions} Unanswered</Text>
        </HStack>
      </Flex>
    </Box>
  );
}; 