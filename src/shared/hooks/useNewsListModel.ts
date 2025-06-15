import { usePaginatedListQuery } from '@/shared/hooks/usePaginatedListQuery';
import { useSearch } from '@tanstack/react-router';
import { NewsList } from '@/entities/news/components/NewsList';

/**
 * 뉴스/블로그 등 모든 도메인에서 사용 가능한 제네릭 리스트 모델 훅
 * @param resource API 리소스명(예: 'articles', 'blogs')
 * @param defaultLimit 기본 페이지 크기(옵션)
 */
export function useNewsListModel<T>(resource: string, defaultLimit = 3) {
  const search = useSearch({ strict: false });
  const page = Number(search.page) || 1;
  const limit = Number(search.limit) || defaultLimit;
  const offset = (page - 1) * limit;
  const query = usePaginatedListQuery<T>(resource, { limit, offset });
  const totalCount = query.data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);
  return { page, limit, offset, search, totalPages, ...query };
}
