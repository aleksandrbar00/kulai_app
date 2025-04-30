import {
  Box,
  Grid,
  Heading,
  Text,
  Card,
  Button,
  Flex,
  Icon
} from '@chakra-ui/react';
import { FaGamepad, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router';

export const CategoryCardsNavigation = () => {
  return (
    <Box p={6}>
      <Heading mb={8} textAlign="center" color="gray.700">
        Game Dashboard
      </Heading>
      
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap={6}
        maxW="800px"
        mx="auto"
      >
        {/* Play Game Card */}
        <Card.Root
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="lg"
          _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
          transition="all 0.2s"
        >
          <Card.Header>
            <Flex align="center">
              <Icon as={FaGamepad} w={8} h={8} color="blue.500" mr={3} />
              <Heading size="md">Play Game</Heading>
            </Flex>
          </Card.Header>
          <Card.Body>
            <Text>
              Start a new game and test your skills against players from around the world.
            </Text>
          </Card.Body>
          <Card.Footer>
            <Link to="/lesson">
                <Button 
                colorScheme="blue" 
                width="full"
                onClick={() => console.log('Navigate to play game')}
                >
                    Go to lesson
                </Button>
            </Link>
          </Card.Footer>
        </Card.Root>

        {/* History Card */}
        <Card.Root
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="lg"
          _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
          transition="all 0.2s"
        >
          <Card.Header>
            <Flex align="center">
              <Icon as={FaHistory} w={8} h={8} color="green.500" mr={3} />
              <Heading size="md">Game History</Heading>
            </Flex>
          </Card.Header>
          <Card.Body>
            <Text>
              View your past games, statistics, and achievements.
            </Text>
          </Card.Body>
          <Card.Footer>
            <Link to="/history">
                <Button 
                colorScheme="green" 
                width="full"
                onClick={() => console.log('Navigate to game history')}
                >
                View History
                </Button>
            </Link>
          </Card.Footer>
        </Card.Root>


        {/*QUESTION BANK CARD*/}
        <Card.Root
          borderWidth="1px"
          borderColor="gray.200"
          boxShadow="lg"
          _hover={{ transform: 'translateY(-5px)', boxShadow: 'xl' }}
          transition="all 0.2s"
        >
          <Card.Header>
            <Flex align="center">
              <Icon as={FaHistory} w={8} h={8} color="green.500" mr={3} />
              <Heading size="md">Question bank</Heading>
            </Flex>
          </Card.Header>
          <Card.Body>
            <Text>
              View all your questions.
            </Text>
          </Card.Body>
          <Card.Footer>
            <Link to="/question-bank">
                <Button 
                colorScheme="green" 
                width="full"
                onClick={() => console.log('Navigate to game history')}
                >
                View questions
                </Button>
            </Link>
          </Card.Footer>
        </Card.Root>
      </Grid>
    </Box>
  );
};