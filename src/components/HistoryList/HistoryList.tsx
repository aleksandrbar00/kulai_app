import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  Badge,
  Icon,
  Card,
  Tag,
  List,
} from '@chakra-ui/react';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Type definitions
type HistoryItem = {
  id: string;
  type: 'game' | 'lesson';
  title: string;
  date: Date;
  duration: number; // in minutes
  score?: number;
  maxScore?: number;
  correctAnswers?: number;
  totalQuestions?: number;
  status: 'completed' | 'failed' | 'incomplete';
};

export const HistoryList = () => {
  // Sample history data
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      type: 'game',
      title: 'JavaScript Basics Quiz',
      date: new Date('2023-05-15T14:30:00'),
      duration: 15,
      score: 85,
      maxScore: 100,
      correctAnswers: 17,
      totalQuestions: 20,
      status: 'completed'
    },
    {
      id: '2',
      type: 'lesson',
      title: 'React Hooks Tutorial',
      date: new Date('2023-05-14T10:15:00'),
      duration: 45,
      status: 'completed'
    },
    {
      id: '3',
      type: 'game',
      title: 'Advanced CSS Challenge',
      date: new Date('2023-05-12T16:45:00'),
      duration: 20,
      score: 60,
      maxScore: 100,
      correctAnswers: 12,
      totalQuestions: 20,
      status: 'failed'
    },
    {
      id: '4',
      type: 'lesson',
      title: 'TypeScript Fundamentals',
      date: new Date('2023-05-10T09:00:00'),
      duration: 30,
      status: 'incomplete'
    }
  ];

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

  const getStatusIcon = (status: HistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return <Icon as={FaCheckCircle} color="green.500" />;
      case 'failed':
        return <Icon as={FaTimesCircle} color="red.500" />;
      default:
        return <Icon as={FaClock} color="yellow.500" />;
    }
  };

  return (
    <Card.Root variant="outline" width="100%">
      <Card.Header>
        <Heading size="md">Recent Activity</Heading>
        <Text fontSize="sm" color="gray.500">Your last lessons and games</Text>
      </Card.Header>
      <Card.Body padding={0}>
        <List.Root>
          {historyItems.map((item) => (
            <List.Item key={item.id} _hover={{ bg: 'gray.50' }} padding={4}>
              <Flex justify="space-between" align="center">
                {/* Left side - Info */}
                <HStack>
                  <Box>
                    <Text fontWeight="medium">{item.title}</Text>
                    <HStack mt={1}>
                      <Text fontSize="sm" color="gray.500">
                        {formatDate(item.date)} • {formatTime(item.date)}
                      </Text>
                      <HStack>
                        <Icon as={FaClock} color="gray.400" boxSize={3} />
                        <Text fontSize="sm" color="gray.500">
                          {item.duration} min
                        </Text>
                      </HStack>
                    </HStack>
                  </Box>
                </HStack>

                {/* Right side - Stats */}
                <HStack>
                  {item.type === 'game' && (
                    <>
                      <Tag.Root colorScheme="blue" variant="subtle">
                        <Tag.Label>
                          {item.score}/{item.maxScore}
                        </Tag.Label>
                      </Tag.Root>
                      <Badge colorScheme={item.status === 'completed' ? 'green' : 'red'}>
                        {item.correctAnswers}/{item.totalQuestions} correct
                      </Badge>
                    </>
                  )}
                  <Box>
                    {getStatusIcon(item.status)}
                  </Box>
                </HStack>
              </Flex>
            </List.Item>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
};