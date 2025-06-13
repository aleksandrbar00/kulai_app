import { signal } from "@preact/signals-react";
import { questionService } from "../../../../services/api";
import type { Category } from "../../../../types/api";

type TQuestionsState = {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
};

export const questionsState = signal<TQuestionsState>({
  categories: [],
  isLoading: false,
  error: null,
});

const allCategories = signal<Category[]>([]);

export const questionsActions = {
  fetchQuestions: async () => {
    try {
      questionsState.value = {
        ...questionsState.value,
        isLoading: true,
        error: null,
      };

      const categories = await questionService.getAll();
      allCategories.value = categories;

      questionsState.value = {
        categories,
        isLoading: false,
        error: null,
      };
    } catch (error) {
      questionsState.value = {
        ...questionsState.value,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch questions",
      };
    }
  },

  searchQuestions: (term: string) => {
    if (!term) {
      questionsState.value = {
        ...questionsState.value,
        categories: allCategories.value,
      };
      return;
    }

    const filtered = allCategories.value
      .map((category) => ({
        ...category,
        subcategories: category.subcategories
          .map((sub) => ({
            ...sub,
            questions: sub.questions.filter((q) =>
              q.title.toLowerCase().includes(term.toLowerCase()),
            ),
          }))
          .filter((sub) => sub.questions.length > 0),
      }))
      .filter((category) => category.subcategories.length > 0);

    questionsState.value = { ...questionsState.value, categories: filtered };
  },
};
