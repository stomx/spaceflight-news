// 테스트 환경 설정 파일
import '@testing-library/jest-dom';
import { vi, afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

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

// Framer Motion의 애니메이션을 테스트 환경에서 비활성화
vi.mock('framer-motion', async (importOriginal) => {
  const React = await import('react');
  const original = await importOriginal<typeof import('framer-motion')>();

  const MockComponent = React.forwardRef(
    // biome-ignore lint/suspicious/noExplicitAny: 테스트 모킹에 any 필요
    ({ children, ...props }: any, ref) => {
      const { initial, animate, exit, variants, whileHover, whileTap, ...rest } = props;
      // 'div'를 기본으로 사용하지만, 다른 태그로 확장할 수 있습니다.
      return React.createElement('div', { ...rest, ref }, children);
    },
  );

  return {
    ...original,
    useInView: () => true,
    AnimatePresence: ({ children }) => children,
    motion: new Proxy(original.motion, {
      get: (target, key) => {
        if (typeof target[key as keyof typeof target] === 'function') {
          return MockComponent;
        }
        return target[key as keyof typeof target];
      },
    }),
  };
});

// MSW 서버 설정
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
