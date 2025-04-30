import { 
  Box, 
  Flex, 
  Input,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

interface LetterBox {
  letter: string;
  originalIndex: number;
}

interface WordInputProps {
  word?: string;
  onWordSelected?: (selectedWord: string) => void;
}

export const WordInput = ({ word = "", onWordSelected }: WordInputProps) => {
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [letterBoxes, setLetterBoxes] = useState<LetterBox[]>([]);
  const [usedLetterCounts, setUsedLetterCounts] = useState<{[key: string]: number}>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Count how many times each letter appears in the word
  const letterCounts = [...word.toLowerCase()].reduce((acc, letter) => {
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});

  // Initialize component
  useEffect(() => {
    setInputValues(Array(word.length).fill(""));
    setLetterBoxes(
      [...word].map((letter, index) => ({
        letter,
        originalIndex: index
      }))
    );
    setUsedLetterCounts({});
  }, [word]);

  // Handle input change
  const handleInputChange = (value: string, index: number) => {
    const lowerValue = value.toLowerCase();
    
    // Block letters not in the word
    if (value && !letterCounts[lowerValue]) {
      return;
    }

    // Check if we've already used all instances of this letter
    if (value && (usedLetterCounts[lowerValue] || 0) >= letterCounts[lowerValue]) {
      return;
    }

    const newValues = [...inputValues];
    const newUsedCounts = {...usedLetterCounts};
    const prevValue = inputValues[index];

    // If replacing existing value, decrement its count
    if (prevValue) {
      const lowerPrev = prevValue.toLowerCase();
      newUsedCounts[lowerPrev] = (newUsedCounts[lowerPrev] || 1) - 1;
    }

    // Set new value
    newValues[index] = value.slice(-1); // Only allow single character
    setInputValues(newValues);

    // If new value entered, increment its count
    if (value) {
      newUsedCounts[lowerValue] = (newUsedCounts[lowerValue] || 0) + 1;
    }

    setUsedLetterCounts(newUsedCounts);

    // Auto-focus next input if a character was entered
    if (value && index < word.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (newValues.every(v => v)) {
      checkWord(newValues.join(""));
    }
  };

  // Handle letter click
  const handleLetterClick = (letter: string) => {
    const lowerLetter = letter.toLowerCase();
    
    // Check if we've already used all instances of this letter
    if ((usedLetterCounts[lowerLetter] || 0) >= letterCounts[lowerLetter]) {
      return;
    }

    // Find first empty input
    const emptyIndex = inputValues.findIndex(val => !val);
    if (emptyIndex === -1) return;

    // Update input value
    const newValues = [...inputValues];
    newValues[emptyIndex] = letter;
    setInputValues(newValues);

    // Update used letters count
    setUsedLetterCounts({
      ...usedLetterCounts,
      [lowerLetter]: (usedLetterCounts[lowerLetter] || 0) + 1
    });

    // Focus the input that was just filled
    inputRefs.current[emptyIndex]?.focus();

    // Check if complete
    if (newValues.every(v => v)) {
      checkWord(newValues.join(""));
    }
  };

  // Handle backspace
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      const newValues = [...inputValues];
      const newUsedCounts = {...usedLetterCounts};
      const currentValue = inputValues[index];

      if (currentValue) {
        // If current input has value, clear it and decrement count
        newValues[index] = "";
        const lowerCurrent = currentValue.toLowerCase();
        newUsedCounts[lowerCurrent] = (newUsedCounts[lowerCurrent] || 1) - 1;
        setInputValues(newValues);
        setUsedLetterCounts(newUsedCounts);
        // Keep focus on current input
      } else if (index > 0) {
        // If current input is empty, move to previous and clear it
        const prevValue = inputValues[index - 1];
        newValues[index - 1] = "";
        const lowerPrev = prevValue.toLowerCase();
        newUsedCounts[lowerPrev] = (newUsedCounts[lowerPrev] || 1) - 1;
        setInputValues(newValues);
        setUsedLetterCounts(newUsedCounts);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Validate the word
  const checkWord = (attempt: string) => {
    if (attempt.toLowerCase() === word.toLowerCase()) {
      onWordSelected?.(attempt);
    }
  };

  // Clear all inputs
  const handleClear = () => {
    setInputValues(Array(word.length).fill(""));
    setUsedLetterCounts({});
    inputRefs.current[0]?.focus();
  };

  // Check if a letter can still be used
  const canUseLetter = (letter: string) => {
    const lowerLetter = letter.toLowerCase();
    return (usedLetterCounts[lowerLetter] || 0) < letterCounts[lowerLetter];
  };

  return (
    <Flex direction="column" align="center" gap={6} width="100%">
      {/* INPUT BOXES */}
      <Text fontSize="lg" fontWeight="bold">
        Spell the word: {word.length} letters
      </Text>
      <Flex gap={2} justify="center" wrap="wrap">
        {inputValues.map((value, index) => (
          <Input
            key={`input-${index}`}
            ref={(el) => (inputRefs.current[index] = el)}
            value={value}
            onChange={(e) => handleInputChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            width="60px"
            height="60px"
            borderRadius="md"
            borderWidth="2px"
            borderColor={value ? "blue.500" : "gray.200"}
            _focus={{
              borderColor: "teal.500",
              boxShadow: "outline"
            }}
          />
        ))}
      </Flex>

      {/* CLICKABLE LETTERS */}
      <Text fontSize="lg" fontWeight="bold" mt={4}>
        Available Letters:
      </Text>
      <Flex wrap="wrap" justify="center" gap={2} maxW="100%">
        {letterBoxes.map((letterBox) => {
          const canUse = canUseLetter(letterBox.letter);
          return (
            <Box
                p={4}
                bg={canUse ? "blue.100" : "gray.200"}
                color={canUse ? "blue.800" : "gray.500"}
                borderRadius="md"
                fontSize="xl"
                fontWeight="bold"
                cursor={canUse ? "pointer" : "not-allowed"}
                borderWidth="2px"
                borderColor={canUse ? "blue.300" : "gray.300"}
                opacity={canUse ? 1 : 0.7}
                _hover={canUse ? {
                  bg: "blue.200",
                  borderColor: "blue.400"
                } : {}}
                onClick={() => canUse && handleLetterClick(letterBox.letter)}
              >
                {letterBox.letter}
            </Box>
          );
        })}
      </Flex>

      {/* CONTROLS */}
      <Flex gap={4} mt={4}>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={handleClear}
        >
          Clear All
        </Button>
        <Button
          colorScheme="green"
          onClick={() => checkWord(inputValues.join(""))}
          disabled={!inputValues.every(v => v)}
        >
          Check Answer
        </Button>
      </Flex>
    </Flex>
  );
};