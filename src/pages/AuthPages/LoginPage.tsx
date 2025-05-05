import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Input, Button, Text, Link } from '@chakra-ui/react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router';
import { login, authState } from '../../components/auth/authStore';
import { Card } from '../../components/ui/Card';
import { colors } from '../../components/ui/styles';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (authState.value.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authState.value.isAuthenticated, from, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      if (!email.trim()) {
        throw new Error('Требуется указать электронную почту');
      }

      if (!password) {
        throw new Error('Требуется указать пароль');
      }

      // Submit login
      const result = await login(email, password);

      if (!result.success) {
        throw new Error(
          result.error instanceof Error ? result.error.message : 'Не удалось войти'
        );
      }

      // Redirect to the page they tried to visit
      navigate(from, { replace: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
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
              Вход
            </Heading>

            <form onSubmit={handleSubmit}>
              <VStack gap="4" alignItems="stretch">
                <Box>
                  <Text mb={2} color={colors.text.primary}>Электронная почта</Text>
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
                  <Text mb={2} color={colors.text.primary}>Пароль</Text>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ваш пароль"
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
                  {isSubmitting ? 'Выполняется вход...' : 'Войти'}
                </Button>
              </VStack>
            </form>

            {error && (
              <Text color={colors.status.error} textAlign="center">
                {error}
              </Text>
            )}

            <Text color={colors.text.secondary} textAlign="center">
              Еще нет аккаунта?{' '}
              <Link 
                as={RouterLink} 
                href="/register" 
                color={colors.brand.primary}
                _hover={{ textDecoration: 'underline' }}
              >
                Зарегистрироваться
              </Link>
            </Text>
          </VStack>
        </Box>
      </Card>
    </Box>
  );
}; 