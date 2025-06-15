import { useQuery } from '@tanstack/react-query';
import { getPaginatedList } from '@/shared/api/getPaginatedList';
import type { PaginatedResponse } from '@/shared/types/pagination';

export function usePaginatedListQuery<T>(resource: string, params: { limit: number; offset: number }) {
  return useQuery<PaginatedResponse<T>, Error>({
    queryKey: [resource, params],
    queryFn: () => getPaginatedList<T>(resource, params),
  });
}
