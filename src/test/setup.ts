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

// Mock ResizeObserver for tests
// biome-ignore lint/suspicious/noExplicitAny: 테스트 글로벌 객체 설정에 any 필요
(globalThis as any).ResizeObserver = class ResizeObserver {
  disconnect() { }
  observe() { }
  unobserve() { }
};

// Mock Range.createContextualFragment for tests
// biome-ignore lint/suspicious/noExplicitAny: 테스트 글로벌 객체 설정에 any 필요
(globalThis as any).Range = class Range {
  // biome-ignore lint/suspicious/noExplicitAny: 테스트 모킹에 any 필요
  createContextualFragment(html: string): any {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
  }
  // biome-ignore lint/suspicious/noExplicitAny: 테스트 모킹에 any 필요
  selectNode(_node: any) { }
  // biome-ignore lint/suspicious/noExplicitAny: 테스트 모킹에 any 필요
  selectNodeContents(_node: any) { }
};

// Mock popper for tests
vi.mock('@popperjs/core', () => ({
  createPopper: () => ({
    destroy: vi.fn(),
    update: vi.fn(),
  }),
}));

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

// Mock getComputedStyle for tests
Object.defineProperty(window, 'getComputedStyle', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    getPropertyValue: vi.fn(() => ''),
    getPropertyPriority: vi.fn(() => ''),
  })),
});
