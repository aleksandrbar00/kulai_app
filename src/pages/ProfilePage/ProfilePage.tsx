import React from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { colors } from '../../components/ui/styles';
import { authState, logout } from '../../components/auth/authStore';
import { FaUser, FaEnvelope, FaBirthdayCake } from 'react-icons/fa';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = authState.value.user;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Box 
      p={6} 
      maxW="container.md" 
      mx="auto"
    >
      <Heading 
        mb={6} 
        size="xl" 
        textAlign="center"
        color={colors.text.primary}
      >
        Ваш профиль
      </Heading>

      <Card maxW="md" w="full" mx="auto">
        <Box p={6}>
          <VStack gap="4" alignItems="stretch">
            <Box display="flex" alignItems="center" gap={3}>
              <Box 
                bg={colors.brand.primary}
                color={colors.text.primary}
                borderRadius="full"
                width="64px"
                height="64px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xl"
                fontWeight="bold"
              >
                {user.name 
                  ? user.name.charAt(0).toUpperCase() 
                  : user.email.charAt(0).toUpperCase()}
              </Box>
              <Box>
                <Text color={colors.text.muted} fontSize="sm">
                  Профиль пользователя
                </Text>
                <Text color={colors.text.primary} fontSize="xl" fontWeight="bold">
                  {user.name || user.email}
                </Text>
              </Box>
            </Box>

            <Box 
              height="1px" 
              bg={colors.border.normal} 
              w="full" 
            />

            <Box display="flex" alignItems="center" gap={3}>
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                color={colors.brand.primary}
              >
                <FaEnvelope size={18} />
              </Box>
              <Box>
                <Text 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color={colors.text.muted}
                >
                  Электронная почта
                </Text>
                <Text color={colors.text.primary} fontSize="md">
                  {user.email}
                </Text>
              </Box>
            </Box>

            <Box 
              height="1px" 
              bg={colors.border.normal} 
              w="full" 
            />

            <Box display="flex" alignItems="center" gap={3}>
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                color={colors.brand.primary}
              >
                <FaUser size={18} />
              </Box>
              <Box>
                <Text 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color={colors.text.muted}
                >
                  Имя
                </Text>
                <Text color={colors.text.primary} fontSize="md">
                  {user.name || '(Не указано)'}
                </Text>
              </Box>
            </Box>

            <Box 
              height="1px" 
              bg={colors.border.normal} 
              w="full" 
            />

            <Box display="flex" alignItems="center" gap={3}>
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                color={colors.brand.primary}
              >
                <FaBirthdayCake size={18} />
              </Box>
              <Box>
                <Text 
                  fontSize="sm" 
                  fontWeight="medium" 
                  color={colors.text.muted}
                >
                  Возраст
                </Text>
                <Text color={colors.text.primary} fontSize="md">
                  {user.age || '(Не указан)'}
                </Text>
              </Box>
            </Box>

            <Box pt={4}>
              <Button
                onClick={handleLogout}
                variant="danger"
                w="full"
              >
                Выйти
              </Button>
            </Box>
          </VStack>
        </Box>
      </Card>
    </Box>
  );
}; 