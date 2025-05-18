import { QueryClient } from '@tanstack/react-query';

/**
 * React Query 전역 QueryClient 인스턴스입니다.
 * staleTime, gcTime 등 기본 옵션을 설정합니다.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 5 * 60 * 1000, // 5분
    },
  },
});
