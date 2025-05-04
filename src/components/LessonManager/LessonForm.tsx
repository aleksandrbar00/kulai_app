import React from 'react';
import { Box, Text, Input } from '@chakra-ui/react';
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

export const LessonForm: React.FC<LessonFormProps> = ({ lesson, setLesson }) => {
  return (
    <>
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
    </>
  );
}; 