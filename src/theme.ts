import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

// Configure theme to always use dark mode
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Define colors for dark theme
const colors = {
  brand: {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3", // Primary brand color
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#0d1117",
  },
};

// Button styles
const buttonBaseStyle = defineStyle({
  fontWeight: "medium",
  borderRadius: "md",
});

const buttonSolidVariant = defineStyle({
  bg: "brand.500",
  color: "white",
  _hover: {
    bg: "brand.600",
  },
});

const buttonOutlineVariant = defineStyle({
  borderColor: "brand.500",
  color: "brand.500",
});

const buttonGhostVariant = defineStyle({
  color: "brand.500",
  _hover: {
    bg: "rgba(33, 150, 243, 0.1)",
  },
});

const buttonSubtleVariant = defineStyle({
  bg: "rgba(33, 150, 243, 0.1)",
  color: "brand.500",
  _hover: {
    bg: "rgba(33, 150, 243, 0.2)",
  },
});

export const buttonTheme = defineStyleConfig({
  baseStyle: buttonBaseStyle,
  variants: {
    solid: buttonSolidVariant,
    outline: buttonOutlineVariant,
    ghost: buttonGhostVariant,
    subtle: buttonSubtleVariant,
  },
});

// Input styles
const inputBaseStyle = defineStyle({
  field: {
    borderRadius: "md",
  },
});

const inputOutlineVariant = defineStyle({
  field: {
    bg: "gray.800",
    borderColor: "gray.600",
    _hover: {
      borderColor: "brand.500",
    },
    _focus: {
      borderColor: "brand.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
    },
  },
});

export const inputTheme = defineStyleConfig({
  baseStyle: inputBaseStyle,
  variants: {
    outline: inputOutlineVariant,
  },
});

// Heading styles
const headingBaseStyle = defineStyle({
  fontWeight: "bold",
  color: "white",
});

export const headingTheme = defineStyleConfig({
  baseStyle: headingBaseStyle,
});

// Text styles
const textBaseStyle = defineStyle({
  color: "gray.300",
});

export const textTheme = defineStyleConfig({
  baseStyle: textBaseStyle,
});

// Badge styles
const badgeBaseStyle = defineStyle({
  borderRadius: "full",
  px: 2,
  py: 1,
  fontWeight: "medium",
});

const badgeSolidVariant = defineStyle({
  bg: "brand.500",
  color: "white",
});

export const badgeTheme = defineStyleConfig({
  baseStyle: badgeBaseStyle,
  variants: {
    solid: badgeSolidVariant,
  },
});

// Card styles
const cardBaseStyle = defineStyle({
  container: {
    bg: "gray.800",
    borderRadius: "lg",
    boxShadow: "md",
  },
});

export const cardTheme = defineStyleConfig({
  baseStyle: cardBaseStyle,
});

const theme = {
  config,
  colors,
  components: {
    Button: buttonTheme,
    Input: inputTheme,
    Heading: headingTheme,
    Text: textTheme,
    Badge: badgeTheme,
    Card: cardTheme,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "gray.300",
      },
    },
  },
  semanticTokens: {
    colors: {
      "chakra-body-bg": { _dark: "gray.900" },
      "chakra-body-text": { _dark: "gray.300" },
      "chakra-border-color": { _dark: "gray.700" },
      "chakra-placeholder-color": { _dark: "gray.500" },
    },
  },
};

export default theme;
