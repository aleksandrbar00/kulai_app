import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";

type TProps = {
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  duration: number;
};

export const PerformanceSummary = ({
  correctAnswers,
  incorrectAnswers,
  totalQuestions,
  duration,
}: TProps) => {
  const percentCorrect =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

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

      <Text mb={3}>Всего затрачено времени: {formatDuration(duration)}</Text>

      <Flex justify="space-between" wrap="wrap">
        <HStack mr={4} mb={2}>
          <Box as={FaCheck} color="green.500" />
          <Text>{correctAnswers} Правильно</Text>
        </HStack>
        <HStack mr={4} mb={2}>
          <Box as={FaTimes} color="red.500" />
          <Text>{incorrectAnswers} Неправильно</Text>
        </HStack>
      </Flex>
    </Box>
  );
};
