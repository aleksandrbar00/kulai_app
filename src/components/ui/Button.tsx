import React from "react";
import { Button as ChakraButton } from "@chakra-ui/react";
import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { buttonStyles } from "./styles";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends Omit<ChakraButtonProps, "variant"> {
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  // Apply the variant-specific styles directly as props
  const variantStyle = buttonStyles[variant];

  return (
    <ChakraButton
      fontWeight={buttonStyles.base.fontWeight}
      borderRadius={buttonStyles.base.borderRadius}
      transition={buttonStyles.base.transition}
      bg={variantStyle.bg}
      color={variantStyle.color}
      border={variantStyle.border}
      borderColor={variantStyle.borderColor}
      _hover={variantStyle._hover}
      _active={variantStyle._active}
      {...props}
    >
      {children}
    </ChakraButton>
  );
};
