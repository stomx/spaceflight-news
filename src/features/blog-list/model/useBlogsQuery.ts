import type { Blog } from '@/shared/types/news';
import { usePaginatedListQuery } from '@/shared/hooks/usePaginatedListQuery';

export function useBlogsQuery(params: { limit: number; offset: number }) {
  return usePaginatedListQuery<Blog>('blogs', params);
}
