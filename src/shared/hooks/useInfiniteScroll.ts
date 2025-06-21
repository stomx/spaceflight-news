import { useCallback, useEffect, useState } from 'react';
import type { UseInfiniteQueryResult, InfiniteData } from '@tanstack/react-query';

interface UseInfiniteScrollProps<T> {
  query: UseInfiniteQueryResult<InfiniteData<{ count: number; results: T[] }>, Error>;
  threshold?: number;
  enabled?: boolean;
}

export function useInfiniteScroll<T>({
  query,
  threshold = 1000,
  enabled = true
}: UseInfiniteScrollProps<T>) {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (!enabled || query.isFetching || query.isFetchingNextPage || !query.hasNextPage) {
      return;
    }

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      setIsFetching(true);
      query.fetchNextPage().finally(() => setIsFetching(false));
    }
  }, [enabled, query, threshold]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, enabled]);

  return {
    items: query.data?.pages.flatMap((page: { count: number; results: T[] }) => page.results) || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingMore: query.isFetchingNextPage || isFetching,
    hasNextPage: query.hasNextPage,
    totalCount: query.data?.pages[0]?.count || 0,
  };
}
