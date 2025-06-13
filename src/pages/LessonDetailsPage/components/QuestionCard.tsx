import { Box, Flex, Grid, Text, Icon } from "@chakra-ui/react";
import { QuestionOption } from "./QuestionOption";
import { useNavigate } from "react-router";
import { FaBook } from "react-icons/fa";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { colors } from "../../../components/ui/styles";
import type { TQuestion } from "../types";

type TProps = {
  question: TQuestion;
  index: number;
};

export const QuestionCard = ({ question, index }: TProps) => {
  const navigate = useNavigate();
  const displayText = question.questionText || question.text || "";

  const isInputQuestion = question.type === "input";
  const isMultiChoiceQuestion = !isInputQuestion;

  const navigateToQuestionBank = () => {
    const questionText = encodeURIComponent(displayText);
    navigate(`/question-bank?search=${questionText}`);
  };

  return (
    <Card mb={4}>
      <Box p={4}>
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontWeight="bold" color={colors.text.primary}>
            Вопрос {index + 1}{" "}
            {isMultiChoiceQuestion
              ? "(С вариантами ответа)"
              : "(Письменный ответ)"}
          </Text>
          <Flex align="center">
            <Button size="sm" variant="ghost" onClick={navigateToQuestionBank}>
              <Flex align="center">
                <Icon as={FaBook} mr={2} />
                Смотреть в банке вопросов
              </Flex>
            </Button>
          </Flex>
        </Flex>

        <Text mb={4} color={colors.text.secondary}>
          {displayText}
        </Text>

        {isInputQuestion && (
          <Box
            mb={4}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            bg={`${colors.status.success}10`}
            borderColor={`${colors.status.success}30`}
          >
            <Flex justify="space-between">
              <Text color={colors.text.primary}>
                <Text as="span" fontWeight="bold" color={colors.text.primary}>
                  Ответ:{" "}
                </Text>
                {question.answer}
              </Text>
            </Flex>
          </Box>
        )}

        {isMultiChoiceQuestion && (
          <>
            <Box
              borderTopWidth="1px"
              borderColor={colors.border.normal}
              pt={3}
              mb={3}
            />

            {question.options && question.options.length > 0 ? (
              <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                {question.options.map((option) => {
                  if (!option || !option.id) return null;

                  const isCorrectAnswer =
                    option.id === question.correctOptionId ||
                    option.id === question.answer;

                  return (
                    <QuestionOption
                      key={option.id}
                      text={option.text}
                      isCorrectAnswer={isCorrectAnswer}
                    />
                  );
                })}
              </Grid>
            ) : (
              <Box
                p={3}
                borderWidth="1px"
                borderRadius="md"
                borderColor={colors.border.normal}
                bg={colors.background.main}
              >
                <Text fontStyle="italic" color={colors.text.muted}>
                  Нет ответов
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Card>
  );
};
