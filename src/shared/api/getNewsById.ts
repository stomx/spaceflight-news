import { apiClient } from '@/shared/api/api-client';
import type { Article, Blog } from '@/shared/types/news';

/**
 * 개별 기사를 ID로 조회하는 API 함수
 */
export async function getArticleById(id: string | number): Promise<Article> {
  return await apiClient.get<Article>(`/articles/${id}/`);
}

/**
 * 개별 블로그를 ID로 조회하는 API 함수
 */
export async function getBlogById(id: string | number): Promise<Blog> {
  return await apiClient.get<Blog>(`/blogs/${id}/`);
}
