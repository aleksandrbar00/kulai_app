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
  // Calculate performance percentage
  const percentCorrect = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;
  
  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${seconds} секунд`;
    }
    
    if (remainingSeconds === 0) {
      return minutes === 1 ? `${minutes} минута` : `${minutes} минут`;
    }
    
    return `${minutes} мин ${remainingSeconds} сек`;
  };
  
  // Get color based on performance
  const getPerformanceColor = () => {
    if (percentCorrect >= 80) return 'green.500';
    if (percentCorrect >= 60) return 'yellow.500';
    return 'red.500';
  };

  return (
    <Box 
      mb={6} 
      p={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      borderColor="gray.200"
    >
      <Heading size="md" mb={3}>
        Результат: {percentCorrect}% ({correctAnswers} из {totalQuestions})
      </Heading>
      
      <Text mb={3}>
        Всего затрачено времени: {formatDuration(duration)}
      </Text>
      
      <Flex justify="space-between" wrap="wrap">
        <HStack mr={4} mb={2}>
          <Box as={FaCheck} color="green.500" />
          <Text>{correctAnswers} Правильно</Text>
        </HStack>
        <HStack mr={4} mb={2}>
          <Box as={FaTimes} color="red.500" />
          <Text>{incorrectAnswers} Неправильно</Text>
        </HStack>
        <HStack mb={2}>
          <Box as={FaQuestion} color="gray.500" />
          <Text>{unansweredQuestions} Без ответа</Text>
        </HStack>
      </Flex>
    </Box>
  );
}; 