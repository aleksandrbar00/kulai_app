import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Text, Stack, HStack, Heading } from "@chakra-ui/react";
import { useSignals } from "@preact/signals-react/runtime";
import { questionService } from "../../../services/api";
import type { Category } from "../../../types/api";
import { LessonForm } from "./components/LessonForm";
import { CategoryList } from "./components/CategoryList";
import { lessonActions } from "../GameManager/stores";
import type { TLessonFormData } from "./types";

const LessonManager: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useSignals();

  const [lesson, setLesson] = useState<TLessonFormData>({
    id: Date.now().toString(),
    title: "Тест",
    totalDuration: 60,
    createdAt: new Date().toISOString(),
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(
    new Set(),
  );

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const data = await questionService.getAll();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleStartLesson = async () => {
    try {
      const questionIds = Array.from(selectedQuestions);

      const lessonId = await lessonActions.initializeLesson(
        lesson.title,
        questionIds,
        lesson.totalDuration,
      );

      navigate(`/lesson-process/${lessonId}`);
    } catch (error) {
      console.error("Error starting lesson:", error);
    }
  };

  if (isLoading) {
    return (
      <Box p={6} maxW="800px" margin="0 auto">
        <Text>Загрузка вопросов...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} maxW="800px" margin="0 auto">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={6} maxW="800px" margin="0 auto">
      <Heading as="h1" size="xl" mb={6}>
        Конструктор урока
      </Heading>

      <Stack gap={4}>
        <LessonForm lesson={lesson} setLesson={setLesson} />

        <Box>
          <Text mb={2}>Выберите вопросы</Text>
          <CategoryList
            categories={categories}
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
          />
        </Box>

        <Box mt={4}>
          <HStack justifyContent="space-between">
            <Text>Выбранные вопросы: {selectedQuestions.size}</Text>
            <Button
              colorScheme="blue"
              onClick={handleStartLesson}
              disabled={selectedQuestions.size === 0 || !lesson.title}
            >
              Начать урок
            </Button>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
};

export default LessonManager;
