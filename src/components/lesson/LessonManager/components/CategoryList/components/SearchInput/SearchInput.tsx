import React, { memo } from "react";
import { Flex, Input, Button, Icon } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

type TProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const SearchInput: React.FC<TProps> = memo(
  ({ searchTerm, setSearchTerm }) => {
    return (
      <Flex mb={4}>
        <Input
          placeholder="Поиск вопросов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mr={2}
        />
        <Button>
          <Icon as={FaSearch} />
        </Button>
        {searchTerm && (
          <Button ml={2} onClick={() => setSearchTerm("")}>
            Очистить
          </Button>
        )}
      </Flex>
    );
  },
);
