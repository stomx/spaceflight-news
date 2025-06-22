import { getArticleById, getBlogById } from '@/shared/api/getNewsById';
import type { Article, Blog } from '@/shared/types/news';
import { type UseQueryOptions, useQuery } from '@tanstack/react-query';

/**
 * 개별 기사를 조회하는 커스텀 훅
 */
export function useArticleQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<Article, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Article, Error>({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    ...options,
  });
}

/**
 * 개별 블로그를 조회하는 커스텀 훅
 */
export function useBlogQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<Blog, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<Blog, Error>({
    queryKey: ['blog', id],
    queryFn: () => getBlogById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    ...options,
  });
}

/**
 * 제네릭 뉴스 조회 훅 (Article 또는 Blog)
 */
export function useNewsQuery<T extends Article | Blog>(
  type: 'article' | 'blog',
  id: string | number,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, Error>({
    queryKey: [type, id],
    queryFn: () => {
      if (type === 'article') {
        return getArticleById(id) as Promise<T>;
      }
      return getBlogById(id) as Promise<T>;
    },
    enabled: !!id,
    ...options,
  });
}
