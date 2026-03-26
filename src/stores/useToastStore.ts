import { create } from 'zustand';

interface ToastState {
  message: string | null;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

let timeoutId: NodeJS.Timeout;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  type: 'info',
  isVisible: false,
  showToast: (message, type = 'info') => {
    set({ message, type, isVisible: true });
    
    // Clear previous timeout handling multiple rapid calls
    if (timeoutId) clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      set({ isVisible: false });
    }, 4000);
  },
  hideToast: () => {
    if (timeoutId) clearTimeout(timeoutId);
    set({ isVisible: false });
  }
}));
