import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  isDark: boolean;
  language: string;
  toggleDark: () => void;
  setLanguage: (lang: string) => void;
  hydrate: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  isDark: false,
  language: 'en',
  toggleDark: async () => {
    const next = !get().isDark;
    set({ isDark: next });
    try { await AsyncStorage.setItem('isDark', JSON.stringify(next)); } catch (_) {}
  },
  setLanguage: async (lang: string) => {
    set({ language: lang });
    try { await AsyncStorage.setItem('language', lang); } catch (_) {}
  },
  hydrate: async () => {
    try {
      const [darkRaw, lang] = await Promise.all([
        AsyncStorage.getItem('isDark'),
        AsyncStorage.getItem('language'),
      ]);
      if (darkRaw !== null) set({ isDark: JSON.parse(darkRaw) });
      if (lang) set({ language: lang });
    } catch (_) {}
  },
}));
