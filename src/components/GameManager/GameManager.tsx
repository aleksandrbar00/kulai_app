import { useNavigate, useParams } from "react-router";
import { Lesson } from "./components/Question/Question";
import { useEffect, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useSignals } from "@preact/signals-react/runtime";
import { 
  startLessonTimer, 
  timeRemaining, 
  lessonState, 
  clearCurrentLesson, 
  loadLesson,
  checkLessonExists,
  currentLessonId,
  startAutoSave,
  stopAutoSave
} from "./stores/lessonStore";

export const GameManager = () => {
    const navigate = useNavigate();
    const { lessonId } = useParams<{ lessonId: string }>();
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
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

    useEffect(() => {
        // If we have a specific lessonId in the URL, load that lesson
        if (lessonId && lessonId !== currentLessonId.value) {
            // If the lesson doesn't exist or can't be loaded, redirect to home
            if (!checkLessonExists(lessonId) || !loadLesson(lessonId)) {
                navigate('/');
                return;
            }
        }

        // If lesson is already completed (showing results), don't start the timer
        if (lessonState.value.showResults) {
            console.log("Lesson already completed, not starting timer");
            return;
        }

        // Store current time as reference for countdown
        startTimeRef.current = Date.now();
        initialTimeRef.current = timeRemaining.value;

        // Start or resume the timer when component mounts
        timerRef.current = startLessonTimer();
        
        // Start autosaving
        autoSaveRef.current = startAutoSave();

        // Clean up the timer when component unmounts
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            stopAutoSave();
        };
    }, [lessonId, navigate]);

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

    const handleLessonComplete = () => {
        // Clear the timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        // Stop autosaving
        stopAutoSave();
        
        // Clear the current lesson
        clearCurrentLesson();
        
        // Navigate back to home
        navigate('/');
    };

    // If already showing results, don't show the timer
    const showTimer = !lessonState.value.showResults;

    return (
        <Box>
            {/* Lesson Title */}
            <Box mb={4} textAlign="center">
                <Text fontSize="2xl" fontWeight="bold">
                    {lessonState.value.title}
                </Text>
            </Box>
            
            {/* Timer Display - only show if not in results mode */}
            {showTimer && (
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
            )}
            
            <Lesson onComplete={handleLessonComplete} />
        </Box>
    );
};