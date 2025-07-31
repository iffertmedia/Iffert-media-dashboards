export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AdminCredentials {
  username: string;
  password: string;
  role: 'admin';
}