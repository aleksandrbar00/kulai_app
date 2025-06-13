import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { Box, Button, Text, Flex, Heading } from "@chakra-ui/react";
import { Card } from "../../ui/Card";
import { lessonService } from "../../../services/api";
import { lessonActions } from "../LessonProcess/stores";

export const LessonContinueModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [existingLesson, setExistingLesson] = useState<{
    id: string;
    title: string;
    createdAt: number;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  useEffect(() => {
    const checkExistingLessons = async () => {
      try {
        const response = await lessonService.getHistory();
        const unfinishedLessons = response.lessons.filter(
          (lesson) => lesson.status !== "finished",
        );

        if (unfinishedLessons.length > 0) {
          const mostRecent = unfinishedLessons.sort(
            (a, b) =>
              new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
          )[0];

          setExistingLesson({
            id: mostRecent.id.toString(),
            title: mostRecent.title ?? `Урок ${mostRecent.id}`,
            createdAt: new Date(mostRecent.startedAt).getTime(),
          });
          setIsOpen(true);
        } else {
          setIsOpen(false);
          setExistingLesson(null);
        }
      } catch (error) {
        console.error("Error checking lesson history:", error);
        setIsOpen(false);
        setExistingLesson(null);
      }
    };

    if (location.pathname === "/lesson") {
      checkExistingLessons();
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleContinue = () => {
    if (existingLesson) {
      navigate(`/lesson-process/${existingLesson.id}`);
    }
    setIsOpen(false);
  };

  const handleStartNew = () => {
    lessonActions.clearCurrentLesson();
    setIsOpen(false);
  };

  if (!isOpen || !existingLesson) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(0, 0, 0, 0.3)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Card p={6} maxW="500px" width="100%" boxShadow="xl" position="relative">
        <Box mb={4}>
          <Heading size="md">Продолжить урок?</Heading>
          <Button
            position="absolute"
            top="8px"
            right="8px"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </Button>
        </Box>

        <Box gap={4} display="flex" flexDirection="column">
          <Box p={4} borderWidth="1px" borderRadius="md">
            <Heading size="sm" mb={2}>
              {existingLesson.title || "Untitled Lesson"}
            </Heading>
            <Text fontSize="sm">
              Создан: {formatDate(existingLesson.createdAt)}
            </Text>
          </Box>

          <Text>
            У вас есть незавершённый урок. Хотите продолжить с того места, где
            остановились, или начать новый урок?
          </Text>
        </Box>

        <Flex gap={4} mt={6} justifyContent="flex-end">
          <Button variant="outline" onClick={handleStartNew}>
            Начать новый
          </Button>
          <Button onClick={handleContinue}>Продолжить</Button>
        </Flex>
      </Card>
    </Box>
  );
};
