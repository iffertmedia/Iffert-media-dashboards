import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, AuthState } from '../types/auth';

// Default admin credentials - in production, these would be stored securely
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'iffert2024',  // You can change this
  role: 'admin' as const
};

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  
  // Computed
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check credentials
          if (
            credentials.username === ADMIN_CREDENTIALS.username &&
            credentials.password === ADMIN_CREDENTIALS.password
          ) {
            const user: User = {
              id: '1',
              username: credentials.username,
              role: 'admin',
              isAuthenticated: true
            };

            set({ 
              user, 
              isLoading: false, 
              error: null 
            });
            
            return true;
          } else {
            set({ 
              user: null, 
              isLoading: false, 
              error: 'Invalid username or password' 
            });
            
            return false;
          }
        } catch (error) {
          set({ 
            user: null, 
            isLoading: false, 
            error: 'Login failed. Please try again.' 
          });
          
          return false;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isLoading: false, 
          error: null 
        });
      },

      clearError: () => {
        set({ error: null });
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' && user?.isAuthenticated === true;
      },

      isAuthenticated: () => {
        const { user } = get();
        return user?.isAuthenticated === true;
      }
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user
      })
    }
  )
);