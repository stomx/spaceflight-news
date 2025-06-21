// 테스트 환경 설정 파일
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver for tests
// biome-ignore lint/suspicious/noExplicitAny: 테스트 글로벌 객체 설정에 any 필요
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  disconnect() { }
  observe() { }
  unobserve() { }
};

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
