import { Box, Grid, Heading, Text, Flex, Icon } from "@chakra-ui/react";
import { FaGamepad, FaHistory, FaQuestion } from "react-icons/fa";
import { Link } from "react-router";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { colors } from "../../ui/styles";

export const CategoryCardsNavigation = () => {
  return (
    <Box p={6}>
      <Heading mb={8} textAlign="center" color={colors.text.primary} size="xl">
        Панель управления
      </Heading>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
        maxW="1200px"
        mx="auto"
      >
        {/* Play Game Card */}
        <Card isHoverable>
          <Box p={5}>
            <Flex align="center" mb={4}>
              <Box
                borderRadius="full"
                bg={`${colors.brand.primary}30`}
                p={3}
                mr={3}
              >
                <Icon as={FaGamepad} w={6} h={6} color={colors.brand.primary} />
              </Box>
              <Heading size="md" color={colors.text.primary}>
                Начать игру
              </Heading>
            </Flex>

            <Text color={colors.text.secondary} mb={4}>
              Начните новую игру и проверьте свои навыки.
            </Text>

            <Box mt={2}>
              <Link to="/lesson" style={{ textDecoration: "none" }}>
                <Button
                  variant="primary"
                  w="full"
                  onClick={() => console.log("Navigate to play game")}
                >
                  Перейти к уроку
                </Button>
              </Link>
            </Box>
          </Box>
        </Card>

        {/* History Card */}
        <Card isHoverable>
          <Box p={5}>
            <Flex align="center" mb={4}>
              <Box
                borderRadius="full"
                bg={`${colors.status.info}30`}
                p={3}
                mr={3}
              >
                <Icon as={FaHistory} w={6} h={6} color={colors.status.info} />
              </Box>
              <Heading size="md" color={colors.text.primary}>
                История игр
              </Heading>
            </Flex>

            <Text color={colors.text.secondary} mb={4}>
              Просмотрите свои прошлые игры, статистику.
            </Text>

            <Box mt={2}>
              <Link to="/history" style={{ textDecoration: "none" }}>
                <Button
                  variant="primary"
                  w="full"
                  onClick={() => console.log("Navigate to game history")}
                >
                  Просмотреть историю
                </Button>
              </Link>
            </Box>
          </Box>
        </Card>

        {/* Question Bank Card */}
        <Card isHoverable>
          <Box p={5}>
            <Flex align="center" mb={4}>
              <Box
                borderRadius="full"
                bg={`${colors.status.success}30`}
                p={3}
                mr={3}
              >
                <Icon
                  as={FaQuestion}
                  w={6}
                  h={6}
                  color={colors.status.success}
                />
              </Box>
              <Heading size="md" color={colors.text.primary}>
                Банк вопросов
              </Heading>
            </Flex>

            <Text color={colors.text.secondary} mb={4}>
              Просмотрите все свои вопросы в базе знаний.
            </Text>

            <Box mt={2}>
              <Link to="/question-bank" style={{ textDecoration: "none" }}>
                <Button
                  variant="primary"
                  w="full"
                  onClick={() => console.log("Navigate to question bank")}
                >
                  Просмотреть вопросы
                </Button>
              </Link>
            </Box>
          </Box>
        </Card>
      </Grid>
    </Box>
  );
};
