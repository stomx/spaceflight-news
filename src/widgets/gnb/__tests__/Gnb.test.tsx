import { useMatchRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Gnb } from '../ui/Gnb';

// Mock dependencies
vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useMatchRoute: vi.fn(),
  useNavigate: vi.fn(),
  useSearch: vi.fn(),
}));

vi.mock('@heroicons/react/24/outline', () => ({
  ArrowLeftIcon: () => <span data-testid="arrow-left-icon">ArrowLeft</span>,
}));

vi.mock('@/shared/components/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/shared/lib/utils', () => ({
  cleanSearchParams: vi.fn((search, page, limit) => ({ ...search, page, limit })),
}));

vi.mock('@/shared/config', () => ({
  DEFAULT_LIMIT: 10,
}));

// Get mocked functions
const mockUseMatchRoute = vi.mocked(useMatchRoute);
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseSearch = vi.mocked(useSearch);

describe('Gnb Component', () => {
  const mockMatchRoute = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearch.mockReturnValue({
      page: 1,
      limit: 10,
    });
    mockUseMatchRoute.mockReturnValue(mockMatchRoute);
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  describe('기본 렌더링', () => {
    it('올바르게 렌더링된다', () => {
      mockMatchRoute.mockReturnValue(false);

      render(<Gnb />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Articles')).toBeInTheDocument();
      expect(screen.getByText('Blogs')).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('메뉴 링크가 올바른 to 속성을 가진다', () => {
      mockMatchRoute.mockReturnValue(false);

      render(<Gnb />);

      expect(screen.getByText('Articles').closest('a')).toHaveAttribute('href', '/articles');
      expect(screen.getByText('Blogs').closest('a')).toHaveAttribute('href', '/blogs');
      expect(screen.getByText('Reports').closest('a')).toHaveAttribute('href', '/reports');
    });
  });

  describe('상세 페이지 상태', () => {
    it('기사 상세 페이지에서 뒤로가기 버튼을 표시한다', () => {
      mockMatchRoute.mockImplementation((options: any) => {
        return options.to === '/articles/$articleId';
      });

      render(<Gnb />);

      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
      expect(screen.getByText('기사 목록으로 돌아가기')).toBeInTheDocument();
    });

    it('블로그 상세 페이지에서 뒤로가기 버튼을 표시한다', () => {
      mockMatchRoute.mockImplementation((options: any) => {
        return options.to === '/blogs/$blogId';
      });

      render(<Gnb />);

      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
      expect(screen.getByText('블로그 목록으로 돌아가기')).toBeInTheDocument();
    });

    it('보고서 상세 페이지에서 뒤로가기 버튼을 표시한다', () => {
      mockMatchRoute.mockImplementation((options: any) => {
        return options.to === '/reports/$reportId';
      });

      render(<Gnb />);

      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();
      expect(screen.getByText('보고서 목록으로 돌아가기')).toBeInTheDocument();
    });
  });

  describe('뒤로가기 기능', () => {
    it('기사 상세에서 뒤로가기 클릭 시 기사 목록으로 이동한다', async () => {
      const user = userEvent.setup();

      mockMatchRoute.mockImplementation((options: any) => {
        return options.to === '/articles/$articleId';
      });

      render(<Gnb />);

      const backButton = screen.getByText('기사 목록으로 돌아가기');
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/articles',
        search: { page: 1, limit: 10 },
      });
    });

    it('블로그 상세에서 뒤로가기 클릭 시 블로그 목록으로 이동한다', async () => {
      const user = userEvent.setup();

      mockMatchRoute.mockImplementation((options: any) => {
        return options.to === '/blogs/$blogId';
      });

      render(<Gnb />);

      const backButton = screen.getByText('블로그 목록으로 돌아가기');
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/blogs',
        search: { page: 1, limit: 10 },
      });
    });

    it('보고서 상세에서 뒤로가기 클릭 시 보고서 목록으로 이동한다', async () => {
      const user = userEvent.setup();

      mockMatchRoute.mockImplementation((options: any) => {
        return options.to === '/reports/$reportId';
      });

      render(<Gnb />);

      const backButton = screen.getByText('보고서 목록으로 돌아가기');
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/reports',
        search: { page: 1, limit: 10 },
      });
    });
  });

  describe('검색 파라미터 보존', () => {
    it('뒤로가기 시 기존 검색 파라미터를 보존한다', async () => {
      const user = userEvent.setup();

      mockUseSearch.mockReturnValue({
        page: 2,
        limit: 20,
        category: 'tech',
      });

      mockMatchRoute.mockImplementation((options: any) => {
        return options.to === '/articles/$articleId';
      });

      render(<Gnb />);

      const backButton = screen.getByText('기사 목록으로 돌아가기');
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/articles',
        search: { page: 2, limit: 20, category: 'tech' },
      });
    });
  });

  describe('목록 페이지 상태', () => {
    it('목록 페이지에서는 뒤로가기 버튼을 표시하지 않는다', () => {
      mockMatchRoute.mockReturnValue(false);

      render(<Gnb />);

      expect(screen.queryByTestId('arrow-left-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('기사 목록으로 돌아가기')).not.toBeInTheDocument();
      expect(screen.queryByText('블로그 목록으로 돌아가기')).not.toBeInTheDocument();
      expect(screen.queryByText('보고서 목록으로 돌아가기')).not.toBeInTheDocument();
    });
  });
});
