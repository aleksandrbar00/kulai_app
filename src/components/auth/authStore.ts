import { signal } from "@preact/signals-react";
import { authService, userService } from "../../services/api";
import type { CreateUserDto } from "../../types/api";
import { api } from "../../services/api";

export type TUser = {
  id: number;
  email: string;
  name: string;
  age: number;
};

type TAuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loadInitialState = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return initialState;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const userData = await userService.getCurrentUser();

    authState.value = {
      user: userData,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    isAuthReady.value = true;
  } catch {
    return initialState;
  }
};

export const isAuthReady = signal(false);

export const authState = signal<TAuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
});

const updateAuthState = (newState: Partial<TAuthState>) => {
  authState.value = { ...authState.value, ...newState };
};

export const login = async (username: string, password: string) => {
  try {
    updateAuthState({ isLoading: true, error: null });

    const { access_token: token } = await authService.login({
      username,
      password,
    });

    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const userData = await userService.getCurrentUser();

    localStorage.setItem("kulai_auth_user", JSON.stringify(userData));

    updateAuthState({
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    });

    isAuthReady.value = true;
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to login";
    updateAuthState({
      isLoading: false,
      error: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};

export const register = async (userData: CreateUserDto) => {
  try {
    updateAuthState({ isLoading: true, error: null });

    const response = await userService.create(userData);

    const userWithoutPassword: TUser = {
      id: response.id,
      email: response.email,
      name: response.name,
      age: response.age,
    };

    localStorage.setItem(
      "kulai_auth_user",
      JSON.stringify(userWithoutPassword),
    );

    updateAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      isLoading: false,
    });

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to register";
    updateAuthState({
      isLoading: false,
      error: errorMessage,
    });
    return { success: false, error: errorMessage };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("kulai_auth_user");
  delete api.defaults.headers.common["Authorization"];
  updateAuthState({
    user: null,
    isAuthenticated: false,
    error: null,
  });
  return { success: true };
};

export const checkAuth = () => {
  return authState.value.isAuthenticated;
};

export const getCurrentUser = () => {
  return authState.value.user;
};
