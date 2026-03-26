import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // True during initial hydration
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (token: string) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
      set({ token, isAuthenticated: true });
    } catch (error) {
      console.error('Error saving token', error);
    }
  },
  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      set({ token: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error deleting token', error);
    }
  },
  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        set({ token, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to hydrate token from SecureStore', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
