import type { Article } from '@/shared/types/news';
import { usePaginatedListQuery } from '@/shared/hooks/usePaginatedListQuery';

export function useArticlesQuery(params: { limit: number; offset: number }) {
  return usePaginatedListQuery<Article>('articles', params);
}