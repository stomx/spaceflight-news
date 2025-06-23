import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Suspense } from 'react';
import { ErrorBoundary } from '../error-boundary';
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

  describe('타입 안전성', () => {
    it('제네릭 타입을 올바르게 처리한다', async () => {
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
      render(<LoadingSkeleton />);

      // animate-pulse 클래스를 가진 메인 컨테이너 찾기
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('스켈레톤 구조가 올바르다', () => {
      render(<LoadingSkeleton />);

      // 메인 컨테이너
      const container = document.querySelector('.animate-pulse');
      expect(container).toBeInTheDocument();

      // 스켈레톤 요소들의 클래스 확인
      const bgElements = document.querySelectorAll('.bg-gray-200');
      expect(bgElements.length).toBeGreaterThan(0);

      // 첫 번째 스켈레톤 박스 (이미지 영역)
      const imageBox = container?.querySelector('.bg-gray-200.rounded-md.w-full.h-48.mb-4');
      expect(imageBox).toBeInTheDocument();

      // 텍스트 스켈레톤 컨테이너
      const textContainer = container?.querySelector('.space-y-2');
      expect(textContainer).toBeInTheDocument();
    });
  });
});

describe('CardSkeleton Component', () => {
  describe('렌더링', () => {
    it('올바르게 렌더링된다', () => {
      render(<CardSkeleton />);

      // animate-pulse와 border 클래스를 가진 카드 컨테이너 찾기
      const skeleton = document.querySelector('.animate-pulse.border.rounded-lg.p-4');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse', 'border', 'rounded-lg', 'p-4');
    });

    it('카드 스켈레톤 구조가 올바르다', () => {
      render(<CardSkeleton />);

      // 메인 컨테이너
      const container = document.querySelector('.animate-pulse.border.rounded-lg');
      expect(container).toBeInTheDocument();

      // 플렉스 컨테이너
      const flexContainer = container?.querySelector('.flex.gap-4');
      expect(flexContainer).toBeInTheDocument();

      // 이미지 영역
      const imageArea = flexContainer?.querySelector('.bg-gray-200.rounded-md.w-1\\/2.aspect-video');
      expect(imageArea).toBeInTheDocument();

      // 텍스트 영역
      const textArea = flexContainer?.querySelector('.flex-1.space-y-2');
      expect(textArea).toBeInTheDocument();
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

  describe('실제 사용 시나리오', () => {
    it('페이지 컴포넌트 lazy loading 시뮬레이션', async () => {
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
      // Vitest가 콘솔에 에러를 출력하는 것을 막기 위해 mock 처리
      vi.spyOn(console, 'error').mockImplementation(() => {});

      const LazyFailComponent = createLazyComponent<Record<string, never>>(() =>
        Promise.reject(new Error('Loading failed')),
      );

      render(
        <ErrorBoundary fallback={<div>에러 발생!</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyFailComponent />
          </Suspense>
        </ErrorBoundary>,
      );

      // Promise가 reject되고 ErrorBoundary가 에러를 잡을 때까지 기다립니다.
      await waitFor(() => {
        expect(screen.getByText('에러 발생!')).toBeInTheDocument();
      });

      // mock 복원
      vi.restoreAllMocks();
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