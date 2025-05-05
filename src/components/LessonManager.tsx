import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  Heading,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { initializeLesson } from './GameManager/stores/lessonStore';
import type { Question } from './GameManager/types';
import { CategoryList } from './LessonManager/CategoryList';
import { LessonForm } from './LessonManager/LessonForm';

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

const LessonManager: React.FC = () => {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson>({
    id: Date.now().toString(),
    title: '',
    questions: [],
    totalDuration: 60,
    createdAt: new Date().toISOString(),
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());

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
        Управление уроками
      </Heading>

      <Stack gap={4}>
        <LessonForm 
          lesson={lesson} 
          setLesson={setLesson} 
        />

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