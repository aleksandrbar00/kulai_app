import { Box, Heading, HStack, Badge, Text } from '@chakra-ui/react';
import { FaCalendar, FaClock } from 'react-icons/fa';

interface LessonHeaderProps {
  title: string;
  createdAt: string | number;
  duration: number; // in seconds
  isCompleted: boolean;
}

export const LessonHeader = ({ title, createdAt, duration, isCompleted }: LessonHeaderProps) => {
  const formatDate = (dateStr: string | number) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string | number) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box mb={8}>
      <Heading size="xl" mb={2}>
        {title || 'Untitled Lesson'}
      </Heading>
      <HStack color="gray.600">
        <HStack>
          <Box as={FaCalendar} />
          <Text>{formatDate(createdAt)} at {formatTime(createdAt)}</Text>
        </HStack>
        <HStack>
          <Box as={FaClock} />
          <Text>{formatDuration(duration)}</Text>
        </HStack>
        <Badge colorScheme={isCompleted ? 'green' : 'yellow'}>
          {isCompleted ? 'Completed' : 'In Progress'}
        </Badge>
      </HStack>
    </Box>
  );
}; 