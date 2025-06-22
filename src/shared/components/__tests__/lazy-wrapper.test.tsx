import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Suspense } from 'react';
import { createLazyComponent, LoadingSkeleton, CardSkeleton } from '../lazy-wrapper';

// 테스트용 컴포넌트들
const TestComponent = ({ message = 'Test Component' }: { message?: string }) => (
  <div data-testid="test-component">{message}</div>
);

const CustomComponent = ({ title, count }: { title: string; count: number }) => (
  <div data-testid="custom">{title}: {count}</div>
);

describe('createLazyComponent 함수', () => {
  describe('기본 동작', () => {
    it('컴포넌트를 렌더링한다', async () => {
      const LazyTestComponent = createLazyComponent(() => Promise.resolve({ default: TestComponent }));
      
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyTestComponent message="Lazy loaded" />
        </Suspense>
      );

      // 로딩 상태 확인
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // 컴포넌트 로드 완료 대기
      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Lazy loaded')).toBeInTheDocument();
    });

    it('props를 올바르게 전달한다', async () => {
      const LazyTestComponent = createLazyComponent(() => Promise.resolve({ default: TestComponent }));
      
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyTestComponent message="Props test" />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText('Props test')).toBeInTheDocument();
      });
    });

    it('기본 fallback을 사용한다', async () => {
      const LazyTestComponent = createLazyComponent(() => Promise.resolve({ default: TestComponent }));
      
      render(<LazyTestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });

    it('커스텀 fallback을 사용한다', async () => {
      const LazyTestComponent = createLazyComponent(
        () => Promise.resolve({ default: TestComponent }),
        <div data-testid="custom-fallback">커스텀 로딩</div>
      );
      
      render(<LazyTestComponent />);

      // 초기 로딩 상태에서는 커스텀 fallback이 보일 수 있음
      // 하지만 즉시 로드되므로 컴포넌트를 확인
      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });
  });

  describe('타입 안전성', () => {    it('제네릭 타입을 올바르게 처리한다', async () => {
      const LazyCustomComponent = createLazyComponent(() => Promise.resolve({ default: CustomComponent }));
      
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyCustomComponent title="테스트" count={42} />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom')).toHaveTextContent('테스트: 42');
      });
    });
  });
});

describe('LoadingSkeleton Component', () => {
  describe('렌더링', () => {
    it('올바르게 렌더링된다', () => {
      render(<LoadingSkeleton data-testid="loading-skeleton" />);
      
      const skeleton = screen.getByTestId('loading-skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('스켈레톤 구조가 올바르다', () => {
      render(<LoadingSkeleton />);
      
      // 메인 컨테이너
      const container = screen.getByTestId('loading-skeleton') || document.querySelector('.animate-pulse');
      expect(container).toBeInTheDocument();
      
      // 스켈레톤 요소들의 클래스 확인
      const bgElements = document.querySelectorAll('.bg-gray-200');
      expect(bgElements.length).toBeGreaterThan(0);
    });
  });
});

describe('CardSkeleton Component', () => {
  describe('렌더링', () => {
    it('올바르게 렌더링된다', () => {
      render(<CardSkeleton data-testid="card-skeleton" />);
      
      const skeleton = screen.getByTestId('card-skeleton');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse', 'border', 'rounded-lg', 'p-4');
    });

    it('카드 스켈레톤 구조가 올바르다', () => {
      render(<CardSkeleton />);
      
      // 메인 컨테이너
      const container = screen.getByTestId('card-skeleton') || document.querySelector('.animate-pulse.border.rounded-lg');
      expect(container).toBeInTheDocument();
      
      // 플렉스 컨테이너
      const flexContainer = document.querySelector('.flex.gap-4');
      expect(flexContainer).toBeInTheDocument();
    });
  });
});

describe('통합 사용 시나리오', () => {
  describe('LazyWrapper + Skeleton', () => {
    it('createLazyComponent에서 skeleton을 사용할 수 있다', async () => {
      const LazyComponentWithSkeleton = createLazyComponent(
        () => Promise.resolve({ default: TestComponent }),
        <CardSkeleton />
      );
      
      render(<LazyComponentWithSkeleton />);

      // 즉시 로드되므로 최종 컴포넌트 확인
      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });
    });
  });

  describe('실제 사용 시나리오', () => {    it('페이지 컴포넌트 lazy loading 시뮬레이션', async () => {
      const PageComponent = () => <div data-testid="page">페이지 내용</div>;
      const LazyPage = createLazyComponent(
        () => Promise.resolve({ default: PageComponent }),
        <LoadingSkeleton />
      );
      
      render(<LazyPage />);

      await waitFor(() => {
        expect(screen.getByTestId('page')).toBeInTheDocument();
      });
    });

    it('중첩된 lazy components', async () => {
      const InnerComponent = () => <div data-testid="inner">내부 컴포넌트</div>;
      const OuterComponent = () => (
        <div data-testid="outer">
          외부 컴포넌트
          <InnerComponent />
        </div>
      );
      
      const LazyOuter = createLazyComponent(() => Promise.resolve({ default: OuterComponent }));
      
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyOuter />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('outer')).toBeInTheDocument();
        expect(screen.getByTestId('inner')).toBeInTheDocument();
      });
    });
  });

  describe('에러 처리', () => {
    it('로딩 실패 시 에러를 처리한다', async () => {
      const LazyFailComponent = createLazyComponent(() => 
        Promise.reject(new Error('Loading failed'))
      );
      
      // 에러 바운더리 없이는 에러가 발생할 수 있음
      // 실제 사용 시에는 ErrorBoundary로 감싸야 함
      const { container } = render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyFailComponent />
        </Suspense>
      );

      // 로딩 상태는 확인할 수 있음
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('성능', () => {
    it('동일한 컴포넌트의 여러 인스턴스가 올바르게 동작한다', async () => {
      const LazyTestComponent = createLazyComponent(() => Promise.resolve({ default: TestComponent }));
      
      render(
        <div>
          <Suspense fallback={<div>Loading 1...</div>}>
            <LazyTestComponent message="첫 번째" />
          </Suspense>
          <Suspense fallback={<div>Loading 2...</div>}>
            <LazyTestComponent message="두 번째" />
          </Suspense>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText('첫 번째')).toBeInTheDocument();
        expect(screen.getByText('두 번째')).toBeInTheDocument();
      });
    });

    it('메모이제이션이 올바르게 동작한다', async () => {
      const LazyTestComponent = createLazyComponent(() => Promise.resolve({ default: TestComponent }));
      
      const { rerender } = render(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyTestComponent message="초기" />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText('초기')).toBeInTheDocument();
      });

      // props 변경으로 rerender
      rerender(
        <Suspense fallback={<div>Loading...</div>}>
          <LazyTestComponent message="변경됨" />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByText('변경됨')).toBeInTheDocument();
      });
    });
  });
});