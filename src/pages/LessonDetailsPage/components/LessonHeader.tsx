import { Box, Heading, HStack, Badge, Text } from "@chakra-ui/react";
import { FaCalendar, FaClock } from "react-icons/fa";

type TProps = {
  title: string;
  createdAt: string | number;
  duration: number;
  isCompleted: boolean;
};

export const LessonHeader = ({
  title,
  createdAt,
  duration,
  isCompleted,
}: TProps) => {
  const formatDate = (dateStr: string | number) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ru-RU", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string | number) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Box mb={8}>
      <Heading size="xl" mb={2}>
        {title || "Урок без названия"}
      </Heading>
      <HStack color="gray.600">
        <HStack>
          <Box as={FaCalendar} />
          <Text>
            {formatDate(createdAt)} в {formatTime(createdAt)}
          </Text>
        </HStack>
        <HStack>
          <Box as={FaClock} />
          <Text>{formatDuration(duration)}</Text>
        </HStack>
        <Badge colorScheme={isCompleted ? "green" : "yellow"}>
          {isCompleted ? "Завершен" : "В процессе"}
        </Badge>
      </HStack>
    </Box>
  );
};
