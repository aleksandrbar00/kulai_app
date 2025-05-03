import { Box, Button, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router';

interface ErrorMessageProps {
  title: string;
  message: string;
  colorScheme?: 'red' | 'yellow';
}

export const ErrorMessage = ({ 
  title, 
  message, 
  colorScheme = 'red' 
}: ErrorMessageProps) => {
  const navigate = useNavigate();
  
  // Set colors based on the color scheme
  const colors = {
    red: {
      bg: 'red.50',
      color: 'red.800',
      border: 'red.300',
      icon: 'red.500'
    },
    yellow: {
      bg: 'yellow.50',
      color: 'yellow.800',
      border: 'yellow.300',
      icon: 'yellow.500'
    }
  };
  
  const selectedColors = colors[colorScheme];
  
  return (
    <Container maxW="container.lg" py={8}>
      <Box 
        p={4} 
        borderRadius="md" 
        bg={selectedColors.bg} 
        color={selectedColors.color} 
        borderWidth="1px" 
        borderColor={selectedColors.border} 
        mb={4}
      >
        <Flex alignItems="center">
          <Box as={FaExclamationTriangle} color={selectedColors.icon} mr={3} />
          <Box>
            <Heading size="sm" mb={1}>{title}</Heading>
            <Text>{message}</Text>
          </Box>
        </Flex>
      </Box>
      <Button mt={4} colorScheme="blue" onClick={() => navigate('/history')}>
        Return to History
      </Button>
    </Container>
  );
}; 