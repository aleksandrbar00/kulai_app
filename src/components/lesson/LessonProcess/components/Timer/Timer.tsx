import { useEffect, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { timeRemaining, lessonState } from "../../stores";
import { useSignals } from "@preact/signals-react/runtime";

export const Timer = () => {
  useSignals();
  const [displayTime, setDisplayTime] = useState(timeRemaining.value);
  const startTimeRef = useRef(Date.now());
  const initialTimeRef = useRef(timeRemaining.value);

  useEffect(() => {
    initialTimeRef.current = timeRemaining.value;
    startTimeRef.current = Date.now();
    setDisplayTime(timeRemaining.value);
  }, [timeRemaining.value]);

  useEffect(() => {
    if (lessonState.value.showResults || !timeRemaining.value) {
      return;
    }

    const updateTimer = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const newTime = Math.max(0, initialTimeRef.current - Math.floor(elapsed));
      setDisplayTime(newTime);
    };

    updateTimer();

    const displayTimerId = setInterval(updateTimer, 100);

    return () => {
      clearInterval(displayTimerId);
    };
  }, [timeRemaining.value]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Box mb={4} p={4} borderWidth="1px" borderRadius="md">
      <Text textAlign="center" fontSize="lg" fontWeight="bold" mb={2}>
        Время: {formatTime(displayTime)}
      </Text>
    </Box>
  );
};
