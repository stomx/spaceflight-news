/**
 * Spaceflight News API에서 기사 목록을 조회하는 함수입니다.
 * @param params - limit, offset 등 쿼리 파라미터
 */
import { apiClient } from '@/shared/api/api-client';
import type { PaginatedArticleList } from './types';

export async function getArticles(params: { limit: number; offset: number }): Promise<PaginatedArticleList> {
  return await apiClient.get<PaginatedArticleList>('/articles/', params);
}
