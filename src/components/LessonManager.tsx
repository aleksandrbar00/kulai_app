import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  Stack,
  Heading,
  VStack,
  HStack,
  Badge,
  Collapsible,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { initializeLesson } from './GameManager/stores/lessonStore';
import type { Question } from './GameManager/types';

interface Subcategory {
  id: string;
  name: string;
  questions: Question[];
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Lesson {
  id: string;
  title: string;
  questions: Question[];
  totalDuration: number;
  createdAt: string;
}

const LessonManager: React.FC = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson>({
    id: Date.now().toString(),
    title: '',
    questions: [],
    totalDuration: 60,
    createdAt: new Date().toISOString(),
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

  // Sample data with categories and subcategories
  const categories: Category[] = [
    {
      id: '1',
      name: 'JavaScript',
      subcategories: [
        {
          id: '1-1',
          name: 'Variables',
          questions: [
            { 
              id: '1-1-1', 
              text: 'What is the difference between let, const, and var?', 
              type: 'multipleChoice',
              answer: 'let and const have block scope, var has function scope',
              options: [
                'let and const have block scope, var has function scope',
                'All three have the same scope',
                'var has block scope, let and const have function scope',
                'They are all the same'
              ]
            },
            { 
              id: '1-1-2', 
              text: 'What is hoisting in JavaScript?', 
              type: 'input',
              answer: 'Move up'
            },
          ],
        },
        {
          id: '1-2',
          name: 'Functions',
          questions: [
            { 
              id: '1-2-1', 
              text: 'What is an arrow function?', 
              type: 'multipleChoice',
              answer: 'A concise syntax for writing function expressions with lexical this binding',
              options: [
                'A concise syntax for writing function expressions with lexical this binding',
                'A function that returns an arrow',
                'A function that can only be used in React',
                'A function that automatically binds to the global scope'
              ]
            },
            { 
              id: '1-2-2', 
              text: 'Explain closure in JavaScript', 
              type: 'input',
              answer: 'Outer scope'
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'React',
      subcategories: [
        {
          id: '2-1',
          name: 'Components',
          questions: [
            { 
              id: '2-1-1', 
              text: 'What is the difference between functional and class components?', 
              type: 'multipleChoice',
              answer: 'Functional components are simpler and use hooks, while class components have lifecycle methods',
              options: [
                'Functional components are simpler and use hooks, while class components have lifecycle methods',
                'There is no difference',
                'Class components are simpler and use hooks',
                'Functional components have lifecycle methods'
              ]
            },
            { 
              id: '2-1-2', 
              text: 'Explain React hooks', 
              type: 'input',
              answer: 'State func'
            },
          ],
        },
      ],
    },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleQuestionSelect = (questionId: string, isSelected: boolean) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(questionId);
      } else {
        newSet.delete(questionId);
      }
      return newSet;
    });
  };

  const handleSubcategorySelect = (subcategory: Subcategory, isSelected: boolean) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        subcategory.questions.forEach(q => newSet.add(q.id));
      } else {
        subcategory.questions.forEach(q => newSet.delete(q.id));
      }
      return newSet;
    });
  };

  const handleCategorySelect = (category: Category, isSelected: boolean) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        category.subcategories.forEach(sub => {
          sub.questions.forEach(q => newSet.add(q.id));
        });
      } else {
        category.subcategories.forEach(sub => {
          sub.questions.forEach(q => newSet.delete(q.id));
        });
      }
      return newSet;
    });
  };

  const handleStartLesson = () => {
    const selectedQuestionsList = Array.from(selectedQuestions).map(questionId => {
      for (const category of categories) {
        for (const subcategory of category.subcategories) {
          const question = subcategory.questions.find(q => q.id === questionId);
          if (question) return question;
        }
      }
      return null;
    }).filter(Boolean) as Question[];

    // Initialize the lesson in the store with the user-specified duration
    const lessonId = initializeLesson(
      lesson.title, 
      selectedQuestionsList, 
      lesson.totalDuration
    );

    // Navigate to the lesson page with the lesson ID
    navigate(`/lesson-process/${lessonId}`);
  };

  return (
    <Box p={6} maxW="800px" margin="0 auto">
      <Heading as="h1" size="xl" mb={6}>
        Lesson Manager
      </Heading>

      <Stack gap={4}>
        <Box>
          <Text mb={2}>Lesson Title</Text>
          <Input
            value={lesson.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setLesson(prev => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter lesson title"
          />
        </Box>

        <Box>
          <Text mb={2}>Total Duration (seconds)</Text>
          <Input
            type="number"
            value={lesson.totalDuration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setLesson(prev => ({ ...prev, totalDuration: parseInt(e.target.value) || 60 }))
            }
            min={1}
          />
        </Box>

        <Box>
          <Text mb={2}>Select Questions</Text>
          <VStack align="stretch" gap={2}>
            {categories.map(category => (
              <Box key={category.id} borderWidth="1px" borderRadius="md" p={2}>
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
                      <input
                        type="checkbox"
                        checked={category.subcategories.every(sub => 
                          sub.questions.every(q => selectedQuestions.has(q.id))
                        )}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleCategorySelect(category, e.target.checked)
                        }
                      />
                      <Text fontWeight="bold">{category.name}</Text>
                      <Badge colorScheme="blue">
                        {category.subcategories.reduce((acc, sub) => acc + sub.questions.length, 0)} questions
                      </Badge>
                    </HStack>
                  </Collapsible.Trigger>

                  <Collapsible.Content>
                    <VStack align="stretch" pl={8} mt={2}>
                      {category.subcategories.map(subcategory => (
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
                                <input
                                  type="checkbox"
                                  checked={subcategory.questions.every(q => selectedQuestions.has(q.id))}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                    handleSubcategorySelect(subcategory, e.target.checked)
                                  }
                                />
                                <Text fontWeight="medium">{subcategory.name}</Text>
                                <Badge colorScheme="green">
                                  {subcategory.questions.length} questions
                                </Badge>
                              </HStack>
                            </Collapsible.Trigger>

                            <Collapsible.Content>
                              <VStack align="stretch" pl={4} mt={1}>
                                {subcategory.questions.map(question => (
                                  <HStack key={question.id}>
                                    <input
                                      type="checkbox"
                                      checked={selectedQuestions.has(question.id)}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                        handleQuestionSelect(question.id, e.target.checked)
                                      }
                                    />
                                    <Text fontSize="sm">{question.text}</Text>
                                  </HStack>
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

        <Button
          colorScheme="blue"
          mt={6}
          onClick={handleStartLesson}
          disabled={!lesson.title || selectedQuestions.size === 0}
        >
          Start Lesson
        </Button>
      </Stack>
    </Box>
  );
};

export default LessonManager; 