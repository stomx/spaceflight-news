import { apiClient } from '@/shared/api/api-client';
import type { PaginatedArticleList } from './types';

export async function getArticles(params: { limit: number; offset: number }): Promise<PaginatedArticleList> {
  return await apiClient.get<PaginatedArticleList>('/articles/', params);
}
