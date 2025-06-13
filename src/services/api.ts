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

const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

type TTokenResponse = {
  access_token: string;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await authService.refreshTokens();
        const { access_token } = response;

        localStorage.setItem("access_token", access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const authService = {
  login: async (credentials: LoginUserDto): Promise<TTokenResponse> => {
    const response = await api.post<TTokenResponse>("/auth/login", credentials);
    return response.data;
  },
  refreshTokens: async (): Promise<TTokenResponse> => {
    const response = await api.post<TTokenResponse>(
      "/auth/refresh",
      {},
      {
        withCredentials: true,
      },
    );
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
    const response = await api.get("/questions/all");
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
