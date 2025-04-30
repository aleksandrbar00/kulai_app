export interface Question {
    id: string;
    text: string;
    answer: string;
    type: "input" | "multipleChoice";
    options?: string[]; // Only for multipleChoice type
}