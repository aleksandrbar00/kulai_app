import React, { useState } from "react";
import { Box, VStack, Heading, Input, Button, Text } from "@chakra-ui/react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router";
import { login } from "../../components/auth/authStore";
import { Card } from "../../components/ui/Card";
import { colors } from "../../components/ui/styles";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!username.trim()) {
        throw new Error("Введите email");
      }

      if (!password) {
        throw new Error("Введите пароль");
      }

      const result = await login(username, password);

      if (!result.success) {
        throw new Error(result.error);
      }

      navigate(from, { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={colors.background.main}
    >
      <Card maxW="400px" w="100%" p={8}>
        <VStack gap={6}>
          <Heading size="lg" color={colors.text.primary}>
            Вход в аккаунт
          </Heading>

          {error && (
            <Text color="red.500" textAlign="center">
              {error}
            </Text>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack gap={4}>
              <Input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                bg={colors.background.light}
                color={colors.text.primary}
                _placeholder={{ color: colors.text.secondary }}
              />

              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                bg={colors.background.light}
                color={colors.text.primary}
                _placeholder={{ color: colors.text.secondary }}
              />

              <Button
                type="submit"
                loading={isSubmitting}
                w="100%"
                bg={colors.brand.primary}
                color={colors.text.primary}
                _hover={{ bg: colors.brand.hover }}
              >
                Вход
              </Button>
            </VStack>
          </form>

          <Text color={colors.text.secondary}>
            Нет аккаунта? <RouterLink to="/register">Регистрация</RouterLink>
          </Text>
        </VStack>
      </Card>
    </Box>
  );
};
