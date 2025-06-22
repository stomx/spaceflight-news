import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route } from '../reports/index';

// Mock dependencies
vi.mock('@/features/report-list', () => ({
  ReportListFeature: () => <div data-testid="report-list">Report List</div>,
}));

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn((path) => (config: any) => ({
    component: config.component,
    path,
  })),
}));

describe('Reports Index Page', () => {
  const ReportsComponent = (Route as any).component;

  describe('라우트 설정', () => {
    it('올바른 경로로 설정된다', () => {
      expect((Route as any).path).toBe('/reports/');
    });
  });

  describe('컴포넌트 렌더링', () => {
    it('ReportListFeature를 렌더링한다', () => {
      render(<ReportsComponent />);

      expect(screen.getByTestId('report-list')).toBeInTheDocument();
      expect(screen.getByText('Report List')).toBeInTheDocument();
    });

    it('익명 함수 컴포넌트로 ReportListFeature를 래핑한다', () => {
      // reports의 경우 component가 익명 함수로 되어 있음을 확인
      expect(typeof ReportsComponent).toBe('function');

      render(<ReportsComponent />);
      expect(screen.getByTestId('report-list')).toBeInTheDocument();
    });
  });
});
