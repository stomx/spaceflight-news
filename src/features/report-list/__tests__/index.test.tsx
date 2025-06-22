import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ReportListFeature } from '../index';

// Mock dependencies - ArticleListFeature와 동일한 패턴
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@/shared/hooks/useNewsListModel', () => ({
  useNewsListModel: vi.fn(),
}));

vi.mock('@/entities/news/components/NewsCardSkeleton', () => ({
  NewsListSkeleton: ({ count }: { count: number }) => (
    <div data-testid="news-list-skeleton">Loading {count} items...</div>
  ),
}));

vi.mock('@/entities/news/components/NewsList', () => ({
  NewsList: ({ items, renderItem, emptyText, page, totalPages, onPageChange }: any) => (
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
  NewsCard: ({ title, summary, onClick, children }: any) => (
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

describe('ReportListFeature', () => {
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
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
        offset: 0,
      } as any);

      render(<ReportListFeature />);

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
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
        offset: 0,
      } as any);

      render(<ReportListFeature />);

      expect(screen.getByText('보고서를 불러올 수 없습니다')).toBeInTheDocument();
      expect(screen.getByText('네트워크 오류가 발생했습니다')).toBeInTheDocument();
    });
  });

  describe('성공 상태', () => {
    const mockReports = [
      {
        id: 1,
        title: '테스트 보고서 1',
        summary: '테스트 보고서 1 요약',
        image_url: 'https://example.com/report1.jpg',
        published_at: '2024-01-01T00:00:00Z',
        news_site: '테스트 보고서',
        url: 'https://example.com/report1',
      },
      {
        id: 2,
        title: '테스트 보고서 2',
        summary: '테스트 보고서 2 요약',
        image_url: 'https://example.com/report2.jpg',
        published_at: '2024-01-02T00:00:00Z',
        news_site: '테스트 보고서 2',
        url: 'https://example.com/report2',
      },
    ];

    const mockPaginatedData = {
      results: mockReports,
      count: 20,
      next: 'https://api.spaceflightnewsapi.net/v4/reports?limit=10&offset=10',
      previous: null,
    };

    it('데이터가 있을 때 보고서 리스트를 렌더링한다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: mockPaginatedData,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
        page: 1,
        limit: 10,
        totalPages: 3,
        search: {},
        offset: 0,
      } as any);

      render(<ReportListFeature />);

      expect(screen.getByTestId('news-list')).toBeInTheDocument();
      expect(screen.getByText('테스트 보고서 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 보고서 2')).toBeInTheDocument();
    });

    it('보고서 클릭 시 상세 페이지로 이동한다', async () => {
      const user = userEvent.setup();
      
      mockUseNewsListModel.mockReturnValue({
        data: mockPaginatedData,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
        page: 2,
        limit: 5,
        totalPages: 3,
        search: { category: 'tech' },
        offset: 5,
      } as any);

      render(<ReportListFeature />);

      const firstReport = screen.getAllByTestId('news-card')[0];
      await user.click(firstReport);

      expect(mockNavigateFunction).toHaveBeenCalledWith({
        to: '/reports/1',
        search: { category: 'tech', page: 2, limit: 5 },
      });
    });

    it('빈 결과일 때 적절한 메시지를 표시한다', () => {
      const emptyPaginatedData = {
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
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
        offset: 0,
      } as any);

      render(<ReportListFeature />);

      expect(screen.getByText('표시할 보고서가 없습니다.')).toBeInTheDocument();
    });
  });

  describe('데이터 없음 상태', () => {
    it('데이터가 null일 때 적절한 메시지를 표시한다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
        offset: 0,
      } as any);

      render(<ReportListFeature />);

      expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
    });
  });

  describe('useNewsListModel 호출', () => {
    it('올바른 리소스 타입으로 훅을 호출한다', () => {
      mockUseNewsListModel.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
        page: 1,
        limit: 10,
        totalPages: 0,
        search: {},
        offset: 0,
      } as any);

      render(<ReportListFeature />);

      expect(mockUseNewsListModel).toHaveBeenCalledWith('reports');
    });
  });
});
