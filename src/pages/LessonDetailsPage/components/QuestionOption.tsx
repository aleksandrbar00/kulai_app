import { Box, Flex, GridItem, Text } from "@chakra-ui/react";
import { colors } from "../../../components/ui/styles";

type TProps = {
  text: string;
  isCorrectAnswer: boolean;
};

export const QuestionOption = ({ text, isCorrectAnswer }: TProps) => {
  let bgColor = colors.background.card;
  let borderColor = colors.border.normal;

  if (isCorrectAnswer) {
    bgColor = `${colors.status.success}10`;
    borderColor = `${colors.status.success}50`;
  } else {
    bgColor = colors.background.card;
  }

  return (
    <GridItem>
      <Box
        p={3}
        borderRadius="md"
        bg={bgColor}
        borderColor={borderColor}
        position="relative"
        _hover={{ opacity: 0.9 }}
        transition="all 0.2s"
      >
        <Flex justify="space-between" align="center">
          <Text fontWeight={isCorrectAnswer ? "bold" : "normal"}>{text}</Text>
        </Flex>
      </Box>
    </GridItem>
  );
};
