import type { Article } from '@/shared/types/news';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ButtonHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NewsPaginatedList } from '../NewsPaginatedList';

// Mock TanStack Router hooks
const mockNavigate = vi.fn();
const mockUseSearch = vi.fn();

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
}));

// Mock Button component
vi.mock('@/shared/components/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
    ...props
  }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`button ${variant} ${disabled ? 'disabled' : ''}`}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock components to be passed to NewsPaginatedList
const MockListComponent = ({ items }: { items: Article[] }) => (
  <div data-testid="news-list">
    {items.map((item) => (
      <div key={item.id} data-testid="news-item">
        {item.title}
      </div>
    ))}
  </div>
);

const MockSkeletonComponent = () => <div data-testid="skeleton">Loading...</div>;

// Mock data
const mockArticles: Article[] = [
  {
    id: 1,
    title: '테스트 아티클 1',
    summary: '테스트 요약 1',
    image_url: 'https://example.com/image1.jpg',
    url: 'https://example.com/article1',
    news_site: 'Test Site',
    published_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
    featured: false,
    authors: [],
    launches: [],
    events: [],
  },
  {
    id: 2,
    title: '테스트 아티클 2',
    summary: '테스트 요약 2',
    image_url: 'https://example.com/image2.jpg',
    url: 'https://example.com/article2',
    news_site: 'Test Site',
    published_at: '2024-01-02T10:00:00Z',
    updated_at: '2024-01-02T10:00:00Z',
    featured: true,
    authors: [],
    launches: [],
    events: [],
  },
];

describe('NewsPaginatedList Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
  };

  describe('로딩 상태', () => {
    it('로딩 중일 때 스켈레톤 컴포넌트를 표시한다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('에러 상태', () => {
    it('에러 발생 시 에러 메시지를 표시한다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('테스트 에러'),
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(screen.getByText('에러 발생: 테스트 에러')).toBeInTheDocument();
    });

    it('에러 객체가 없을 때 빈 메시지를 표시한다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(screen.getByText('에러 발생:')).toBeInTheDocument();
    });
  });

  describe('데이터 없음 상태', () => {
    it('데이터가 없을 때 메시지를 표시한다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(screen.getByText('데이터가 없습니다.')).toBeInTheDocument();
    });
  });

  describe('성공 상태', () => {
    it('데이터가 있을 때 리스트 컴포넌트를 렌더링한다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(screen.getByTestId('news-list')).toBeInTheDocument();
      expect(screen.getByText('테스트 아티클 1')).toBeInTheDocument();
      expect(screen.getByText('테스트 아티클 2')).toBeInTheDocument();
    });

    it('페이지네이션 버튼들을 렌더링한다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '다음' })).toBeInTheDocument();
      expect(screen.getByText('1 / 3')).toBeInTheDocument(); // 25 items, 10 per page = 3 pages
    });
  });

  describe('페이지네이션', () => {
    it('첫 번째 페이지에서 이전 버튼이 비활성화된다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      const prevButton = screen.getByRole('button', { name: '이전' });
      expect(prevButton).toBeDisabled();
    });

    it('마지막 페이지에서 다음 버튼이 비활성화된다', () => {
      mockUseSearch.mockReturnValue({ page: 3 });

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      const nextButton = screen.getByRole('button', { name: '다음' });
      expect(nextButton).toBeDisabled();
    });

    it('데이터가 없을 때 다음 버튼이 비활성화된다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 0,
          results: [],
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      const nextButton = screen.getByRole('button', { name: '다음' });
      expect(nextButton).toBeDisabled();
      expect(screen.getByText('1 / 1')).toBeInTheDocument();
    });
  });

  describe('URL 파라미터 처리', () => {
    it('URL의 page 파라미터를 올바르게 처리한다', () => {
      mockUseSearch.mockReturnValue({ page: 2 });

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(mockUseQuery).toHaveBeenCalledWith({
        limit: 10,
        offset: 10, // page 2, offset = (2-1) * 10
      });

      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('URL의 limit 파라미터를 올바르게 처리한다', () => {
      mockUseSearch.mockReturnValue({ page: 1, limit: 5 });

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(mockUseQuery).toHaveBeenCalledWith({
        limit: 5,
        offset: 0,
      });

      expect(screen.getByText('1 / 5')).toBeInTheDocument(); // 25 items, 5 per page = 5 pages
    });

    it('기본값을 올바르게 사용한다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      expect(mockUseQuery).toHaveBeenCalledWith({
        limit: 10, // default limit
        offset: 0, // page 1, offset = 0
      });
    });

    it('커스텀 기본 limit을 사용한다', () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
          defaultLimit={20}
        />,
      );

      expect(mockUseQuery).toHaveBeenCalledWith({
        limit: 20,
        offset: 0,
      });

      expect(screen.getByText('1 / 2')).toBeInTheDocument(); // 25 items, 20 per page = 2 pages
    });
  });

  describe('페이지 변경', () => {
    it('다음 버튼 클릭 시 navigate가 호출된다', async () => {
      mockUseSearch.mockReturnValue({});

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      const nextButton = screen.getByRole('button', { name: '다음' });
      fireEvent.click(nextButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        search: { page: 2, limit: 10 },
      });
    });

    it('이전 버튼 클릭 시 navigate가 호출된다', async () => {
      mockUseSearch.mockReturnValue({ page: 2 });

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      const prevButton = screen.getByRole('button', { name: '이전' });
      fireEvent.click(prevButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        search: { page: 1, limit: 10 },
      });
    });

    it('기존 search 파라미터를 유지한다', async () => {
      mockUseSearch.mockReturnValue({
        query: 'test',
        category: 'news',
      });

      const mockUseQuery = vi.fn().mockReturnValue({
        data: {
          count: 25,
          results: mockArticles,
        },
        isLoading: false,
        isError: false,
        error: null,
      });

      renderWithProviders(
        <NewsPaginatedList
          useQuery={mockUseQuery}
          ListComponent={MockListComponent}
          SkeletonComponent={MockSkeletonComponent}
        />,
      );

      const nextButton = screen.getByRole('button', { name: '다음' });
      fireEvent.click(nextButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        search: {
          query: 'test',
          category: 'news',
          page: 2,
          limit: 10,
        },
      });
    });
  });
});
