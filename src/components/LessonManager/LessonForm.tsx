import React, { useState } from 'react';
import { 
  Box, 
  Text, 
  Input,
} from '@chakra-ui/react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { colors } from '../ui/styles';
import type { Question } from '../GameManager/types';

interface Lesson {
  id: string;
  title: string;
  questions: Question[];
  totalDuration: number;
  createdAt: string;
}

interface LessonFormProps {
  lesson: Lesson;
  setLesson: React.Dispatch<React.SetStateAction<Lesson>>;
}

// Preset duration options (in seconds)
const timeOptions = [
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 120, label: '2 minutes' },
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
];

export const LessonForm: React.FC<LessonFormProps> = ({ lesson, setLesson }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  // Set preset time when a time option button is clicked
  const handlePresetTime = (seconds: number) => {
    setLesson(prev => ({ ...prev, totalDuration: seconds }));
    setShowCustomInput(false);
  };
  
  // Custom time input change handler
  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 60;
    setLesson(prev => ({ ...prev, totalDuration: value }));
  };
  
  return (
    <Card title="Create New Lesson" mb={6}>
      <Box p={5}>
        <Box mb={4}>
          <Text mb={2} color={colors.text.primary} fontWeight="medium">Lesson Title</Text>
          <Input
            value={lesson.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setLesson(prev => ({ ...prev, title: e.target.value }))
            }
            placeholder="Enter lesson title"
            bg={colors.background.card}
            borderColor={colors.border.normal}
            _hover={{ borderColor: colors.brand.primary }}
            _focus={{ 
              borderColor: colors.brand.primary,
              boxShadow: `0 0 0 1px ${colors.brand.primary}`
            }}
          />
        </Box>

        <Box mb={4}>
          <Text mb={2} color={colors.text.primary} fontWeight="medium">Duration</Text>
          <Box mb={3}>
            {/* Preset time options */}
            <Box display="flex" flexWrap="wrap" gap={2}>
              {timeOptions.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={lesson.totalDuration === option.value && !showCustomInput ? "primary" : "secondary"}
                  onClick={() => handlePresetTime(option.value)}
                  mb={2}
                >
                  {option.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant={showCustomInput ? "primary" : "secondary"}
                onClick={() => setShowCustomInput(true)}
                mb={2}
              >
                Custom
              </Button>
            </Box>
            
            {/* Custom time input */}
            {showCustomInput && (
              <Box mt={3}>
                <Text fontSize="sm" mb={1} color={colors.text.secondary}>Custom Duration (seconds)</Text>
                <Input
                  type="number"
                  value={lesson.totalDuration}
                  onChange={handleCustomTimeChange}
                  min={1}
                  placeholder="Enter duration in seconds"
                  bg={colors.background.card}
                  borderColor={colors.border.normal}
                  _hover={{ borderColor: colors.brand.primary }}
                  _focus={{ 
                    borderColor: colors.brand.primary,
                    boxShadow: `0 0 0 1px ${colors.brand.primary}`
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
}; 