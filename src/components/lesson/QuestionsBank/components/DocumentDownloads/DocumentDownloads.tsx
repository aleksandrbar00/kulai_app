import { Box, Heading, VStack, Link, Text } from "@chakra-ui/react";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { colors } from "../../../../ui/styles";

export const DocumentDownloads = () => {
  return (
    <Box mb={6}>
      <Heading size="md" mb={4}>
        Документы
      </Heading>
      <VStack align="stretch" gap={3}>
        <Link
          href="/documents/АГ 2024.pdf"
          download
          display="flex"
          alignItems="center"
          gap={2}
          p={3}
          borderRadius="md"
          bg={colors.background.card}
          _hover={{ bg: colors.background.light }}
          color={colors.text.primary}
        >
          <FaFilePdf color={colors.status.error} />
          <Text>АГ 2024 (PDF)</Text>
        </Link>

        <Link
          href="/documents/АГ КР 2024.docx"
          download
          display="flex"
          alignItems="center"
          gap={2}
          p={3}
          borderRadius="md"
          bg={colors.background.card}
          _hover={{ bg: colors.background.light }}
          color={colors.text.primary}
        >
          <FaFileWord color={colors.status.info} />
          <Text>АГ КР 2024 (DOCX)</Text>
        </Link>
      </VStack>
    </Box>
  );
};
