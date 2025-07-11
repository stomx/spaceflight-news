import { type ComponentType, Suspense, lazy } from 'react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function LazyWrapper({ fallback = <div>Loading...</div>, children }: LazyComponentProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

// 동적 임포트 헬퍼 함수
export function createLazyComponent<P extends Record<string, unknown> = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode,
) {
  const LazyComponent = lazy(importFn);

  return function WrappedLazyComponent(props: P) {
    return (
      <Suspense fallback={fallback || <div>Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// 미리 정의된 스켈레톤 컴포넌트들
export const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-md w-full h-48 mb-4" />
    <div className="space-y-2">
      <div className="bg-gray-200 rounded h-4 w-3/4" />
      <div className="bg-gray-200 rounded h-4 w-1/2" />
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="animate-pulse border rounded-lg p-4">
    <div className="flex gap-4">
      <div className="bg-gray-200 rounded-md w-1/2 aspect-video" />
      <div className="flex-1 space-y-2">
        <div className="bg-gray-200 rounded h-6 w-3/4" />
        <div className="bg-gray-200 rounded h-4 w-full" />
        <div className="bg-gray-200 rounded h-4 w-2/3" />
        <div className="bg-gray-200 rounded h-3 w-1/2" />
      </div>
    </div>
  </div>
);
