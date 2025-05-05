import { signal } from "@preact/signals-react";

// Define user interface
export interface User {
  id: string;
  email: string;
  name?: string;
  age?: number;
}

interface StoredUser extends User {
  password: string;
}

// Define authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Load user from localStorage on initialization
const loadInitialState = (): AuthState => {
  try {
    const savedUser = localStorage.getItem('kulai_auth_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return {
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    }
  } catch (error) {
    console.error('Не удалось загрузить пользователя из localStorage:', error);
  }
  return initialState;
};

// Create auth state signal
export const authState = signal<AuthState>(loadInitialState());

// Helper to update auth state
const updateAuthState = (newState: Partial<AuthState>) => {
  authState.value = { ...authState.value, ...newState };
};

// Authenticate user (login)
export const login = async (email: string, password: string) => {
  try {
    updateAuthState({ isLoading: true, error: null });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // For now, check localStorage for user credentials
    const usersStr = localStorage.getItem('kulai_users');
    const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];
    
    const user = users.find((u) => u.email === email);
    
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    if (user.password !== password) {
      throw new Error('Неверный пароль');
    }

    // Create user object without password
    const userWithoutPassword: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      age: user.age
    };
    
    // Store user in localStorage
    localStorage.setItem('kulai_auth_user', JSON.stringify(userWithoutPassword));
    
    updateAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      isLoading: false
    });
    
    return { success: true };
  } catch (error) {
    updateAuthState({
      isLoading: false,
      error: error instanceof Error ? error.message : 'Не удалось войти'
    });
    return { success: false, error };
  }
};

// Register new user
export const register = async (userData: {
  email: string;
  password: string;
  name?: string;
  age?: number;
}) => {
  try {
    updateAuthState({ isLoading: true, error: null });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // For now, check if user already exists
    const usersStr = localStorage.getItem('kulai_users');
    const users: StoredUser[] = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.some((u) => u.email === userData.email)) {
      throw new Error('Этот email уже зарегистрирован');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData
    };

    // Add to users array
    users.push(newUser as StoredUser);
    localStorage.setItem('kulai_users', JSON.stringify(users));

    // Create user object without password
    const userWithoutPassword: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      age: newUser.age
    };
    
    // Set as logged in user
    localStorage.setItem('kulai_auth_user', JSON.stringify(userWithoutPassword));
    
    updateAuthState({
      user: userWithoutPassword,
      isAuthenticated: true,
      isLoading: false
    });
    
    return { success: true };
  } catch (error) {
    updateAuthState({
      isLoading: false,
      error: error instanceof Error ? error.message : 'Не удалось зарегистрироваться'
    });
    return { success: false, error };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('kulai_auth_user');
  updateAuthState({
    user: null,
    isAuthenticated: false,
    error: null
  });
  return { success: true };
};

// Check if user is authenticated
export const checkAuth = () => {
  return authState.value.isAuthenticated;
};

// Get current user
export const getCurrentUser = () => {
  return authState.value.user;
}; 