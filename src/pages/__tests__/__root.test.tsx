import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Route } from '../__root';

// Mock dependencies
vi.mock('@/widgets/gnb/ui/Gnb', () => ({
  Gnb: () => <nav data-testid="gnb">Global Navigation</nav>,
}));

vi.mock('@tanstack/react-router', () => ({
  Outlet: () => <div data-testid="outlet">Page Content</div>,
  createRootRoute: vi.fn((config) => ({
    component: config.component,
  })),
}));

describe('Root Page Component', () => {
  // Mock된 Route가 component 속성을 가지고 있음을 타입 단언
  const RootComponent = (Route as any).component;

  describe('기본 렌더링', () => {
    it('올바르게 렌더링된다', () => {
      render(<RootComponent />);

      expect(screen.getByTestId('gnb')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    it('적절한 레이아웃 구조를 가진다', () => {
      render(<RootComponent />);

      const container = screen.getByTestId('outlet').parentElement;
      expect(container).toHaveClass('flex', 'flex-col', 'justify-center', 'gap-2', 'p-4');
    });
  });

  describe('구조 검증', () => {
    it('Gnb가 Outlet 보다 먼저 렌더링된다', () => {
      render(<RootComponent />);

      const gnb = screen.getByTestId('gnb');
      const outlet = screen.getByTestId('outlet');

      expect(gnb.compareDocumentPosition(outlet)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('전체 컨텐츠를 포함하는 Fragment가 렌더링된다', () => {
      render(<RootComponent />);

      // Fragment는 DOM에 직접 나타나지 않지만, 자식 요소들이 형제 노드로 렌더링됨
      expect(screen.getByTestId('gnb')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });
  });
});
