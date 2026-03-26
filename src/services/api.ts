import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configure JWT Interceptor
api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error attaching token:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global Error Handler for 401s could emit an event, but Zustand store will ideally handle it using interceptors inside the auth layer if needed.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally log errors or handle global token expiration
    return Promise.reject(error);
  }
);
