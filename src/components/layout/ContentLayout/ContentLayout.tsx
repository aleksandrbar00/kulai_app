import type { FC, PropsWithChildren } from "react";
import { Navbar } from "../Navbar"
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";


export const ContentLayout: FC<PropsWithChildren> = ({ children }) => {
    const maxWidth = useBreakpointValue({ base: "100%", lg: "1196px" });
    const paddingX = useBreakpointValue({ base: 4, md: 6, lg: 8 });

    return <Flex
        direction="column"
        minHeight="100vh"
        width="100%"
        mx="auto"
        px={paddingX}
        maxWidth={maxWidth}
    >
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <Box
            flex="1"
            width="100%"
            py={4}
        >
           {children}
        </Box>
    </Flex>
}