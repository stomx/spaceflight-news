import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { ReportDetailFeature } from '../index';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Report } from '@/shared/types/news';

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
  useReportQuery: vi.fn(),
}));

vi.mock('@/entities/news/components/NewsDetail', () => ({
  NewsDetail: ({
    news,
    onExternalLinkClick,
  }: {
    news: Report;
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

import { useReportQuery } from '@/shared/hooks/useNewsQuery';

const mockUseReportQuery = vi.mocked(useReportQuery);

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

describe('ReportDetailFeature', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('테스트 모드', () => {
    it('reportId가 "test"일 때 더미 데이터를 표시한다', async () => {
      const user = userEvent.setup();
      
      // 테스트 모드에서도 useReportQuery는 호출되므로 mock 설정
      mockUseReportQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Report, Error>);
      
      render(<ReportDetailFeature reportId="test" />);

      expect(screen.getByText('⚠️ 테스트 모드: 더미 데이터가 표시되고 있습니다.')).toBeInTheDocument();
      expect(screen.getByTestId('news-detail')).toBeInTheDocument();
      expect(screen.getByText('Test Report')).toBeInTheDocument();
      expect(screen.getByText('This is a test report to verify the component works correctly.')).toBeInTheDocument();

      // 외부 링크 클릭 테스트
      const externalLinkButton = screen.getByTestId('external-link-button');
      await user.click(externalLinkButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('로딩 상태', () => {
    it('로딩 중일 때 로딩 메시지와 스피너를 표시한다', () => {
      mockUseReportQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
      } as UseQueryResult<Report, Error>);

      render(<ReportDetailFeature reportId="1" />);

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('보고서를 불러오는 중...')).toBeInTheDocument();
    });
  });

  describe('에러 상태', () => {
    it('에러 발생 시 에러 메시지와 뒤로가기 버튼을 표시한다', async () => {
      const user = userEvent.setup();
      
      mockUseReportQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('네트워크 오류가 발생했습니다'),
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
      } as UseQueryResult<Report, Error>);

      render(<ReportDetailFeature reportId="1" />);

      expect(screen.getByText('보고서를 찾을 수 없습니다')).toBeInTheDocument();
      expect(screen.getByText('네트워크 오류가 발생했습니다')).toBeInTheDocument();
      expect(screen.getByText('에러 상세 정보')).toBeInTheDocument();
      
      const backButton = screen.getByText('보고서 목록으로 돌아가기');
      expect(backButton).toBeInTheDocument();
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument();

      await user.click(backButton);
      expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    });

    it('기본 에러 메시지를 표시한다 (error.message가 없는 경우)', () => {
      mockUseReportQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: null,
        isPending: false,
        isSuccess: false,
        status: 'error' as const,
      } as UseQueryResult<Report, Error>);

      render(<ReportDetailFeature reportId="1" />);

      expect(screen.getByText('요청하신 보고서가 존재하지 않거나 일시적인 오류가 발생했습니다.')).toBeInTheDocument();
    });
  });

  describe('데이터 없음 상태', () => {
    it('보고서 데이터가 없을 때 적절한 메시지와 뒤로가기 버튼을 표시한다', async () => {
      const user = userEvent.setup();
      
      mockUseReportQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Report | null, Error>);

      render(<ReportDetailFeature reportId="1" />);

      expect(screen.getByText('보고서 정보가 없습니다.')).toBeInTheDocument();
      
      const backButton = screen.getByText('보고서 목록으로 돌아가기');
      expect(backButton).toBeInTheDocument();

      await user.click(backButton);
      expect(mockHistoryBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('성공 상태', () => {
    const mockReport: Report = {
      id: 1,
      title: '테스트 보고서',
      summary: '테스트 보고서 요약',
      url: 'https://example.com/report/1',
      image_url: 'https://example.com/report1.jpg',
      published_at: '2024-01-01T00:00:00Z',
      news_site: '테스트 보고서 사이트',
      updated_at: '2024-01-01T00:00:00Z',
      authors: [],
      type: 'report' as const,
    };

    it('보고서 데이터를 성공적으로 렌더링한다', () => {
      mockUseReportQuery.mockReturnValue({
        data: mockReport,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Report, Error>);

      render(<ReportDetailFeature reportId="1" />);

      expect(screen.getByTestId('news-detail')).toBeInTheDocument();
      expect(screen.getByText('테스트 보고서')).toBeInTheDocument();
      expect(screen.getByText('테스트 보고서 요약')).toBeInTheDocument();
      expect(screen.getByTestId('external-link-button')).toBeInTheDocument();
    });

    it('외부 링크 클릭 시 새 탭에서 열린다', async () => {
      const user = userEvent.setup();
      
      mockUseReportQuery.mockReturnValue({
        data: mockReport,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Report, Error>);

      render(<ReportDetailFeature reportId="1" />);

      const externalLinkButton = screen.getByTestId('external-link-button');
      await user.click(externalLinkButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://example.com/report/1',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('올바른 컨테이너 구조를 가진다', () => {
      mockUseReportQuery.mockReturnValue({
        data: mockReport,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Report, Error>);

      const { container } = render(<ReportDetailFeature reportId="1" />);

      const wrapper = container.querySelector('div.container.mx-auto.px-4.py-6');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('useReportQuery 호출', () => {
    it('올바른 reportId로 훅을 호출한다', () => {
      mockUseReportQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isPending: true,
        isSuccess: false,
        status: 'pending' as const,
      } as UseQueryResult<Report, Error>);

      render(<ReportDetailFeature reportId="123" />);

      expect(mockUseReportQuery).toHaveBeenCalledWith('123');
    });

    it('테스트 모드에서도 훅을 호출한다', () => {
      mockUseReportQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
        isPending: false,
        isSuccess: true,
        status: 'success' as const,
      } as UseQueryResult<Report, Error>);

      render(<ReportDetailFeature reportId="test" />);

      expect(mockUseReportQuery).toHaveBeenCalledWith('test');
    });
  });
});
