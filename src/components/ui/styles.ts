import type { SystemStyleObject } from "@chakra-ui/react";

// Color palette for dark theme
export const colors = {
  brand: {
    primary: "#2196f3",
    secondary: "#1e88e5",
    hover: "#1976d2",
    active: "#1565c0",
    accent: "#90caf9",
  },
  background: {
    main: "#111827", // gray.900
    card: "#1f2937", // gray.800
    dark: "#0d1117", // gray.950
    light: "#374151", // gray.700
  },
  text: {
    primary: "#f3f4f6", // gray.100
    secondary: "#d1d5db", // gray.300
    muted: "#9ca3af", // gray.400
  },
  border: {
    normal: "#4b5563", // gray.600
    light: "#6b7280", // gray.500
  },
  status: {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  },
};

// Common component styles
export const buttonStyles: Record<string, SystemStyleObject> = {
  // Base button styles for all variants
  base: {
    fontWeight: "medium",
    borderRadius: "md",
    transition: "all 0.2s",
  },
  // Primary button
  primary: {
    bg: colors.brand.primary,
    color: colors.text.primary,
    _hover: {
      bg: colors.brand.hover,
      transform: "translateY(-1px)",
    },
    _active: {
      bg: colors.brand.active,
      transform: "translateY(0)",
    },
  },
  // Secondary button
  secondary: {
    bg: "transparent",
    border: "1px solid",
    borderColor: colors.brand.primary,
    color: colors.brand.primary,
    _hover: {
      bg: `${colors.brand.primary}20`,
      transform: "translateY(-1px)",
    },
    _active: {
      bg: `${colors.brand.primary}30`,
      transform: "translateY(0)",
    },
  },
  // Ghost button
  ghost: {
    bg: "transparent",
    color: colors.text.primary,
    _hover: {
      bg: `${colors.background.light}50`,
    },
    _active: {
      bg: `${colors.background.light}70`,
    },
  },
  // Danger button
  danger: {
    bg: colors.status.error,
    color: colors.text.primary,
    _hover: {
      bg: `${colors.status.error}d0`,
      transform: "translateY(-1px)",
    },
    _active: {
      bg: `${colors.status.error}e0`,
      transform: "translateY(0)",
    },
  },
};

export const cardStyles: SystemStyleObject = {
  bg: colors.background.card,
  borderRadius: "lg",
  boxShadow: "md",
  border: "1px solid",
  borderColor: colors.border.normal,
  overflow: "hidden",
  transition: "all 0.2s",
  _hover: {
    boxShadow: "lg",
    borderColor: colors.border.light,
  },
};

export const inputStyles: SystemStyleObject = {
  bg: colors.background.card,
  color: colors.text.primary,
  borderColor: colors.border.normal,
  borderRadius: "md",
  _hover: {
    borderColor: colors.brand.primary,
  },
  _focus: {
    borderColor: colors.brand.primary,
    boxShadow: `0 0 0 1px ${colors.brand.primary}`,
  },
  _placeholder: {
    color: colors.text.muted,
  },
};

export const headingStyles: SystemStyleObject = {
  color: colors.text.primary,
  fontWeight: "bold",
  letterSpacing: "tight",
};

export const badgeStyles: Record<string, SystemStyleObject> = {
  base: {
    borderRadius: "full",
    px: 2,
    py: 1,
    fontWeight: "medium",
    fontSize: "xs",
  },
  success: {
    bg: `${colors.status.success}30`,
    color: colors.status.success,
  },
  error: {
    bg: `${colors.status.error}30`,
    color: colors.status.error,
  },
  warning: {
    bg: `${colors.status.warning}30`,
    color: colors.status.warning,
  },
  info: {
    bg: `${colors.status.info}30`,
    color: colors.status.info,
  },
};
