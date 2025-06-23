import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useThemeStore } from '../themeStore';

describe('useThemeStore', () => {
  it('초기 darkMode 상태는 false여야 합니다', () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.darkMode).toBe(false);
  });

  it('toggleDarkMode를 호출하면 darkMode 상태가 반전되어야 합니다', () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.darkMode).toBe(true);

    act(() => {
      result.current.toggleDarkMode();
    });

    expect(result.current.darkMode).toBe(false);
  });

  it('여러 인스턴스에서 상태를 공유해야 합니다', () => {
    const { result: first } = renderHook(() => useThemeStore());
    const { result: second } = renderHook(() => useThemeStore());

    act(() => {
      first.current.toggleDarkMode();
    });

    expect(first.current.darkMode).toBe(true);
    expect(second.current.darkMode).toBe(true);
  });
}); 