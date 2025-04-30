import {
    Box,
    Flex,
    Text,
    Button
  } from "@chakra-ui/react";
  import { useState } from "react";
  
  interface WordGridProps {
    correctWord: string;
    wordOptions: string[];
    onCorrect: () => void;
    onIncorrect: () => void;
  }
  
  export const WordGrid = ({ correctWord, wordOptions, onCorrect, onIncorrect }: WordGridProps) => {
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
  
    const handleWordSelect = (word: string) => {
      setSelectedWord(word);
      
      if (word.toLowerCase() === correctWord.toLowerCase()) {
        onCorrect();
      } else {
        onIncorrect();
      }
    };
  
    return (
      <Flex direction="column" align="center" gap={6}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Select the correct word:
        </Text>
        
        <Flex wrap="wrap" justify="center" gap={4} maxW="600px">
          {wordOptions.map((word, index) => (
            <Box
              key={index}
              p={6}
              bg={
                selectedWord === word
                  ? word === correctWord
                    ? "green.100"
                    : "red.100"
                  : "gray.100"
              }
              color={
                selectedWord === word
                  ? word === correctWord
                    ? "green.800"
                    : "red.800"
                  : "gray.800"
              }
              borderWidth="2px"
              borderColor={
                selectedWord === word
                  ? word === correctWord
                    ? "green.500"
                    : "red.500"
                  : "gray.200"
              }
              borderRadius="md"
              fontSize="xl"
              fontWeight="bold"
              cursor="pointer"
              _hover={{
                bg: "blue.50",
                borderColor: "blue.300"
              }}
              onClick={() => handleWordSelect(word)}
            >
              {word}
            </Box>
          ))}
        </Flex>
  
        {selectedWord && (
          <Button
            mt={4}
            colorScheme="blue"
            onClick={() => setSelectedWord(null)}
          >
            Try Again
          </Button>
        )}
      </Flex>
    );
  };