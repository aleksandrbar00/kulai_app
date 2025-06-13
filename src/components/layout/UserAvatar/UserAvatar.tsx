import { Avatar, HStack, Stack, Text } from "@chakra-ui/react";
import type { FC } from "react";

type TProps = {
  name: string;
  pic?: string;
};

export const UserAvatar: FC<TProps> = ({ name, pic }) => {
  return (
    <Stack gap="8">
      <HStack gap="4">
        <Avatar.Root>
          <Avatar.Fallback name={name} />
          <Avatar.Image src={pic} />
        </Avatar.Root>
        <Stack gap="0">
          <Text fontWeight="medium">{name}</Text>
        </Stack>
      </HStack>
    </Stack>
  );
};
