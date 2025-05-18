import type { PaginatedArticleList } from '@/entities/article/api/types';

import { getArticles } from '@/entities/article/api/getArticles';
import { useQuery } from '@tanstack/react-query';

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
