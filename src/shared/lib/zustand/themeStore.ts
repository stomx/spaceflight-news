import { create } from 'zustand';

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

/**
 * 다크모드 상태를 관리하는 전역 스토어입니다.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
