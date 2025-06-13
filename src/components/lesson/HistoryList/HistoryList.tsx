import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Badge,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { FaClock, FaRedo, FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { lessonService } from "../../../services/api";

type THistoryItem = {
  id: string;
  title: string;
  date: Date;
  duration: number;
  score: number;
  totalQuestions: number;
  status: "completed" | "failed" | "incomplete";
};

export const HistoryList = () => {
  const [historyItems, setHistoryItems] = useState<THistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        setIsLoading(true);
        const response = await lessonService.getHistory();

        const transformedItems: THistoryItem[] = response.lessons.map(
          (lesson) => ({
            id: lesson.id.toString(),
            title: lesson.title ?? `Урок ${lesson.id}`,
            date: new Date(lesson.startedAt),
            duration: lesson.totalTimeInSeconds || 0,
            score: lesson.correctAnswersCount,
            totalQuestions: lesson.totalQuestions,
            status: lesson.status === "finished" ? "completed" : "incomplete",
          }),
        );

        transformedItems.sort((a, b) => b.date.getTime() - a.date.getTime());

        setHistoryItems(transformedItems);
        setError(null);
      } catch (error) {
        console.error("Error loading history data:", error);
        setError("Failed to load lesson history. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoryData();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleContinueLesson = (lessonId: string) => {
    navigate(`/lesson-process/${lessonId}`);
  };

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Загрузка истории...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        bg="red.50"
        color="red.800"
      >
        <Text>{error}</Text>
      </Box>
    );
  }

  if (historyItems.length === 0) {
    return (
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        bg="blue.50"
        color="blue.800"
      >
        <Text>Нет уроков в истории</Text>
      </Box>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="md" width="100%">
      <Box p={4} borderBottomWidth="1px">
        <Heading size="md">История уроков</Heading>
      </Box>
      <Box>
        {historyItems.map((item) => (
          <Box
            key={item.id}
            p={4}
            borderBottomWidth="1px"
            borderBottomColor="gray.100"
          >
            <Flex justify="space-between" align="center">
              {/* Left side - Info */}
              <Box>
                <Text fontWeight="medium">{item.title}</Text>
                <HStack mt={1}>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(item.date)} • {formatTime(item.date)}
                  </Text>
                  <HStack>
                    <Box as={FaClock} color="gray.400" boxSize={3} />
                    <Text fontSize="sm" color="gray.500">
                      {formatDuration(item.duration)}
                    </Text>
                  </HStack>
                </HStack>
              </Box>

              {/* Right side - Stats */}
              <HStack>
                {/* Status tag */}
                <Badge
                  colorScheme={item.status === "completed" ? "green" : "yellow"}
                >
                  {item.status === "completed" ? "Завершен" : "Активный"}
                </Badge>

                {/* Score */}
                {item.status === "completed" && (
                  <Badge
                    colorScheme={
                      item.score >= item.totalQuestions / 2 ? "green" : "red"
                    }
                  >
                    {item.score}/{item.totalQuestions} correct
                  </Badge>
                )}

                {/* Action buttons */}
                <ButtonGroup size="sm">
                  {/* Continue button for incomplete lessons */}
                  {item.status === "incomplete" && (
                    <Button
                      colorScheme="blue"
                      onClick={() => handleContinueLesson(item.id)}
                    >
                      <Box as={FaRedo} mr={2} />
                      Продолжить
                    </Button>
                  )}

                  {/* View details button for all lessons */}
                  {item.status === "completed" && (
                    <Button
                      colorScheme="purple"
                      onClick={() => navigate(`/lesson-details/${item.id}`)}
                    >
                      <Box as={FaInfoCircle} mr={2} />
                      Инфо
                    </Button>
                  )}
                </ButtonGroup>
              </HStack>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
