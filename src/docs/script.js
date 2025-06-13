import fs from "fs";

function parseQuestionBlock(block) {
  // Split the block into question and answers
  const lines = block.trim().split("\n");
  const question = lines[0].trim();

  // Parse answers
  const answers = [];
  let correctAnswerId = null;

  lines.slice(1).forEach((line, index) => {
    if (line.trim() && !line.includes("{")) {
      const isCorrect = line.includes("=");
      // Remove the marker and clean the answer
      const answerText = line.replace("=", "").replace("~", "").trim();
      const answer = {
        id: index + 1,
        title: answerText,
      };
      answers.push(answer);
      if (isCorrect) {
        correctAnswerId = index + 1;
      }
    }
  });

  return {
    title: question,
    answers: answers,
    correctAnswerId: correctAnswerId,
  };
}

function convertToJson(inputText) {
  // Split the input text into question blocks
  const questionBlocks = inputText.split("}");

  // Create the main structure
  const result = {
    title: "АДГ",
    subcategories: [
      {
        id: 1,
        title: "общие",
        questions: [],
      },
    ],
  };

  // Process each question block
  questionBlocks.forEach((block, index) => {
    if (block.trim()) {
      const questionData = parseQuestionBlock(block);
      questionData.id = index + 1;
      result.subcategories[0].questions.push(questionData);
    }
  });

  return result;
}

// Read the input file
const inputText = fs.readFileSync("q.txt", "utf8");

// Convert to JSON
const result = convertToJson(inputText);

// Write the output file
fs.writeFileSync("questions.json", JSON.stringify(result, null, 2), "utf8");
