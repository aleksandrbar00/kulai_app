// components/WordInput.tsx
import { 
  Flex, 
  Input,
  Button,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";

interface WordInputProps {
  word?: string;
  onAttempt?: (isCorrect: boolean, userAnswer: string) => void;
  disabled?: boolean;
  attemptsLeft?: number;
}

export const WordInput = ({ 
  word = "", 
  onAttempt, 
  disabled = false,
  attemptsLeft = 3
}: WordInputProps) => {
  useSignals();
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [isWrongAttempt, setIsWrongAttempt] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setInputValues(Array(word.length).fill(""));
    setIsWrongAttempt(false);
  }, [word]);

  const handleInputChange = (value: string, index: number) => {
    if (disabled) return;
    
    const newValues = [...inputValues];
    newValues[index] = value.slice(-1);
    setInputValues(newValues);

    if (value && index < word.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValues.every(v => v)) {
      checkWord(newValues.join(""));
    }
  };

  const checkWord = (attempt: string) => {
    const isCorrect = attempt.toLowerCase() === word.toLowerCase();
    setIsWrongAttempt(!isCorrect);
    
    if (onAttempt) {
      onAttempt(isCorrect, attempt);
    }

    if (!isCorrect) {
      
      // Shake animation
      inputRefs.current.forEach(ref => {
        ref?.animate([
          { transform: 'translateX(0)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(0)' }
        ], {
          duration: 300,
          iterations: 2
        });
      });
    }
  };

  const handleClear = () => {
    if (disabled) return;
    setInputValues(Array(word.length).fill(""));
    setIsWrongAttempt(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <Flex direction="column" align="center" gap={6} width="100%">
      <Flex gap={2} justify="center" wrap="wrap">
        {inputValues.map((value, index) => (
          <Input
            key={`input-${index}`}
            ref={(el) => {inputRefs.current[index] = el}}
            value={value}
            onChange={(e) => handleInputChange(e.target.value, index)}
            maxLength={1}
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            width="60px"
            height="60px"
            borderRadius="md"
            borderWidth="2px"
            borderColor={isWrongAttempt ? "red.500" : value ? "blue.500" : "gray.200"}
            bg={isWrongAttempt ? "red.50" : undefined}
            _focus={{
              borderColor: isWrongAttempt ? "red.500" : "teal.500",
              boxShadow: "outline"
            }}
            disabled={disabled}
          />
        ))}
      </Flex>

      <Flex gap={4} mt={4}>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={handleClear}
          disabled={disabled}
        >
          Clear All
        </Button>
        <Button
          colorScheme="green"
          onClick={() => checkWord(inputValues.join(""))}
          disabled={!inputValues.every(v => v) || disabled}
        >
          Check Answer
        </Button>
      </Flex>
    </Flex>
  );
};