import { Box, Flex, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSignals } from "@preact/signals-react/runtime";

type TProps = {
  correctWord: string;
  wordOptions: { id: string; text: string }[];
  onAttempt: (id: number) => void;
  disabled?: boolean;
};

export const WordGrid = ({
  correctWord,
  wordOptions,
  onAttempt,
  disabled = false,
}: TProps) => {
  useSignals();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Reset selectedWord when the correctWord changes (new question)
  useEffect(() => {
    setSelectedWord(null);
  }, [correctWord, wordOptions]);

  const handleWordSelect = (id: number, word: string) => {
    if (disabled || selectedWord !== null) return;

    setSelectedWord(word);
    onAttempt(id);
  };

  return (
    <Flex direction="column" align="center" gap={6}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Выберите правильный вариант:
      </Text>

      <Flex wrap="wrap" justify="center" gap={4} maxW="600px">
        {wordOptions.map((word, index) => (
          <Box
            key={index}
            p={6}
            bg={
              selectedWord === word.text
                ? word.text.toLowerCase() === correctWord.toLowerCase()
                  ? "green.100"
                  : "red.100"
                : "gray.100"
            }
            color={
              selectedWord === word.text
                ? word.text.toLowerCase() === correctWord.toLowerCase()
                  ? "green.800"
                  : "red.800"
                : "gray.800"
            }
            borderWidth="2px"
            borderColor={
              selectedWord === word.text
                ? word.text.toLowerCase() === correctWord.toLowerCase()
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
              borderColor:
                !disabled && selectedWord === null ? "blue.300" : undefined,
            }}
            onClick={() =>
              !disabled &&
              selectedWord === null &&
              handleWordSelect(+word.id, word.text)
            }
          >
            {word.text}
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};
