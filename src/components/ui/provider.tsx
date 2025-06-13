"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  // Create a theme configuration with dark mode as default
  const darkThemeConfig = {
    ...defaultSystem,
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
    colors: {
      brand: {
        500: "#2196f3", // Primary blue color
        600: "#1e88e5",
      },
    },
    styles: {
      global: {
        body: {
          bg: "gray.900",
          color: "gray.300",
        },
      },
    },
  };

  return (
    <ChakraProvider value={darkThemeConfig}>
      <ColorModeProvider defaultTheme="dark" forcedTheme="dark" {...props} />
    </ChakraProvider>
  );
}
