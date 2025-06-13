import { Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router";
import LogoIcon from "../../../logo-full.svg";
import { UserMenu } from "../../auth/UserMenu";

export const Navbar = () => {
  return (
    <Flex py={4} px={4} alignItems="center" justifyContent="space-between">
      <Link to="/">
        <Flex alignItems="center" gap={2}>
          <Image src={LogoIcon} alt="Kulai Logo" height="60px" width="auto" />
        </Flex>
      </Link>
      <UserMenu />
    </Flex>
  );
};
