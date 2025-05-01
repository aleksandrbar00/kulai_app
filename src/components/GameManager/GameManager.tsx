import { useNavigate } from "react-router";
import { Lesson } from "./components/Question/Question";
import { initializeLesson } from "./stores/lessonStore";
import type { Question } from "./types";

// Usage example
const sampleQuestions: Question[] = [
    {
      id: "1",
      text: "Spell the word for a large body of water",
      answer: "ocean",
      type: "input"
    },
    {
      id: "2",
      text: "Select the correct spelling",
      answer: "banana",
      type: "multipleChoice",
      options: ["banana", "bananna", "bannana", "bananana"]
    }
  ];

export const GameManager = () => {
    const navigate = useNavigate();

    initializeLesson(sampleQuestions);

    return <>
        <Lesson onComplete={() => {
          navigate('/');
        }} />
    </>
}