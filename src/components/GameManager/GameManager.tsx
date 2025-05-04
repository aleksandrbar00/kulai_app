import { useNavigate, useParams } from "react-router";
import { Lesson } from "./components/Question/Question";
import { useEffect, useRef } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useSignals } from "@preact/signals-react/runtime";
import { 
  lessonActions,
  lessonState, 
  currentLessonId,
} from "./stores";
import { Timer } from "./components/Timer";

export const GameManager = () => {
    const navigate = useNavigate();
    const { lessonId } = useParams<{ lessonId: string }>();
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useSignals();

    useEffect(() => {
        // If we have a specific lessonId in the URL, load that lesson
        if (lessonId && lessonId !== currentLessonId.value) {
            // If the lesson doesn't exist or can't be loaded, redirect to home
            if (!lessonActions.checkLessonExists(lessonId) || !lessonActions.loadLesson(lessonId)) {
                navigate('/');
                return;
            }
        }

        // If lesson is already completed (showing results), don't start the timer
        if (lessonState.value.showResults) {
            console.log("Lesson already completed, not starting timer");
            return;
        }

        // Start or resume the timer when component mounts
        timerRef.current = lessonActions.startLessonTimer();
        
        // Start autosaving
        autoSaveRef.current = lessonActions.startAutoSave();

        // Clean up the timer when component unmounts
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            lessonActions.stopAutoSave();
        };
    }, [lessonId, navigate]);

    const handleLessonComplete = () => {
        // Clear the timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        // Stop autosaving
        lessonActions.stopAutoSave();
        
        // Clear the current lesson
        lessonActions.clearCurrentLesson();
        
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
            {showTimer && <Timer />}
            
            <Lesson onComplete={handleLessonComplete} />
        </Box>
    );
};