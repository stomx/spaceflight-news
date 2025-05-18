/**
 * 기사 목록을 react-query로 조회하는 커스텀 훅입니다.
 * @param params - page, page_size 등 쿼리 파라미터
 */
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/entities/article/api/getArticles';
import type { PaginatedArticleList } from '@/entities/article/api/types';

export function useArticlesQuery(params?: Record<string, string | number>) {
  // page, page_size 등 주요 파라미터만 queryKey에 명시적으로 포함
  const page = params?.page ?? 1;
  const pageSize = params?.page_size ?? 10;
  return useQuery<PaginatedArticleList, Error>({
    queryKey: ['articles', page, pageSize],
    queryFn: () => getArticles({ ...params, page, page_size: pageSize }),
  });
}
