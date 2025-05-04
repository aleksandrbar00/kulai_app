import { useEffect, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { timeRemaining, lessonState } from "../stores";
import { useSignals } from "@preact/signals-react/runtime";

export const Timer = () => {
    const [displayTime, setDisplayTime] = useState(timeRemaining.value);
    const startTimeRef = useRef(Date.now());
    const initialTimeRef = useRef(timeRemaining.value);
    useSignals();

    // Update the display time continuously if not showing results
    useEffect(() => {
        // Don't start the timer if already showing results
        if (lessonState.value.showResults) {
            return;
        }

        const updateTimer = () => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const newTime = Math.max(0, initialTimeRef.current - Math.floor(elapsed));
            setDisplayTime(newTime);
        };

        // Update immediately
        updateTimer();
        
        // Then update very frequently for smooth countdown
        const displayTimerId = setInterval(updateTimer, 100);
        
        return () => {
            clearInterval(displayTimerId);
        };
    }, []);

    // Format seconds to mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const timeProgress = lessonState.value.totalDuration > 0 
        ? (displayTime / lessonState.value.totalDuration) * 100 
        : 0;
        
    // Get the appropriate color based on time remaining
    const getProgressColor = () => {
        if (displayTime < 10) return "red.500";
        if (displayTime < 30) return "yellow.500";
        return "green.500";
    };

    return (
        <Box mb={4} p={4} borderWidth="1px" borderRadius="md">
            <Text textAlign="center" fontSize="lg" fontWeight="bold" mb={2}>
                Time Remaining: {formatTime(displayTime)}
            </Text>
            <Box w="100%" h="8px" bg="gray.200" borderRadius="md">
                <Box 
                    h="100%" 
                    w={`${timeProgress}%`} 
                    bg={getProgressColor()} 
                    borderRadius="md"
                    transition="width 0.1s linear"
                />
            </Box>
        </Box>
    );
}; 