import { useQuery } from '@tanstack/react-query';
import { getPaginatedList } from '@/shared/api/getPaginatedList';
import type { PaginatedList } from '@/shared/types/pagination';

export function usePaginatedListQuery<T>(resource: string, params: { limit: number; offset: number }) {
  return useQuery<PaginatedList<T>, Error>({
    queryKey: [resource, params],
    queryFn: () => getPaginatedList<T>(resource, params),
  });
}
