import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BlogDetailFeature } from '../index';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Blog } from '@/shared/types/news';

// framer-motion을 정교하게 모킹하여 불필요한 prop 전달을 막습니다.
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const original = await import('framer-motion');

  const MockComponent = React.forwardRef(
    // biome-ignore lint/suspicious/noExplicitAny: 테스트 모킹에 any 필요
    ({ children, ...props }: any, ref) => {
      const { whileHover, whileTap, ...rest } = props;
      return React.createElement('div', { ...rest, ref }, children);
    },
  );

  return {
    ...original,
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

vi.mock('@/shared/hooks/useNewsQuery', () => ({
  useBlogQuery: vi.fn(),
}));

vi.mock('@/entities/news/components/NewsDetail', () => ({
  NewsDetail: ({
    news,
    onExternalLinkClick,
  }: {
    news: Blog;
    onExternalLinkClick: (url: string) => void;
  }) => (
    <div data-testid="news-detail">
      <h1>{news.title}</h1>
      <p>{news.summary}</p>
      <button onClick={() => onExternalLinkClick(news.url)} data-testid="external-link-button">
        원문 보기
      </button>
    </div>
  ),
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon">ArrowLeft</span>,
  Loader2: () => <span data-testid="loader-icon">Loader2</span>,
}));

import { useBlogQuery } from '@/shared/hooks/useNewsQuery';

const mockUseBlogQuery = vi.mocked(useBlogQuery);

// Mock window methods
const mockHistoryBack = vi.fn();
const mockWindowOpen = vi.fn();

Object.defineProperty(window, 'history', {
  value: { back: mockHistoryBack },
  writable: true,
});

Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('BlogDetailFeature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('테스트 모드', () => {
    it('blogId가 "test"일 때 더미 데이터를 표시한다', async () => {
      mockUseBlogQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
      } as UseQueryResult<Blog, Error>);

      render(<BlogDetailFeature blogId="test" />);

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('블로그를 불러오는 중...')).toBeInTheDocument();
    });
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 로딩 메시지를 표시한다', () => {
      mockUseBlogQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
      } as UseQueryResult<Blog, Error>);

      render(<BlogDetailFeature blogId="1" />);

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('블로그를 불러오는 중...')).toBeInTheDocument();
    });
  });

  describe('에러 상태', () => {
    it('에러 발생 시 에러 메시지와 뒤로가기 버튼을 표시한다', async () => {
      const user = userEvent.setup();
      
      mockUseBlogQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('네트워크 오류가 발생했습니다'),
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
      } as UseQueryResult<Blog, Error>);

      render(<BlogDetailFeature blogId="1" />);

      expect(screen.getByText('블로그를 찾을 수 없습니다')).toBeInTheDocument();
      expect(screen.getByText('네트워크 오류가 발생했습니다')).toBeInTheDocument();
      
      const backButton = screen.getByText('블로그 목록으로 돌아가기');
      expect(backButton).toBeInTheDocument();
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();

      await user.click(backButton);
      expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    });

    it('기본 에러 메시지를 표시한다 (error.message가 없는 경우)', () => {
      mockUseBlogQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: null,
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
      } as UseQueryResult<Blog, Error>);

      render(<BlogDetailFeature blogId="1" />);

      expect(screen.getByText('요청하신 블로그가 존재하지 않거나 일시적인 오류가 발생했습니다.')).toBeInTheDocument();
    });
  });

  describe('데이터 없음 상태', () => {
    it('블로그 데이터가 없을 때 적절한 메시지와 뒤로가기 버튼을 표시한다', async () => {
      const user = userEvent.setup();
      
      mockUseBlogQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Blog | null, Error>);

      render(<BlogDetailFeature blogId="1" />);

      expect(screen.getByText('블로그 정보가 없습니다.')).toBeInTheDocument();
      
      const backButton = screen.getByText('블로그 목록으로 돌아가기');
      expect(backButton).toBeInTheDocument();

      await user.click(backButton);
      expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('성공 상태', () => {
    const mockBlog = {
      id: 1,
      title: '테스트 블로그',
      summary: '테스트 블로그 요약',
      url: 'https://example.com/blog/1',
      image_url: 'https://example.com/blog1.jpg',
      published_at: '2024-01-01T00:00:00Z',
      news_site: '테스트 블로그 사이트',
      featured: true,
    };

    it('블로그 데이터를 성공적으로 렌더링한다', () => {
      mockUseBlogQuery.mockReturnValue({
        data: mockBlog,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Blog, Error>);

      render(<BlogDetailFeature blogId="1" />);

      expect(screen.getByTestId('news-detail')).toBeInTheDocument();
      expect(screen.getByText('테스트 블로그')).toBeInTheDocument();
      expect(screen.getByText('테스트 블로그 요약')).toBeInTheDocument();
      expect(screen.getByTestId('external-link-button')).toBeInTheDocument();
    });

    it('외부 링크 클릭 시 새 탭에서 열린다', async () => {
      const user = userEvent.setup();
      
      mockUseBlogQuery.mockReturnValue({
        data: mockBlog,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Blog, Error>);

      render(<BlogDetailFeature blogId="1" />);

      const externalLinkButton = screen.getByTestId('external-link-button');
      await user.click(externalLinkButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/blog/1',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('올바른 컨테이너 구조를 가진다', () => {
      mockUseBlogQuery.mockReturnValue({
        data: mockBlog,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Blog, Error>);

      const { container } = render(<BlogDetailFeature blogId="1" />);

      const wrapper = container.querySelector('div.container.mx-auto.px-4.py-6');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('useBlogQuery 호출', () => {
    it('올바른 blogId로 훅을 호출한다', () => {
      mockUseBlogQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
      } as UseQueryResult<Blog, Error>);

      render(<BlogDetailFeature blogId="123" />);

      expect(mockUseBlogQuery).toHaveBeenCalledWith('123');
    });
  });
});
