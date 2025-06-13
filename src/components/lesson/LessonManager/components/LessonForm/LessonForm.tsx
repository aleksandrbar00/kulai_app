import React, { useState, useCallback, memo } from "react";
import type { InputProps } from "@chakra-ui/react";
import { Box, Text, Input } from "@chakra-ui/react";
import { Button } from "../../../../ui/Button";
import { Card } from "../../../../ui/Card";
import { colors } from "../../../../ui/styles";
import type { TLessonFormData } from "../../types";

type TProps = {
  lesson: TLessonFormData;
  setLesson: React.Dispatch<React.SetStateAction<TLessonFormData>>;
};

interface BaseFormInputProps extends Omit<InputProps, "onChange"> {
  label: string;
  placeholder?: string;
}

interface StringFormInputProps extends BaseFormInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface NumberFormInputProps extends BaseFormInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
}

const StringFormInput = memo(function StringFormInput({
  label,
  value,
  onChange,
  placeholder,
  ...props
}: StringFormInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <Box mb={4}>
      <Text mb={2} color={colors.text.primary} fontWeight="medium">
        {label}
      </Text>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        bg={colors.background.card}
        borderColor={colors.border.normal}
        _hover={{ borderColor: colors.brand.primary }}
        _focus={{
          borderColor: colors.brand.primary,
          boxShadow: `0 0 0 1px ${colors.brand.primary}`,
        }}
        {...props}
      />
    </Box>
  );
});

const NumberFormInput = memo(function NumberFormInput({
  label,
  value,
  onChange,
  placeholder,
  min,
  ...props
}: NumberFormInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = parseInt(e.target.value) || 0;
      onChange(numValue);
    },
    [onChange],
  );

  return (
    <Box mb={4}>
      <Text mb={2} color={colors.text.primary} fontWeight="medium">
        {label}
      </Text>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        min={min}
        bg={colors.background.card}
        borderColor={colors.border.normal}
        _hover={{ borderColor: colors.brand.primary }}
        _focus={{
          borderColor: colors.brand.primary,
          boxShadow: `0 0 0 1px ${colors.brand.primary}`,
        }}
        {...props}
      />
    </Box>
  );
});

const TIME_OPTIONS = [
  { value: 30, label: "30 секунд" },
  { value: 60, label: "1 минута" },
  { value: 120, label: "2 минуты" },
  { value: 300, label: "5 минут" },
  { value: 600, label: "10 минут" },
];

export const LessonForm: React.FC<TProps> = memo(({ lesson, setLesson }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handlePresetTime = useCallback(
    (seconds: number) => {
      setLesson((prev) => ({ ...prev, totalDuration: seconds }));
      setShowCustomInput(false);
    },
    [setLesson],
  );

  const handleTitleChange = useCallback(
    (value: string) => {
      setLesson((prev) => ({ ...prev, title: value }));
    },
    [setLesson],
  );

  const handleCustomTimeChange = useCallback(
    (value: number) => {
      setLesson((prev) => ({ ...prev, totalDuration: value }));
    },
    [setLesson],
  );

  const handleToggleCustomInput = useCallback(() => {
    setShowCustomInput((prev) => !prev);
  }, []);

  return (
    <Card mb={6}>
      <Box p={5}>
        <StringFormInput
          label="Название урока"
          value={lesson.title}
          onChange={handleTitleChange}
          placeholder="Введите название урока"
        />

        <Box>
          <Text mb={2} color={colors.text.primary} fontWeight="medium">
            Продолжительность
          </Text>
          <Box mb={3}>
            {/* Preset time options */}
            <Box display="flex" flexWrap="wrap" gap={2}>
              {TIME_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={
                    lesson.totalDuration === option.value && !showCustomInput
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => handlePresetTime(option.value)}
                  mb={2}
                >
                  {option.label}
                </Button>
              ))}
              <Button
                size="sm"
                variant={showCustomInput ? "primary" : "secondary"}
                onClick={handleToggleCustomInput}
                mb={2}
              >
                Свое время
              </Button>
            </Box>

            {/* Custom time input */}
            {showCustomInput && (
              <Box mt={3}>
                <NumberFormInput
                  label="Продолжительность (сек)"
                  value={lesson.totalDuration}
                  onChange={handleCustomTimeChange}
                  min={1}
                  placeholder="Введите продолжительность в секундах"
                />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
});
