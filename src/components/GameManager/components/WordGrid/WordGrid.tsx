// components/WordGrid.tsx
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useSignals } from "@preact/signals-react/runtime";

interface WordGridProps {
  correctWord: string;
  wordOptions: string[];
  onAttempt: (isCorrect: boolean) => void;
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

  const handleWordSelect = (word: string) => {
    if (disabled || selectedWord !== null) return;
    
    setSelectedWord(word);
    const isCorrect = word.toLowerCase() === correctWord.toLowerCase();
    onAttempt(isCorrect);
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
            setSelectedWord(null);
            if (disabled) onAttempt(false);
          }}
          disabled={disabled}
        >
          {disabled ? "Continue" : "Try Again"}
        </Button>
      )}
    </Flex>
  );
};