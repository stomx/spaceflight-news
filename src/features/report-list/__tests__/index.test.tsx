import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { ComponentProps } from 'react';
import type { Report, Paginated, NewsListSearch } from '@/shared/types/news';
import type { NewsListProps } from '@/entities/news/components/NewsList';
import type { NewsCardProps } from '@/entities/news/components/NewsCard';
import { ReportListFeature } from '../index';
import type { UseNewsListModelReturn } from '@/shared/hooks/useNewsListModel';

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
  NewsList: ({ items, renderItem, emptyText, page, totalPages, onPageChange }: NewsListProps<Report>) => (
    <div data-testid="news-list">
      {items.length === 0 ? (
        <div>{emptyText}</div>
      ) : (
        <>
          {items.map(renderItem)}
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
  NewsCard: ({ title, summary, onClick, children }: NewsCardProps) => (
    <div data-testid="news-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{summary}</p>
      {children}
    </div>
  ),
}));

import { useNavigate } from '@tanstack/react-router';
import { useNewsListModel } from '@/shared/hooks/useNewsListModel';

const mockNavigate = vi.mocked(useNavigate);
const mockUseNewsListModel = vi.mocked(useNewsListModel);

const createMockNewsListModelValue = (
  overrides: Partial<UseNewsListModelReturn<Report>>,
): UseNewsListModelReturn<Report> => {
  const defaults: UseNewsListModelReturn<Report> = {
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    isPending: false,
    isSuccess: true,
    page: 1,
    limit: 10,
    totalPages: 1,
    search: {},
    offset: 0,
    refetch: vi.fn(),
    status: 'success',
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetching: false,
    isStale: false,
    isRefetchError: false,
    fetchStatus: 'idle',
    remove: vi.fn(),
  };
  return { ...defaults, ...overrides };
};

describe('ReportListFeature', () => {
  const mockNavigateFunction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReturnValue(mockNavigateFunction);
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 스켈레톤을 표시한다', () => {
      mockUseNewsListModel.mockReturnValue(
        createMockNewsListModelValue({
          isLoading: true,
          isPending: true,
          isSuccess: false,
          status: 'pending',
        }),
      );

      render(<ReportListFeature />);

      expect(screen.getByTestId('news-list-skeleton')).toBeInTheDocument();
      expect(screen.getByText('Loading 10 items...')).toBeInTheDocument();
    });
  });

  describe('에러 상태', () => {
    it('에러 발생 시 에러 메시지를 표시한다', () => {
      mockUseNewsListModel.mockReturnValue(
        createMockNewsListModelValue({
          isError: true,
          error: new Error('네트워크 오류가 발생했습니다'),
          isSuccess: false,
          status: 'error',
        }),
      );

      render(<ReportListFeature />);

      expect(screen.getByText('보고서를 불러올 수 없습니다')).toBeInTheDocument();
      expect(screen.getByText('네트워크 오류가 발생했습니다')).toBeInTheDocument();
    });

    it('에러 객체에 메시지가 없으면 기본 에러 메시지를 표시한다', () => {
      mockUseNewsListModel.mockReturnValue(
        createMockNewsListModelValue({
          isError: true,
          error: new Error(), // No message
          isSuccess: false,
          status: 'error',
        }),
      );

      render(<ReportListFeature />);

      expect(screen.getByText('보고서를 불러올 수 없습니다')).toBeInTheDocument();
      expect(screen.getByText('네트워크를 확인하고 다시 시도해주세요.')).toBeInTheDocument();
    });
  });

  describe('성공 상태', () => {
    const mockReports: Report[] = [
      {
        id: 1,
        title: '테스트 보고서 1',
        summary: '테스트 보고서 1 요약',
        image_url: 'https://example.com/report1.jpg',
        published_at: '2024-01-01T00:00:00Z',
        news_site: '테스트 보고서',
        url: 'https://example.com/report1',
        featured: false,
        authors: [],
        updated_at: '2024-01-01T00:00:00Z',
        launches: [],
        events: [],
      },
      {
        id: 2,
        title: '테스트 보고서 2',
        summary: '테스트 보고서 2 요약',
        image_url: 'https://example.com/report2.jpg',
        published_at: '2024-01-02T00:00:00Z',
        news_site: '테스트 보고서 2',
        url: 'https://example.com/report2',
        featured: false,
        authors: [],
        updated_at: '2024-01-02T00:00:00Z',
        launches: [],
        events: [],
      },
    ];

    const mockPaginatedData: Paginated<Report> = {
      results: mockReports,
      count: 20,
      next: 'https://api.spaceflightnewsapi.net/v4/reports?limit=10&offset=10',
      previous: null,
    };

    it('데이터가 있을 때 보고서 리스트를 렌더링한다', () => {
      mockUseNewsListModel.mockReturnValue(
        createMockNewsListModelValue({
          data: mockPaginatedData,
          isSuccess: true,
          status: 'success',
          totalPages: 3,
        }),
      );

      render(<ReportListFeature />);

      expect(screen.getByTestId('news-list')).toBeInTheDocument();
      expect(screen.getByText('테스트 보고서 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 보고서 2')).toBeInTheDocument();
    });

    it('보고서 클릭 시 상세 페이지로 이동한다', async () => {
      const user = userEvent.setup();
      const search: NewsListSearch = { page: 2, limit: 5, category: 'tech' };
      mockUseNewsListModel.mockReturnValue(
        createMockNewsListModelValue({
          data: mockPaginatedData,
          isSuccess: true,
          status: 'success',
          page: 2,
          limit: 5,
          totalPages: 3,
          search,
          offset: 5,
        }),
      );

      render(<ReportListFeature />);

      const firstReport = screen.getAllByTestId('news-card')[0];
      await user.click(firstReport);

      expect(mockNavigateFunction).toHaveBeenCalledWith({
        to: '/reports/1',
        search: { category: 'tech', page: 2, limit: 5 },
      });
    });

    it('빈 결과일 때 적절한 메시지를 표시한다', () => {
      const emptyPaginatedData: Paginated<Report> = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };

      mockUseNewsListModel.mockReturnValue(
        createMockNewsListModelValue({
          data: emptyPaginatedData,
          isSuccess: true,
          status: 'success',
          totalPages: 0,
        }),
      );

      render(<ReportListFeature />);

      expect(screen.getByText('표시할 보고서가 없습니다.')).toBeInTheDocument();
    });

    it('페이지네이션 "다음" 버튼을 클릭하면 URL이 업데이트된다', async () => {
      const user = userEvent.setup();
      const search: NewsListSearch = { category: 'tech' };
      mockUseNewsListModel.mockReturnValue(
        createMockNewsListModelValue({
          data: mockPaginatedData,
          isSuccess: true,
          status: 'success',
          page: 2,
          limit: 5,
          totalPages: 3,
          search,
          offset: 5,
        }),
      );

      render(<ReportListFeature />);

      const nextButton = screen.getByRole('button', { name: '다음' });
      await user.click(nextButton);

      expect(mockNavigateFunction).toHaveBeenCalledWith({
        search: { category: 'tech', page: 3, limit: 5 },
      });
    });
  });

  describe('데이터 없음 상태', () => {
    it('데이터가 null일 때 적절한 메시지를 표시한다', () => {
      mockUseNewsListModel.mockReturnValue(
        createMockNewsListModelValue({
          data: null,
          isSuccess: true,
          status: 'success',
        }),
      );

      render(<ReportListFeature />);

      expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
    });
  });
});
