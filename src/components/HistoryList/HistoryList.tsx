import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Badge,
  Button,
  ButtonGroup,
} from '@chakra-ui/react';
import { FaClock, FaRedo, FaInfoCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// Type definitions
type HistoryItem = {
  id: string;
  title: string;
  date: Date;
  duration: number; // in seconds
  score: number;
  totalQuestions: number;
  status: 'completed' | 'failed' | 'incomplete';
};

export const HistoryList = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load history data from localStorage
    const loadHistoryData = () => {
      try {
        // Get all items in localStorage
        const allLessons: HistoryItem[] = [];
        const LESSON_LIST_KEY = 'kulai_lessons';
        
        // Get the list of lessons
        const lessonList = localStorage.getItem(LESSON_LIST_KEY);
        if (lessonList) {
          const lessonIds = JSON.parse(lessonList);
          
          // For each lesson ID, get the lesson data
          for (const lessonMeta of lessonIds) {
            const lessonData = localStorage.getItem(`kulai_lesson_${lessonMeta.id}`);
            if (lessonData) {
              const lesson = JSON.parse(lessonData);
              
              // Format the data for our history list
              allLessons.push({
                id: lesson.id,
                title: lesson.title || 'Untitled Lesson',
                date: new Date(lesson.createdAt),
                duration: lesson.totalDuration,
                score: lesson.score,
                totalQuestions: lesson.questions.length,
                status: lesson.showResults ? 'completed' : 'incomplete'
              });
            }
          }
        }

        // Sort by date (newest first)
        allLessons.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        setHistoryItems(allLessons);
      } catch (error) {
        console.error('Error loading history data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoryData();
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleContinueLesson = (lessonId: string) => {
    navigate(`/lesson-process/${lessonId}`);
  };

  if (isLoading) {
    return (
      <Box p={4}>
        <Text>Loading history...</Text>
      </Box>
    );
  }

  if (historyItems.length === 0) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="md" bg="blue.50" color="blue.800">
        <Text>No lesson history found. Start a new lesson to track your progress!</Text>
      </Box>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="md" width="100%">
      <Box p={4} borderBottomWidth="1px">
        <Heading size="md">Lesson History</Heading>
        <Text fontSize="sm" color="gray.500">Your previously played lessons</Text>
      </Box>
      <Box>
        {historyItems.map((item) => (
          <Box 
            key={item.id} 
            _hover={{ bg: 'gray.50' }} 
            p={4}
            borderBottomWidth="1px"
            borderBottomColor="gray.100"
          >
            <Flex justify="space-between" align="center">
              {/* Left side - Info */}
              <Box>
                <Text fontWeight="medium">{item.title}</Text>
                <HStack mt={1}>
                  <Text fontSize="sm" color="gray.500">
                    {formatDate(item.date)} • {formatTime(item.date)}
                  </Text>
                  <HStack>
                    <Box as={FaClock} color="gray.400" boxSize={3} />
                    <Text fontSize="sm" color="gray.500">
                      {formatDuration(item.duration)}
                    </Text>
                  </HStack>
                </HStack>
              </Box>

              {/* Right side - Stats */}
              <HStack>
                {/* Status tag */}
                <Badge colorScheme={item.status === 'completed' ? 'green' : 'yellow'}>
                  {item.status === 'completed' ? 'Completed' : 'In Progress'}
                </Badge>
                
                {/* Score */}
                {item.status === 'completed' && (
                  <Badge colorScheme={item.score >= item.totalQuestions / 2 ? 'green' : 'red'}>
                    {item.score}/{item.totalQuestions} correct
                  </Badge>
                )}
                
                {/* Action buttons */}
                <ButtonGroup size="sm">
                  {/* Continue button for incomplete lessons */}
                  {item.status === 'incomplete' && (
                    <Button 
                      colorScheme="blue"
                      onClick={() => handleContinueLesson(item.id)}
                    >
                      <Box as={FaRedo} mr={2} />
                      Continue
                    </Button>
                  )}
                  
                  {/* View details button for all lessons */}
                  <Button 
                    variant={item.status === 'incomplete' ? "outline" : "solid"}
                    colorScheme="purple"
                    onClick={() => navigate(`/lesson-details/${item.id}`)}
                  >
                    <Box as={FaInfoCircle} mr={2} />
                    Details
                  </Button>
                </ButtonGroup>
              </HStack>
            </Flex>
          </Box>
        ))}
      </Box>
    </Box>
  );
};