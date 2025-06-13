import React, { useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { authState, logout, getCurrentUser } from "./authStore";
import { colors } from "../ui/styles";

export const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = authState.value.isAuthenticated;
  const user = getCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <Box display="flex" gap={2}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogin}
          color={colors.text.primary}
          _hover={{ bg: colors.background.light }}
        >
          Войти
        </Button>
        <Button
          size="sm"
          bg={colors.brand.primary}
          color={colors.text.primary}
          _hover={{ bg: colors.brand.hover }}
          onClick={handleRegister}
        >
          Регистрация
        </Button>
      </Box>
    );
  }

  // Generate initials for avatar
  const getInitials = () => {
    if (!user?.name) return user?.email.charAt(0).toUpperCase();

    return user.name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <Box position="relative">
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        cursor="pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Box
          bg={colors.brand.primary}
          color={colors.text.primary}
          borderRadius="full"
          width="32px"
          height="32px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          fontWeight="bold"
        >
          {getInitials()}
        </Box>
        <Text
          color={colors.text.primary}
          display={{ base: "none", md: "block" }}
        >
          {user?.name || user?.email}
        </Text>
      </Box>

      {menuOpen && (
        <Box
          position="absolute"
          top="100%"
          right="0"
          mt={2}
          display="flex"
          flexDirection="column"
          bg={colors.background.card}
          borderRadius="md"
          boxShadow="lg"
          zIndex={10}
          borderColor={colors.border.normal}
          borderWidth="1px"
          width="200px"
          overflow="hidden"
        >
          <Box
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colors.border.normal}
          >
            <Text fontSize="xs" color={colors.text.muted}>
              Вход выполнен как
            </Text>
            <Text fontWeight="medium" color={colors.text.primary}>
              {user?.email}
            </Text>
          </Box>

          <Box
            p={2}
            _hover={{ bg: colors.background.light }}
            cursor="pointer"
            onClick={handleProfileClick}
          >
            <Text color={colors.text.primary}>Профиль</Text>
          </Box>

          <Box
            p={2}
            _hover={{ bg: colors.background.light }}
            cursor="pointer"
            onClick={handleLogout}
            borderTop="1px solid"
            borderColor={colors.border.normal}
          >
            <Text color={colors.text.primary}>Выйти</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};
