/**
 * Spaceflight News API 기사 목록을 limit/offset 기반으로 조회하는 커스텀 훅입니다.
 */
import { useQuery } from '@tanstack/react-query';
import { getArticles } from '@/entities/article/api/getArticles';
import type { PaginatedArticleList } from '@/entities/article/api/types';

export interface ArticleListQueryParams {
  limit: number;
  offset: number;
}

export function useArticlesQuery(params: ArticleListQueryParams) {
  return useQuery<PaginatedArticleList, Error>({
    queryKey: ['articles', params],
    queryFn: () => getArticles(params),
  });
}
