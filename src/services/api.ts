import axios from "axios";
import type {
  LoginUserDto,
  CreateUserDto,
  CreateLessonDto,
  LessonSessionResponseDto,
  SubmitAnswerDto,
  SubmitAnswerResponseDto,
  PaginatedResponse,
  UserInfoDto,
  Category,
} from "../types/api";

const API_BASE_URL = "http://localhost:3000"; // Update this with your actual API URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type TLoginResponse = {
  access_token: string;
};

export const authService = {
  login: async (credentials: LoginUserDto): Promise<TLoginResponse> => {
    const response = await api.post<TLoginResponse>("/auth/login", credentials);
    return response.data;
  },
};

export const userService = {
  create: async (userData: CreateUserDto) => {
    const response = await api.post("/users", userData);
    return response.data;
  },
  getCurrentUser: async (): Promise<UserInfoDto> => {
    const response = await api.get("/users/me");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export const questionService = {
  getAll: async (): Promise<Category[]> => {
    console.log("Making API request to /questions/all");
    const response = await api.get("/questions/all");
    console.log("Raw API response:", response);
    console.log("API response data:", response.data);
    return response.data;
  },
};

export const lessonService = {
  create: async (
    lessonData: CreateLessonDto,
  ): Promise<LessonSessionResponseDto> => {
    const response = await api.post("/lessons", lessonData);
    return response.data;
  },

  getById: async (id: number): Promise<LessonSessionResponseDto> => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  submitAnswer: async (
    lessonId: number,
    answer: SubmitAnswerDto,
  ): Promise<SubmitAnswerResponseDto> => {
    const response = await api.post(`/lessons/${lessonId}/answer`, answer);
    return response.data;
  },

  getHistory: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<LessonSessionResponseDto>> => {
    const response = await api.get("/lessons/my-history", {
      params: { page, limit },
    });
    return response.data;
  },
};
