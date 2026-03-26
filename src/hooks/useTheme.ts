import { useSettingsStore } from '../stores/useSettingsStore';

// Palette Reference (all colors exposed per mode)
const light = {
  bg: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  accent: '#4F46E5',
  accentLight: '#EEF2FF',
  accentBorder: '#C7D2FE',
  danger: '#EF4444',
  shadow: '#0F172A',
};

const dark = {
  bg: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#263349',
  border: '#334155',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accent: '#818CF8',
  accentLight: '#1E1B4B',
  accentBorder: '#4338CA',
  danger: '#F87171',
  shadow: '#000000',
};

export type ThemeColors = typeof light;

export const useTheme = (): ThemeColors => {
  const isDark = useSettingsStore(s => s.isDark);
  return isDark ? dark : light;
};
