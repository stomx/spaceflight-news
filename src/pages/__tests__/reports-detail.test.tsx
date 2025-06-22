import { useParams } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route } from '../reports/$reportId';

// Mock dependencies
vi.mock('@/features/report-detail', () => ({
  ReportDetailFeature: ({ reportId }: { reportId: string }) => (
    <div data-testid="report-detail">Report Detail: {reportId}</div>
  ),
}));

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn((path) => (config: any) => ({
    component: config.component,
    path,
  })),
  useParams: vi.fn(),
}));

const mockUseParams = vi.mocked(useParams);

describe('Report Detail Page', () => {
  const ReportDetailComponent = (Route as any).component;

  describe('라우트 설정', () => {
    it('올바른 경로로 설정된다', () => {
      expect((Route as any).path).toBe('/reports/$reportId');
    });
  });

  describe('컴포넌트 렌더링', () => {
    it('ReportDetailFeature를 reportId와 함께 렌더링한다', () => {
      mockUseParams.mockReturnValue({ reportId: 'test-report-789' });

      render(<ReportDetailComponent />);

      expect(screen.getByTestId('report-detail')).toBeInTheDocument();
      expect(screen.getByText('Report Detail: test-report-789')).toBeInTheDocument();
    });

    it('useParams에서 올바른 from 경로를 사용한다', () => {
      mockUseParams.mockReturnValue({ reportId: 'another-report' });

      render(<ReportDetailComponent />);

      expect(mockUseParams).toHaveBeenCalledWith({ from: '/reports/$reportId' });
    });
  });
});
