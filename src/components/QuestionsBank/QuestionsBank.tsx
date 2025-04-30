import { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Card,
  Collapsible,
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

// Type definitions
type Question = {
  id: number;
  question: string;
  answer: string;
};

type Subcategory = {
  id: number;
  name: string;
  questions: Question[];
};

type Category = {
  id: number;
  name: string;
  subcategories: Subcategory[];
};

export const QuestionBank = () => {
  // Sample data with TypeScript types
  const categories: Category[] = [
    {
      id: 1,
      name: 'JavaScript',
      subcategories: [
        {
          id: 101,
          name: 'Variables',
          questions: [
            {
              id: 1001,
              question: 'What is the difference between let, const, and var?',
              answer: 'var has function scope, let and const have block scope. const cannot be reassigned after declaration.'
            },
            {
              id: 1002,
              question: 'What is hoisting in JavaScript?',
              answer: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope before code execution.'
            }
          ]
        },
        {
          id: 102,
          name: 'Functions',
          questions: [
            {
              id: 1003,
              question: 'What is an arrow function?',
              answer: 'Arrow functions are a concise syntax for writing function expressions with lexical this binding.'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'React',
      subcategories: [
        {
          id: 201,
          name: 'Components',
          questions: [
            {
              id: 2001,
              question: 'What is the difference between functional and class components?',
              answer: 'Functional components are simpler and use hooks, while class components have lifecycle methods.'
            }
          ]
        }
      ]
    }
  ];

  // State with TypeScript types
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
  };

  const sidebarBg = useColorModeValue('gray.50', 'gray.700');
  const contentBg = useColorModeValue('white', 'gray.800');

  return (
    <Flex height="100vh" overflow="hidden">
      {/* Sidebar */}
      <Box
        width="300px"
        borderRightWidth="1px"
        borderColor="gray.200"
        backgroundColor={sidebarBg}
        overflowY="auto"
        padding={4}
      >
        <Heading size="md" marginBottom={4} color="teal.500">
          Question Bank
        </Heading>
        
        <VStack align="stretch">
          {categories.map((category) => (
            <Box key={category.id}>
              <Collapsible.Root
                open={!!expandedCategories[category.id]}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <Collapsible.Trigger
                  as={Button}
                  width="full"
                  justifyContent="space-between"
                >
                  <HStack>
                    <Text>{category.name}</Text>
                    <Badge colorScheme="teal" marginLeft={2}>
                      {category.subcategories.length}
                    </Badge>
                  </HStack>
                </Collapsible.Trigger>

                <Collapsible.Content>
                  <VStack align="stretch" paddingLeft={8} marginTop={2}>
                    {category.subcategories.map((subcategory) => (
                      <Box key={subcategory.id}>
                        <Collapsible.Root
                          open={!!expandedCategories[subcategory.id]}
                          onOpenChange={() => toggleCategory(subcategory.id)}
                        >
                          <Collapsible.Trigger
                            as={Button}
                            width="full"
                            justifyContent="space-between"
                          >
                            <HStack>
                              <Text fontSize="sm">{subcategory.name}</Text>
                              <Badge colorScheme="blue" marginLeft={2}>
                                {subcategory.questions.length}
                              </Badge>
                            </HStack>
                          </Collapsible.Trigger>

                          <Collapsible.Content>
                            <VStack align="stretch" paddingLeft={6} marginTop={1}>
                              {subcategory.questions.map((question) => (
                                <Button
                                  key={question.id}
                                  variant="ghost"
                                  size="xs"
                                  width="full"
                                  justifyContent="flex-start"
                                  onClick={() => handleQuestionClick(question)}
                                >
                                  <Text
                                    fontSize="xs"
                                    maxWidth="180px"
                                    textAlign="left"
                                  >
                                    {question.question}
                                  </Text>
                                </Button>
                              ))}
                            </VStack>
                          </Collapsible.Content>
                        </Collapsible.Root>
                      </Box>
                    ))}
                  </VStack>
                </Collapsible.Content>
              </Collapsible.Root>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} overflowY="auto" backgroundColor={contentBg} padding={6}>
        {selectedQuestion ? (
          <Card.Root>
            <Card.Header>
              <Heading size="md">Question Details</Heading>
            </Card.Header>
            <Card.Body>
              <Text fontWeight="bold" marginBottom={4}>
                {selectedQuestion.question}
              </Text>
              <Box
                padding={4}
                borderRadius="md"
                borderLeftWidth="4px"
                borderColor="teal.500"
              >
                <HStack marginBottom={2}>
                  <Text fontWeight="semibold">Correct Answer:</Text>
                </HStack>
                <Text>{selectedQuestion.answer}</Text>
              </Box>
            </Card.Body>
          </Card.Root>
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            height="60vh"
          >
            <Text fontSize="lg" color="gray.500">
              Select a question from the sidebar to view details
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};