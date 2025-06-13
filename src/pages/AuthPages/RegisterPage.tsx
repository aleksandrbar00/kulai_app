import React, { useState } from "react";
import { Box, Heading, Input, Button, Text, VStack } from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router";
import { register } from "../../components/auth/authStore";
import { Card } from "../../components/ui/Card";
import { colors } from "../../components/ui/styles";

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!email.trim()) {
        throw new Error("Введите email");
      }

      if (!password) {
        throw new Error("Введите пароль");
      }

      if (!name) {
        throw new Error("Введите имя");
      }

      if (!age) {
        throw new Error("Введите возраст");
      }

      if (password !== confirmPassword) {
        throw new Error("Пароль не совпадает");
      }

      if (password.length < 6) {
        throw new Error("Пароль меньше 6 символов");
      }

      const result = await register({
        email,
        password,
        name: name.trim() || undefined,
        age: age ? parseInt(age, 10) : undefined,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      navigate("/", { replace: true });
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
            Регистрация
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                bg={colors.background.light}
                color={colors.text.primary}
                _placeholder={{ color: colors.text.secondary }}
              />

              <Input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                bg={colors.background.light}
                color={colors.text.primary}
                _placeholder={{ color: colors.text.secondary }}
              />

              <Input
                type="number"
                placeholder="Возраст"
                value={age}
                onChange={(e) => setAge(e.target.value)}
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

              <Input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Создать
              </Button>
            </VStack>
          </form>

          <Text color={colors.text.secondary}>
            Уже есть аккаунт? <RouterLink to="/login">Вход</RouterLink>
          </Text>
        </VStack>
      </Card>
    </Box>
  );
};
