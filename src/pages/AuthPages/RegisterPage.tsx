import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text, Link, VStack } from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router';
import { register, authState } from '../../components/auth/authStore';
import { Card } from '../../components/ui/Card';
import { colors } from '../../components/ui/styles';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.value.isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [authState.value.isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form
      if (!email.trim()) {
        throw new Error('Требуется указать электронную почту');
      }

      if (!password) {
        throw new Error('Требуется указать пароль');
      }

      if (password !== confirmPassword) {
        throw new Error('Пароли не совпадают');
      }

      if (password.length < 6) {
        throw new Error('Пароль должен содержать не менее 6 символов');
      }

      // Convert age to number if provided
      const ageNum = age ? parseInt(age, 10) : undefined;
      if (age && (isNaN(ageNum!) || ageNum! < 1 || ageNum! > 120)) {
        throw new Error('Возраст должен быть действительным числом от 1 до 120');
      }

      // Submit registration
      const result = await register({
        email,
        password,
        name: name || undefined,
        age: ageNum,
      });

      if (!result.success) {
        throw new Error(
          result.error instanceof Error ? result.error.message : 'Не удалось зарегистрироваться'
        );
      }

      // Redirect to home
      navigate('/', { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Не удалось зарегистрироваться');
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
      py={10}
    >
      <Card maxW="md" w="full" mx={4}>
        <Box p={8}>
          <VStack gap="6" alignItems="stretch">
            <Heading textAlign="center" size="xl" color={colors.text.primary}>
              Создать аккаунт
            </Heading>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack gap="4" alignItems="stretch">
                <Box>
                  <Text mb={2} color={colors.text.primary}>Электронная почта *</Text>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    bg={colors.background.card}
                    borderColor={colors.border.normal}
                    _hover={{ borderColor: colors.brand.primary }}
                    _focus={{ 
                      borderColor: colors.brand.primary,
                      boxShadow: `0 0 0 1px ${colors.brand.primary}`
                    }}
                  />
                </Box>

                <Box>
                  <Text mb={2} color={colors.text.primary}>Имя (опционально)</Text>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    bg={colors.background.card}
                    borderColor={colors.border.normal}
                    _hover={{ borderColor: colors.brand.primary }}
                    _focus={{ 
                      borderColor: colors.brand.primary,
                      boxShadow: `0 0 0 1px ${colors.brand.primary}`
                    }}
                  />
                </Box>

                <Box>
                  <Text mb={2} color={colors.text.primary}>Возраст (опционально)</Text>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Ваш возраст"
                    bg={colors.background.card}
                    borderColor={colors.border.normal}
                    _hover={{ borderColor: colors.brand.primary }}
                    _focus={{ 
                      borderColor: colors.brand.primary,
                      boxShadow: `0 0 0 1px ${colors.brand.primary}`
                    }}
                  />
                </Box>

                <Box>
                  <Text mb={2} color={colors.text.primary}>Пароль *</Text>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Создать пароль"
                    required
                    bg={colors.background.card}
                    borderColor={colors.border.normal}
                    _hover={{ borderColor: colors.brand.primary }}
                    _focus={{ 
                      borderColor: colors.brand.primary,
                      boxShadow: `0 0 0 1px ${colors.brand.primary}`
                    }}
                  />
                </Box>

                <Box>
                  <Text mb={2} color={colors.text.primary}>Подтвердите пароль *</Text>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Подтвердите пароль"
                    required
                    bg={colors.background.card}
                    borderColor={colors.border.normal}
                    _hover={{ borderColor: colors.brand.primary }}
                    _focus={{ 
                      borderColor: colors.brand.primary,
                      boxShadow: `0 0 0 1px ${colors.brand.primary}`
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  bg={colors.brand.primary}
                  color={colors.text.primary}
                  _hover={{ bg: colors.brand.hover }}
                  disabled={isSubmitting}
                  mt={4}
                  w="full"
                >
                  {isSubmitting ? 'Создание аккаунта...' : 'Зарегистрироваться'}
                </Button>
              </VStack>
            </form>

            {error && (
              <Text color={colors.status.error} textAlign="center">
                {error}
              </Text>
            )}

            <Text color={colors.text.secondary} textAlign="center">
              Уже есть аккаунт?{' '}
              <Link 
                as={RouterLink} 
                href="/login" 
                color={colors.brand.primary}
                _hover={{ textDecoration: 'underline' }}
              >
                Войти
              </Link>
            </Text>
          </VStack>
        </Box>
      </Card>
    </Box>
  );
}; 