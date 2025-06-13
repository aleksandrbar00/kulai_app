import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { colors, cardStyles } from "./styles";

interface CardProps extends BoxProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  isHoverable?: boolean;
  isSelected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  isHoverable = false,
  isSelected = false,
  ...props
}) => {
  return (
    <Box
      {...cardStyles}
      borderColor={isSelected ? colors.brand.primary : cardStyles.borderColor}
      boxShadow={
        isSelected ? `0 0 0 2px ${colors.brand.primary}` : cardStyles.boxShadow
      }
      cursor={isHoverable ? "pointer" : "default"}
      _hover={{
        ...(isHoverable
          ? {
              transform: "translateY(-2px)",
              boxShadow: "lg",
              borderColor: isSelected
                ? colors.brand.primary
                : colors.border.light,
            }
          : {}),
      }}
      transition="all 0.2s ease"
      {...props}
    >
      {(title || subtitle) && (
        <Box px={5} pt={4} pb={title && subtitle ? 2 : 4}>
          {title && (
            <Heading
              size="md"
              color={colors.text.primary}
              fontWeight="bold"
              mb={subtitle ? 1 : 0}
            >
              {title}
            </Heading>
          )}
          {subtitle && (
            <Text color={colors.text.muted} fontSize="sm">
              {subtitle}
            </Text>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
};
