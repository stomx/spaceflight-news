import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/shared/config';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 페이지네이션 검색 파라미터에서 기본값과 동일한 값을 제거합니다.
 * @param search 현재 검색 파라미터
 * @param page 페이지 번호
 * @param limit 페이지 크기
 * @returns 기본값이 아닌 파라미터만 포함된 객체
 */
export function cleanSearchParams(
  search: Record<string, unknown>,
  page: number,
  limit: number,
): Record<string, unknown> {
  const cleanedParams = { ...search };

  // page가 기본값(1)이면 제거
  if (page === DEFAULT_PAGE) {
    cleanedParams.page = undefined;
  } else {
    cleanedParams.page = page;
  }

  // limit이 기본값(3)이면 제거
  if (limit === DEFAULT_LIMIT) {
    cleanedParams.limit = undefined;
  } else {
    cleanedParams.limit = limit;
  }

  return cleanedParams;
}
