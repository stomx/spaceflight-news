import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ArticleDetailFeature } from '../index';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Article } from '@/shared/types/news';

// Mock dependencies
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

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <span data-testid="arrow-left-icon">←</span>,
  Loader2: () => <span data-testid="loader-icon">Loading...</span>,
}));

vi.mock('@/shared/hooks/useNewsQuery', () => ({
  useArticleQuery: vi.fn(),
}));

vi.mock('@/entities/news/components/NewsDetail', () => ({
  NewsDetail: ({
    news,
    onExternalLinkClick,
  }: {
    news: Article;
    onExternalLinkClick: (url:string) => void;
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

import { useArticleQuery } from '@/shared/hooks/useNewsQuery';

const mockUseArticleQuery = vi.mocked(useArticleQuery);

// Mock window methods
const mockWindowHistoryBack = vi.fn();
const mockWindowOpen = vi.fn();

Object.defineProperty(window, 'history', {
  value: { back: mockWindowHistoryBack },
  writable: true,
});

Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('ArticleDetailFeature', () => {
  const articleId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 로더를 표시한다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
      } as UseQueryResult<Article, Error>);

      render(<ArticleDetailFeature articleId={articleId} />);

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('기사를 불러오는 중...')).toBeInTheDocument();
    });
  });

  describe('에러 상태', () => {
    it('에러 발생 시 에러 메시지와 뒤로가기 버튼을 표시한다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('기사를 찾을 수 없습니다'),
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
      } as UseQueryResult<Article, Error>);

      render(<ArticleDetailFeature articleId={articleId} />);

      // 제목과 에러 메시지를 구분해서 확인
      expect(screen.getByRole('heading', { name: '기사를 찾을 수 없습니다' })).toBeInTheDocument();
      expect(screen.getByText('기사 목록으로 돌아가기')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
    });

    it('에러 메시지가 없을 때 기본 메시지를 표시한다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(),
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
      } as UseQueryResult<Article, Error>);

      render(<ArticleDetailFeature articleId={articleId} />);

      expect(screen.getByText('기사를 찾을 수 없습니다')).toBeInTheDocument();
      expect(
        screen.getByText('요청하신 기사가 존재하지 않거나 일시적인 오류가 발생했습니다.')
      ).toBeInTheDocument();
    });

    it('뒤로가기 버튼 클릭 시 브라우저 히스토리 back이 호출된다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('네트워크 오류'),
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
      } as UseQueryResult<Article, Error>);

      render(<ArticleDetailFeature articleId={articleId} />);

      const backButton = screen.getByText('기사 목록으로 돌아가기');
      fireEvent.click(backButton);

      expect(mockWindowHistoryBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('데이터 없음 상태', () => {
    it('데이터가 null일 때 정보 없음 메시지를 표시한다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Article | null, Error>);

      render(<ArticleDetailFeature articleId={articleId} />);

      expect(screen.getByText('기사 정보가 없습니다.')).toBeInTheDocument();
      expect(screen.getByText('기사 목록으로 돌아가기')).toBeInTheDocument();
    });

    it('데이터 없음 상태에서 뒤로가기 버튼이 동작한다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Article | null, Error>);

      render(<ArticleDetailFeature articleId={articleId} />);

      const backButton = screen.getByText('기사 목록으로 돌아가기');
      fireEvent.click(backButton);

      expect(mockWindowHistoryBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('성공 상태', () => {
    const mockArticle = {
      id: 123,
      title: '테스트 기사 제목',
      summary: '테스트 기사 요약 내용입니다.',
      content: '테스트 기사의 상세 내용입니다.',
      image_url: 'https://example.com/image.jpg',
      published_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      news_site: '테스트 뉴스',
      url: 'https://example.com/article',
      featured: true,
    };

    it('기사 데이터가 있을 때 NewsDetail 컴포넌트를 렌더링한다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: mockArticle,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Article, Error>);

      render(<ArticleDetailFeature articleId={articleId} />);

      expect(screen.getByTestId('news-detail')).toBeInTheDocument();
      expect(screen.getByText('테스트 기사 제목')).toBeInTheDocument();
      expect(screen.getByText('테스트 기사 요약 내용입니다.')).toBeInTheDocument();
    });

    it('외부 링크 클릭 시 새 탭에서 URL을 연다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: mockArticle,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Article, Error>);

      render(<ArticleDetailFeature articleId={articleId} />);

      const externalLinkButton = screen.getByText('원문 보기');
      fireEvent.click(externalLinkButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/article',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('Props', () => {
    it('전달받은 articleId로 쿼리를 실행한다', () => {
      mockUseArticleQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
      } as UseQueryResult<Article, Error>);

      render(<ArticleDetailFeature articleId="456" />);

      expect(mockUseArticleQuery).toHaveBeenCalledWith('456');
    });
  });

  describe('컨테이너 구조', () => {
    it('성공 상태에서 적절한 컨테이너 클래스를 가진다', () => {
      const mockArticle = {
        id: 123,
        title: '테스트 기사',
        summary: '테스트 요약',
        content: '테스트 내용',
        image_url: 'https://example.com/image.jpg',
        published_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        news_site: '테스트 뉴스',
        url: 'https://example.com/article',
        featured: false,
      };

      mockUseArticleQuery.mockReturnValue({
        data: mockArticle,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Article, Error>);

      const { container } = render(<ArticleDetailFeature articleId={articleId} />);

      const containerDiv = container.querySelector('.container.mx-auto.px-4.py-6');
      expect(containerDiv).toBeInTheDocument();
    });
  });
});
