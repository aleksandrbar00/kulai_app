import { Flex, Image } from "@chakra-ui/react"
import { UserAvatar } from "../UserAvatar"
import { Link } from "react-router"
import LogoIcon from "../../../logo.svg"

export const Navbar = () => {
    return <Flex 
        py={4} 
        px={4}
        alignItems="center" 
        justifyContent="space-between"
    >
        <Link to="/">
            <Flex alignItems="center" gap={2}>
                <Image 
                    src={LogoIcon} 
                    alt="Kulai Logo" 
                    height="40px"
                    width="auto"
                />
            </Flex>
        </Link>
        <UserAvatar name="Test User" />
    </Flex>
}