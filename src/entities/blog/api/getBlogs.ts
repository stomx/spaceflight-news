import { apiClient } from '@/shared/api/api-client';
import type { PaginatedBlogList } from './types';

export async function getBlogs(params: { limit: number; offset: number }): Promise<PaginatedBlogList> {
  return await apiClient.get<PaginatedBlogList>('/blogs/', params);
}
