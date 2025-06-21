/**
 * API 서버의 기본 URL입니다. 실제 환경에 맞게 수정하세요.
 */
export const API_URL = import.meta.env.VITE_API_URL || 'https://ll.thespacedevs.com/2.2.0';

/**
 * 페이지네이션 기본값
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 3;

/**
 * 환경 검증 함수
 */
export function validateEnvironment() {
  if (!API_URL) {
    throw new Error('API_URL이 설정되지 않았습니다.');
  }
}
