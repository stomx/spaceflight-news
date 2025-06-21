import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// 테스트 유틸리티 함수들
import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

// 쿼리 클라이언트가 필요한 컴포넌트 테스트를 위한 커스텀 래퍼
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// 모든 프로바이더를 포함한 래퍼 컴포넌트
function AllTheProviders({ children }: { children: ReactNode }) {
  const testQueryClient = createTestQueryClient();

  return <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>;
}

// 커스텀 render 함수
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// 테스트용 모킹 데이터
export const mockNewsItem = {
  id: 1,
  title: '테스트 뉴스 제목',
  summary: '테스트 뉴스 요약 내용입니다.',
  imageUrl: 'https://example.com/test-image.jpg',
  publishedAt: '2024-01-01T00:00:00.000Z',
  site: '테스트 사이트',
  featured: false,
};

export const mockNewsItemFeatured = {
  ...mockNewsItem,
  id: 2,
  title: '특집 뉴스 제목',
  featured: true,
};

export const mockPaginatedResponse = {
  count: 100,
  results: [mockNewsItem, mockNewsItemFeatured],
};

// re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
