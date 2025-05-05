import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Input,
  Icon,
} from '@chakra-ui/react';
import { FaSearch, FaBook, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useSearchParams } from 'react-router';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { colors } from '../ui/styles';

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
          name: 'Переменные',
          questions: [
            {
              id: 1001,
              question: 'В чем разница между let, const и var?',
              answer: 'var имеет функциональную область видимости, let и const имеют блочную область видимости. const нельзя переназначить после объявления.'
            },
            {
              id: 1002,
              question: 'Что такое поднятие (hoisting) в JavaScript?',
              answer: 'Поднятие (Hoisting) - это поведение JavaScript, при котором объявления перемещаются в верхнюю часть их области видимости перед выполнением кода.'
            }
          ]
        },
        {
          id: 102,
          name: 'Функции',
          questions: [
            {
              id: 1003,
              question: 'Что такое стрелочная функция?',
              answer: 'Стрелочные функции - это краткий синтаксис для написания функциональных выражений с лексическим связыванием this.'
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
          name: 'Компоненты',
          questions: [
            {
              id: 2001,
              question: 'В чем разница между функциональными и классовыми компонентами?',
              answer: 'Функциональные компоненты проще и используют хуки, в то время как классовые компоненты имеют методы жизненного цикла.'
            }
          ]
        }
      ]
    }
  ];

  // State with TypeScript types
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  // Search functionality
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Handle initial search from URL if present
  useEffect(() => {
    const searchFromParams = searchParams.get('search');
    if (searchFromParams) {
      setSearchTerm(searchFromParams);
      findAndSelectQuestion(searchFromParams);
    }
  }, [searchParams]);

  // Function to find a question that matches search term and select it
  const findAndSelectQuestion = (term: string) => {
    if (!term) return;
    
    // Normalize term for case-insensitive search
    const normalizedTerm = term.toLowerCase();
    
    // Search through all categories and subcategories
    for (const category of categories) {
      // First, expand the category to show its contents
      setExpandedCategories(prev => ({
        ...prev,
        [category.id]: true
      }));
      
      for (const subcategory of category.subcategories) {
        // Expand subcategory if it contains matching questions
        const matchingQuestion = subcategory.questions.find(q => 
          q.question.toLowerCase().includes(normalizedTerm)
        );
        
        if (matchingQuestion) {
          // Expand the subcategory
          setExpandedCategories(prev => ({
            ...prev,
            [subcategory.id]: true
          }));
          
          // Select the question
          setSelectedQuestion(matchingQuestion);
          return;
        }
      }
    }
  };

  // Handle manual search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    findAndSelectQuestion(searchTerm);
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
  };

  return (
    <Box p={6}>
      <Heading 
        size="xl" 
        mb={6} 
        textAlign="center"
        color={colors.text.primary}
      >
        Банк вопросов
      </Heading>

      {/* Search bar */}
      <Box maxW="800px" mx="auto" mb={6}>
        <form onSubmit={handleSearch}>
          <Flex>
            <Input
              flex={1}
              placeholder="Поиск вопросов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="md 0 0 md"
              bg={colors.background.card}
              borderColor={colors.border.normal}
              color={colors.text.primary}
              _hover={{ borderColor: colors.brand.primary }}
              _focus={{ 
                borderColor: colors.brand.primary,
                boxShadow: `0 0 0 1px ${colors.brand.primary}`
              }}
            />
            <Button
              type="submit"
              borderRadius="0 md md 0"
              aria-label="Поиск"
              variant="primary"
            >
              <Icon as={FaSearch} />
            </Button>
          </Flex>
        </form>
      </Box>
      
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        gap={6}
        maxW="1200px"
        mx="auto"
      >
        {/* Sidebar */}
        <Card w={{ base: 'full', md: '300px' }}>
          <Box p={4}>
            <Flex align="center" mb={4}>
              <Box
                borderRadius="full"
                bg={`${colors.brand.primary}30`}
                p={3}
                mr={3}
              >
                <Icon as={FaBook} w={5} h={5} color={colors.brand.primary} />
              </Box>
              <Heading size="md" color={colors.text.primary}>
                Категории
              </Heading>
            </Flex>
            
            <VStack align="stretch" gap={3}>
              {categories.map((category) => (
                <Box key={category.id}>
                  <Button
                    variant="ghost"
                    width="full"
                    justifyContent="space-between"
                    onClick={() => toggleCategory(category.id)}
                    py={2}
                  >
                    <HStack>
                      <Icon 
                        as={expandedCategories[category.id] ? FaChevronDown : FaChevronRight} 
                        color={colors.text.secondary}
                        mr={2}
                      />
                      <Text>{category.name}</Text>
                    </HStack>
                    <Badge 
                      bg={`${colors.brand.primary}30`}
                      color={colors.brand.primary}
                      borderRadius="full"
                      px={2}
                    >
                      {category.subcategories.length}
                    </Badge>
                  </Button>

                  {expandedCategories[category.id] && (
                    <VStack align="stretch" pl={6} mt={1} gap={2}>
                      {category.subcategories.map((subcategory) => (
                        <Box key={subcategory.id}>
                          <Button
                            variant="ghost"
                            size="sm"
                            width="full"
                            justifyContent="space-between"
                            onClick={() => toggleCategory(subcategory.id)}
                            py={1}
                          >
                            <HStack>
                              <Icon 
                                as={expandedCategories[subcategory.id] ? FaChevronDown : FaChevronRight} 
                                color={colors.text.secondary}
                                mr={2}
                                boxSize={3}
                              />
                              <Text fontSize="sm">{subcategory.name}</Text>
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

                          {expandedCategories[subcategory.id] && (
                            <VStack align="stretch" pl={6} gap={1} mt={1}>
                              {subcategory.questions.map((question) => (
                                <Box 
                                  key={question.id}
                                  py={1}
                                  px={3}
                                  borderRadius="md"
                                  cursor="pointer"
                                  bg={selectedQuestion?.id === question.id ? 
                                    `${colors.brand.primary}20` : 'transparent'}
                                  _hover={{ bg: `${colors.background.light}50` }}
                                  onClick={() => handleQuestionClick(question)}
                                >
                                  <Text 
                                    fontSize="sm"
                                    maxW="100%"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                    whiteSpace="nowrap"
                                    color={selectedQuestion?.id === question.id ? 
                                      colors.brand.primary : colors.text.secondary}
                                  >
                                    {question.question}
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
          </Box>
        </Card>

        {/* Question display */}
        <Card flex={1}>
          <Box p={5}>
            {selectedQuestion ? (
              <Box>
                <Heading 
                  size="md" 
                  mb={4}
                  color={colors.text.primary}
                >
                  {selectedQuestion.question}
                </Heading>
                
                <Box 
                  p={4} 
                  bg={colors.background.main}
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor={colors.brand.primary}
                >
                  <Text color={colors.text.secondary}>
                    {selectedQuestion.answer}
                  </Text>
                </Box>
              </Box>
            ) : (
              <Flex 
                direction="column" 
                align="center" 
                justify="center" 
                h="100%" 
                minH="200px"
              >
                <Text
                  color={colors.text.muted}
                  textAlign="center"
                  p={6}
                >
                  Выберите вопрос из списка слева или используйте поиск, чтобы найти конкретный вопрос
                </Text>
              </Flex>
            )}
          </Box>
        </Card>
      </Flex>
    </Box>
  );
};