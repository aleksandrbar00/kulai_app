import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Spinner,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { questionsState, questionsActions } from "./questionsStore";
import { colors } from "../../ui/styles";
import type { QuestionDto } from "../../../types/api";
import { Card } from "../../ui/Card";
import { useSignals } from "@preact/signals-react/runtime";
import { SearchInput } from "./SearchInput";
import { useSearchParams } from "react-router";

export const QuestionsBank = () => {
  useSignals();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionDto | null>(
    null,
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<number, boolean>
  >({});
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Record<number, boolean>
  >({});
  const [searchParams] = useSearchParams();

  useEffect(() => {
    questionsActions.fetchQuestions();
  }, []);

  useEffect(() => {
    const searchFromParams = searchParams.get("search");
    if (
      searchFromParams &&
      !questionsState.value.isLoading &&
      questionsState.value.categories.length > 0
    ) {
      setSearchTerm(searchFromParams);
      findAndSelectQuestion(searchFromParams);
    }
  }, [
    searchParams,
    questionsState.value.isLoading,
    questionsState.value.categories,
  ]);

  const findAndSelectQuestion = (term: string) => {
    if (!term) return;

    const normalizedTerm = term.toLowerCase();

    for (const category of questionsState.value.categories) {
      setExpandedCategories((prev) => ({
        ...prev,
        [category.id]: true,
      }));

      for (const subcategory of category.subcategories) {
        const matchingQuestion = subcategory.questions.find((q) =>
          q.title.toLowerCase().includes(normalizedTerm),
        );

        if (matchingQuestion) {
          // Expand the subcategory
          setExpandedSubcategories((prev) => ({
            ...prev,
            [subcategory.id]: true,
          }));

          // Select the question
          setSelectedQuestion(matchingQuestion);
          return;
        }
      }
    }
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleSubcategory = (subcategoryId: number) => {
    setExpandedSubcategories((prev) => ({
      ...prev,
      [subcategoryId]: !prev[subcategoryId],
    }));
  };

  const handleQuestionClick = (question: QuestionDto) => {
    setSelectedQuestion(question);
  };

  return (
    <Flex gap={6} h="100%">
      {/* Questions list */}
      <Card flex="1" overflow="hidden">
        <Box p={4}>
          <Heading size="md" mb={4}>
            Банк вопросов
          </Heading>

          {/* Search form */}
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Loading state */}
          {questionsState.value.isLoading && (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" color={colors.brand.primary} />
            </Flex>
          )}

          {/* Error state */}
          {questionsState.value.error && (
            <Box mb={4} p={4} bg="red.100" color="red.700" borderRadius="md">
              {questionsState.value.error}
            </Box>
          )}

          {/* Questions list */}
          {!questionsState.value.isLoading &&
            !questionsState.value.error &&
            questionsState.value.categories && (
              <VStack align="stretch" gap={2}>
                {questionsState.value.categories.map((category) => (
                  <Box key={category.id}>
                    <Button
                      variant="ghost"
                      size="sm"
                      width="full"
                      justifyContent="space-between"
                      onClick={() => toggleCategory(category.id)}
                      py={1}
                    >
                      <HStack>
                        <Icon
                          as={
                            expandedCategories[category.id]
                              ? FaChevronDown
                              : FaChevronRight
                          }
                          color={colors.text.secondary}
                          mr={2}
                          boxSize={3}
                        />
                        <Text fontSize="sm">{category.title}</Text>
                      </HStack>
                      <Badge
                        bg={`${colors.status.info}30`}
                        color={colors.status.info}
                        borderRadius="full"
                        px={2}
                        fontSize="xs"
                      >
                        {category.subcategories.reduce(
                          (total, sub) => total + sub.questions.length,
                          0,
                        )}
                      </Badge>
                    </Button>

                    {expandedCategories[category.id] &&
                      category.subcategories && (
                        <VStack align="stretch" pl={6} mt={1} gap={1}>
                          {category.subcategories.map((subcategory) => (
                            <Box key={subcategory.id}>
                              <Button
                                variant="ghost"
                                size="sm"
                                width="full"
                                justifyContent="space-between"
                                onClick={() =>
                                  toggleSubcategory(subcategory.id)
                                }
                                py={1}
                              >
                                <HStack>
                                  <Icon
                                    as={
                                      expandedSubcategories[subcategory.id]
                                        ? FaChevronDown
                                        : FaChevronRight
                                    }
                                    color={colors.text.secondary}
                                    mr={2}
                                    boxSize={3}
                                  />
                                  <Text fontSize="sm">{subcategory.title}</Text>
                                </HStack>
                                <Badge
                                  bg={`${colors.status.info}30`}
                                  color={colors.status.info}
                                  borderRadius="full"
                                  px={2}
                                  fontSize="xs"
                                >
                                  {subcategory.questions.length}
                                </Badge>
                              </Button>

                              {expandedSubcategories[subcategory.id] &&
                                subcategory.questions && (
                                  <VStack align="stretch" pl={6} mt={1} gap={1}>
                                    {subcategory.questions.map((question) => (
                                      <Box
                                        key={question.id}
                                        py={1}
                                        px={3}
                                        borderRadius="md"
                                        cursor="pointer"
                                        bg={
                                          selectedQuestion?.id === question.id
                                            ? `${colors.brand.primary}20`
                                            : "transparent"
                                        }
                                        _hover={{
                                          bg: `${colors.background.light}50`,
                                        }}
                                        onClick={() =>
                                          handleQuestionClick(question)
                                        }
                                      >
                                        <Text fontSize="sm">
                                          {question.title}
                                        </Text>
                                      </Box>
                                    ))}
                                  </VStack>
                                )}
                            </Box>
                          ))}
                        </VStack>
                      )}
                  </Box>
                ))}
              </VStack>
            )}
        </Box>
      </Card>

      <Card flex="1" overflow="hidden">
        <Box p={4}>
          <Heading size="md" mb={4}>
            Детали вопроса
          </Heading>
          {selectedQuestion ? (
            <VStack align="stretch" gap={4}>
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Вопрос
                </Text>
                <Text>{selectedQuestion.title}</Text>
              </Box>
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Ответы
                </Text>
                <VStack align="stretch" gap={2}>
                  {selectedQuestion.answers.map((answer, index) => (
                    <Box
                      key={answer.id}
                      p={3}
                      borderRadius="md"
                      bg={
                        answer.id === selectedQuestion.correctAnswer.id
                          ? `${colors.status.success}20`
                          : `${colors.background.light}50`
                      }
                    >
                      <Text fontSize="sm">
                        {index + 1}. {answer.title}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
          ) : (
            <Text color={colors.text.secondary}>
              Выберите вопрос для просмотра деталей
            </Text>
          )}
        </Box>
      </Card>
    </Flex>
  );
};
