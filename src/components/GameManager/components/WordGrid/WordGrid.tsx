// components/WordGrid.tsx
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";

interface WordGridProps {
  correctWord: string;
  wordOptions: string[];
  onAttempt: (isCorrect: boolean, selectedWord: string) => void;
  disabled?: boolean;
}

export const WordGrid = ({ 
  correctWord, 
  wordOptions, 
  onAttempt,
  disabled = false
}: WordGridProps) => {
  useSignals();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  
  // Reset selectedWord when the correctWord changes (new question)
  useEffect(() => {
    setSelectedWord(null);
  }, [correctWord, wordOptions]);

  const handleWordSelect = (word: string) => {
    if (disabled || selectedWord !== null) return;
    
    setSelectedWord(word);
    const isCorrect = word.toLowerCase() === correctWord.toLowerCase();
    onAttempt(isCorrect, word);
  };

  // Function to explicitly reset state for next question
  const resetSelection = () => {
    setSelectedWord(null);
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
                ? word.toLowerCase() === correctWord.toLowerCase()
                  ? "green.100"
                  : "red.100"
                : "gray.100"
            }
            color={
              selectedWord === word
                ? word.toLowerCase() === correctWord.toLowerCase()
                  ? "green.800"
                  : "red.800"
                : "gray.800"
            }
            borderWidth="2px"
            borderColor={
              selectedWord === word
                ? word.toLowerCase() === correctWord.toLowerCase()
                  ? "green.500"
                  : "red.500"
                : "gray.200"
            }
            borderRadius="md"
            fontSize="xl"
            fontWeight="bold"
            cursor={!disabled && selectedWord === null ? "pointer" : "default"}
            _hover={{
              bg: !disabled && selectedWord === null ? "blue.50" : undefined,
              borderColor: !disabled && selectedWord === null ? "blue.300" : undefined
            }}
            onClick={() => !disabled && selectedWord === null && handleWordSelect(word)}
          >
            {word}
          </Box>
        ))}
      </Flex>

      {selectedWord && (
        <Button
          mt={4}
          colorScheme="blue"
          onClick={() => {
            resetSelection();
          }}
        >
          Next
        </Button>
      )}
    </Flex>
  );
};