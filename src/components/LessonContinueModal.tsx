import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Box,
  Button,
  Text,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { 
  lessonActions,
  storageService
} from './GameManager/stores';

export const LessonContinueModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [existingLesson, setExistingLesson] = useState<{ id: string; title: string; createdAt: number } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Format date for display
  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  // Check for existing lessons when on lesson page
  useEffect(() => {
    const checkExistingLessons = () => {
      const lessons = storageService.getAvailableLessons();
      if (lessons.length > 0) {
        // Filter to only get unfinished lessons
        const unfinishedLessons = lessons.filter(lesson => !lessonActions.isLessonCompleted(lesson.id));
        
        if (unfinishedLessons.length > 0) {
          // Get most recent unfinished lesson
          const mostRecent = unfinishedLessons.sort((a, b) => b.createdAt - a.createdAt)[0];
          setExistingLesson(mostRecent);
          setIsOpen(true);
        } else {
          setIsOpen(false);
          setExistingLesson(null);
        }
      } else {
        setIsOpen(false);
        setExistingLesson(null);
      }
    };

    if (location.pathname === '/lesson') {
      checkExistingLessons();
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleContinue = () => {
    if (existingLesson) {
      lessonActions.loadLesson(existingLesson.id);
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
      bg="rgba(0, 0, 0, 0.7)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        bg="white"
        borderRadius="md"
        p={6}
        maxW="500px"
        width="100%"
        boxShadow="xl"
        position="relative"
      >
        <Box mb={4}>
          <Heading size="md">Continue Unfinished Lesson?</Heading>
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
          <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
            <Heading size="sm" mb={2}>{existingLesson.title || 'Untitled Lesson'}</Heading>
            <Text fontSize="sm" color="gray.600">
              Created: {formatDate(existingLesson.createdAt)}
            </Text>
          </Box>
          
          <Text>
            You have an unfinished lesson. Would you like to continue where you left off,
            or start a new lesson?
          </Text>
        </Box>

        <Flex gap={4} mt={6} justifyContent="flex-end">
          <Button variant="outline" onClick={handleStartNew}>
            Start New
          </Button>
          <Button colorScheme="blue" onClick={handleContinue}>
            Continue
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}; 