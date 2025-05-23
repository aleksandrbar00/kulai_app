import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Collapsible,
} from '@chakra-ui/react';
import type { Question } from '../GameManager/types';

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

interface CategoryListProps {
  categories: Category[];
  selectedQuestions: Set<string>;
  setSelectedQuestions: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedQuestions,
  setSelectedQuestions,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

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

  return (
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
  );
}; 