import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BlogListFeature } from '../index';
import type { useNewsListModel } from '@/shared/hooks/useNewsListModel';
import type { Blog, PaginatedBlogList } from '@/shared/types/news';
import type { ComponentProps } from 'react';
import type { NewsList } from '@/entities/news/components/NewsList';
import type { NewsCard } from '@/entities/news/components/NewsCard';

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: ComponentProps<'div'>) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/shared/hooks/useNewsListModel');

vi.mock('@/entities/news/components/NewsCardSkeleton', () => ({
  NewsListSkeleton: ({ count }: { count: number }) => (
    <div data-testid="news-list-skeleton">Loading {count} items...</div>
  ),
}));

vi.mock('@/entities/news/components/NewsList', () => ({
  NewsList: ({ items, renderItem, emptyText, page, totalPages, onPageChange }: ComponentProps<typeof NewsList<Blog>>) => (
    <div data-testid="news-list">
      {items && items.length === 0 ? (
        <div>{emptyText}</div>
      ) : (
        <>
          {items?.map(renderItem)}
          {page && totalPages && onPageChange && (
            <div>
              <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                이전
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
                다음
              </button>
            </div>
          )}
        </>
      )}
    </div>
  ),
}));

vi.mock('@/entities/news/components/NewsCard', () => ({
  NewsCard: ({ title, summary, onClick, children }: ComponentProps<typeof NewsCard>) => (
    <div data-testid="news-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{summary}</p>
      {children}
    </div>
  ),
}));

import { useNavigate } from '@tanstack/react-router';
import { useNewsListModel as useNewsListModelOriginal } from '@/shared/hooks/useNewsListModel';

const mockNavigate = vi.mocked(useNavigate);
const mockUseNewsListModel = vi.mocked(useNewsListModelOriginal);

// useNewsListModel의 반환 타입을 정의합니다.
type MockUseNewsListModel = ReturnType<typeof useNewsListModel<Blog>>;

describe('BlogListFeature', () => {
  const mockNavigateFunction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReturnValue(mockNavigateFunction);
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 스켈레톤을 표시한다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      expect(screen.getByTestId('news-list-skeleton')).toBeInTheDocument();
      expect(screen.getByText('Loading 10 items...')).toBeInTheDocument();
    });
  });

  describe('에러 상태', () => {
    it('에러 발생 시 에러 메시지를 표시한다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('네트워크 오류가 발생했습니다'),
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      expect(screen.getByText('블로그를 불러올 수 없습니다')).toBeInTheDocument();
      expect(screen.getByText('네트워크 오류가 발생했습니다')).toBeInTheDocument();
    });
  });

  describe('성공 상태', () => {
    const mockBlogs: Blog[] = [
      {
        id: 1,
        title: '테스트 블로그 1',
        summary: '테스트 블로그 1 요약',
        image_url: 'https://example.com/blog1.jpg',
        published_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        news_site: '테스트 블로그',
        featured: true,
        authors: [{ name: 'Author 1' }],
        url: 'https://example.com/blog1',
        launches: [],
        events: [],
      },
      {
        id: 2,
        title: '테스트 블로그 2',
        summary: '테스트 블로그 2 요약',
        image_url: 'https://example.com/blog2.jpg',
        published_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        news_site: '테스트 블로그 2',
        featured: false,
        authors: [{ name: 'Author 2' }],
        url: 'https://example.com/blog2',
        launches: [],
        events: [],
      },
    ];

    const mockPaginatedData: PaginatedBlogList = {
      results: mockBlogs,
      count: 20,
      next: 'https://api.spaceflightnewsapi.net/v4/blogs?limit=10&offset=10',
      previous: null,
    };

    it('데이터가 있을 때 블로그 리스트를 렌더링한다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: mockPaginatedData,
        isLoading: false,
        isError: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 2,
        search: {},
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      expect(screen.getByTestId('news-list')).toBeInTheDocument();
      expect(screen.getByText('테스트 블로그 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 블로그 2')).toBeInTheDocument();
    });

    it('블로그 클릭 시 상세 페이지로 이동한다', async () => {
      const user = userEvent.setup();

      mockUseNewsListModel.mockReturnValue({
        data: mockPaginatedData,
        isLoading: false,
        isError: false,
        error: null,
        page: 2,
        limit: 5,
        totalPages: 4,
        search: { category: 'tech' },
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      const firstBlog = screen.getAllByTestId('news-card')[0];
      await user.click(firstBlog);

      expect(mockNavigateFunction).toHaveBeenCalledWith({
        to: '/blogs/1',
        search: { category: 'tech', page: 2, limit: 5 },
      });
    });

    it('빈 결과일 때 적절한 메시지를 표시한다', () => {
      const emptyPaginatedData: PaginatedBlogList = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };

      mockUseNewsListModel.mockReturnValue({
        data: emptyPaginatedData,
        isLoading: false,
        isError: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      expect(screen.getByText('표시할 블로그가 없습니다.')).toBeInTheDocument();
    });

    it('페이지 변경 버튼 클릭 시 페이지를 변경해야 합니다', async () => {
      const user = userEvent.setup();
      mockUseNewsListModel.mockReturnValue({
        data: mockPaginatedData,
        isLoading: false,
        isError: false,
        error: null,
        page: 2,
        limit: 10,
        totalPages: 3,
        search: { query: 'test' },
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      const nextButton = screen.getByText('다음');
      await user.click(nextButton);

      expect(mockNavigateFunction).toHaveBeenCalledWith({
        search: { query: 'test', page: 3, limit: 10 },
      });

      const prevButton = screen.getByText('이전');
      await user.click(prevButton);

      expect(mockNavigateFunction).toHaveBeenCalledWith({
        search: { query: 'test', page: undefined, limit: 10 },
      });
    });
  });

  describe('기타 상태', () => {
    it('data가 undefined일 때 "데이터가 없습니다" 메시지를 표시해야 합니다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
    });

    it('isError이고 error.message가 없을 때 기본 에러 메시지를 표시해야 합니다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error(), // message가 없는 에러
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      expect(screen.getByText('네트워크를 확인하고 다시 시도해주세요.')).toBeInTheDocument();
    });
  });

  describe('useNewsListModel 호출', () => {
    it('올바른 리소스 타입으로 훅을 호출한다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
      } as MockUseNewsListModel);

      render(<BlogListFeature />);

      expect(mockUseNewsListModel).toHaveBeenCalledWith('blogs');
    });
  });
});
