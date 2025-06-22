import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/shared/config';
import { usePaginatedListQuery } from '@/shared/hooks/usePaginatedListQuery';
import { useSearch } from '@tanstack/react-router';

/**
 * 뉴스/블로그 등 모든 도메인에서 사용 가능한 제네릭 리스트 모델 훅
 * @param resource API 리소스명(예: 'articles', 'blogs')
 */
export function useNewsListModel<T>(resource: string) {
  const search = useSearch({ strict: false });
  const page = Number(search.page) || DEFAULT_PAGE;
  const limit = Number(search.limit) || DEFAULT_LIMIT;
  const offset = (page - 1) * limit;
  const query = usePaginatedListQuery<T>(resource, { limit, offset });
  const totalCount = query.data?.count ?? 0;
  const totalPages = Math.ceil(totalCount / limit);
  return { page, limit, offset, search, totalPages, ...query };
}
