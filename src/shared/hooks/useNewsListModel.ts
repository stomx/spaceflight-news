import { getPaginatedList } from '@/shared/api/getPaginatedList';
import { DEFAULT_LIMIT } from '@/shared/config';
import type { NewsListSearch, Paginated } from '@/shared/types/news';
import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';

/**
 * 뉴스/블로그 등 모든 도메인에서 사용 가능한 제네릭 리스트 모델 훅
 * @param resource API 리소스명(예: 'articles', 'blogs')
 */
export type UseNewsListModelReturn<T> = {
  data: Paginated<T> | null | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  page: number;
  limit: number;
  totalPages: number;
  offset: number;
  search: NewsListSearch;
  refetch: () => void;
  isSuccess: boolean;
  status: 'pending' | 'error' | 'success';
};

export function useNewsListModel<T>(resource: 'articles' | 'blogs' | 'reports'): UseNewsListModelReturn<T> {
  const search: NewsListSearch = useSearch({ from: `/${resource}` });
  const page = Number.parseInt(String(search.page), 10) || 1;
  const limit = Number.parseInt(String(search.limit), 10) || DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const queryKey = useMemo(() => [resource, { limit, offset }], [resource, limit, offset]);

  const queryResult = useQuery<Paginated<T>, Error>({
    queryKey,
    queryFn: () => getPaginatedList<T>(resource, { limit, offset }),
  });

  const totalPages = useMemo(() => {
    return queryResult.data ? Math.ceil(queryResult.data.count / limit) : 0;
  }, [queryResult.data, limit]);

  const model: UseNewsListModelReturn<T> = {
    ...queryResult,
    data: queryResult.data ?? null,
    page,
    limit,
    totalPages,
    offset,
    search,
    refetch: queryResult.refetch,
    isSuccess: queryResult.isSuccess,
    status: queryResult.status,
  };

  return model;
}
