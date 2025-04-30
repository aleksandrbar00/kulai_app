import { Box, Flex } from "@chakra-ui/react"
import { UserAvatar } from "../UserAvatar"
import { Link } from "react-router"

export const Navbar = () => {
    return <Flex py={4} alignItems="center" justifyContent="space-between">
        <Link to="/">
            <Box>
                Project Kulaia
            </Box>
        </Link>
        <UserAvatar name="Test User" />
    </Flex>
}