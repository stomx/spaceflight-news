import type { PaginatedBlogList } from '@/entities/blog/api/types';

import { getBlogs } from '@/entities/blog/api/getBlogs';
import { useQuery } from '@tanstack/react-query';

export interface BlogListQueryParams {
  limit: number;
  offset: number;
}

export function useBlogsQuery(params: BlogListQueryParams) {
  return useQuery<PaginatedBlogList, Error>({
    queryKey: ['blogs', params],
    queryFn: () => getBlogs(params),
  });
}
