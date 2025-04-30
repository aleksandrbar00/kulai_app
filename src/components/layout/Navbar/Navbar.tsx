import { Box, Flex } from "@chakra-ui/react"
import { UserAvatar } from "../UserAvatar"

export const Navbar = () => {
    return <Flex py={4} alignItems="center" justifyContent="space-between">
        <Box>
            Project Kulaia
        </Box>
        <UserAvatar name="Test User" />
    </Flex>
}