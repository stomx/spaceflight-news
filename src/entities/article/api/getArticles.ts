/**
 * Spaceflight News API에서 기사 목록을 조회하는 함수입니다.
 */
import { apiClient } from '@/shared/api/api-client';
import type { PaginatedArticleList } from './types';

/**
 * 기사 목록을 조회합니다.
 * @param params - page, page_size 등 쿼리 파라미터
 */
export async function getArticles(params?: Record<string, string | number>): Promise<PaginatedArticleList> {
  return await apiClient.get<PaginatedArticleList>('/articles/', params);
}
