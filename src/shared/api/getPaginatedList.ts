import { apiClient } from '@/shared/api/api-client';
import type { PaginatedResponse } from '@/shared/types/pagination';

export async function getPaginatedList<T>(
  resource: string,
  params: { limit: number; offset: number },
): Promise<PaginatedResponse<T>> {
  return await apiClient.get<PaginatedResponse<T>>(`/${resource}/`, params);
}
