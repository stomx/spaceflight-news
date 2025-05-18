import { apiClient } from '@/shared/api/api-client';
import type { PaginatedList } from '@/shared/types/pagination';

export async function getPaginatedList<T>(
  resource: string,
  params: { limit: number; offset: number }
): Promise<PaginatedList<T>> {
  return await apiClient.get<PaginatedList<T>>(`/${resource}/`, params);
} 