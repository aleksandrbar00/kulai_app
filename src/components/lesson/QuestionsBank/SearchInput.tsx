import React, { memo } from "react";
import { Flex, Input, Button, Icon } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { questionsActions } from "./questionsStore";

type TProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const SearchInput = memo(({ searchTerm, setSearchTerm }: TProps) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    questionsActions.searchQuestions(searchTerm);
  };

  return (
    <form onSubmit={handleSearch}>
      <Flex mb={4}>
        <Input
          placeholder="Поиск вопросов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mr={2}
        />
        <Button type="submit" mr={2}>
          <Icon as={FaSearch} />
        </Button>
        {searchTerm && (
          <Button
            onClick={() => {
              setSearchTerm("");
              questionsActions.searchQuestions("");
            }}
          >
            Очистить
          </Button>
        )}
      </Flex>
    </form>
  );
});
